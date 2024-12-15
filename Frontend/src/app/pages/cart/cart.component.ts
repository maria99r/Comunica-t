import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart';
import { ProductCart } from '../../models/productCart';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavComponent, FooterComponent, ButtonModule, FormsModule, CommonModule, ToastModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartProducts: ProductCart[] = [];  // local
  cart: Cart;  // bbdd
  public readonly IMG_URL = environment.apiImg;

  numProducts : number = 0;

  isLog: boolean; // para comprobar si esta o no logueado

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private api: ApiService,
    private messageService: MessageService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loadCart();
  }

  async loadCart() {
    const user = this.authService.getUser();
    const userId = user ? user.userId : null;

    // dependiendo de si el usuario esta o no logueado
    if (user) {
      //console.log("Carrito: Sesión iniciada")
      this.cart = await this.cartService.getCartByUser(userId);
      //console.log("Carrito bbdd: ", this.cart)
      this.isLog = true;
      this.numProducts = this.cart.products.length;
      this.checkStock(this.cart.products)
    }
    else {
      //console.log("Carrito: Sesión NO iniciada")
      this.cartProducts = this.cartService.getCartFromLocal();
      //console.log(this.cartProducts)
      this.isLog = false;
      this.numProducts = this.cartProducts.length;
      this.checkStock(this.cartProducts)
    }

  }

  // Comprueba el stock del carrito y lo actualiza
  async checkStock(carrito: ProductCart[]): Promise<boolean> {
    let allProductStock = true; // Para saber si hay suficiente stock de todos los productos

    for (const producto of carrito) {
      const user = this.authService.getUser();
      let productBack: Product;
      productBack = await this.api.getProduct(producto.productId);

      if (productBack.stock < producto.quantity) {
        allProductStock = false;

        producto.quantity = productBack.stock;

        // Si el nuevo stock es menor a 1, se elimina del carrito
        if (producto.quantity < 1) {

          if (user) {
            await this.cartService.removeFromCartBBDD(this.cart.id, producto.productId).toPromise();
            this.loadCart();
          } else {
            this.cartService.removeFromCartLocal(producto.productId);
            this.cartProducts = this.cartService.getCartFromLocal();
          }

        } else {
          if (user) {
            await this.cartService.updateCartProductBBDD(user.userId, producto.productId, producto.quantity).toPromise();
          } else {
            this.cartService.updateCartProductLocal(producto);
          }
        }
      }
    }
    this.cartService.notifyCartChange(); // Notificar el cambio en la cantidad
    return allProductStock;
  }

  // Método para actualizar la cantidad de un producto en el carrito
  changeQuantityLocal(product: ProductCart, quantity: number): void {
    if (product.quantity <= 0) {
      this.removeProductLocal(product);
    } else {
      product.quantity = quantity;
      this.cartService.updateCartProductLocal(product);
    }
    this.cartService.notifyCartChange(); // Notificar el cambio en la cantidad
    this.loadCart();
  }


  // cambiar cantidad de un producto en el carrito de BBDD
  async changeQuantityBBDD(product: ProductCart, newQuantity: number): Promise<void> {
    try {

      const user = this.authService.getUser();
      const userId = user ? user.userId : null;

      if (!userId) {
        console.log("No hay usuario logueado")
      }

      console.log("Nueva cantidad: " + newQuantity)

      if (newQuantity <= 0) {
        this.throwError("cart", "La cantidad no puede ser menor o igual a 0");
      }
      const response = await this.cartService.updateCartProductBBDD(userId, product.productId, newQuantity).toPromise();
      //console.log(response)
      this.cartService.notifyCartChange(); // Notificar el cambio en la cantidad
      await this.loadCart();

    } catch (error) {
      console.error('Error al actualizar la cantidad del producto:', error);
      this.throwError("cart", "Error al actualizar la cantidad del producto.");
    }
  }


  // eliminar un producto del carrito
  removeProductLocal(product: ProductCart): void {
    this.cartService.removeFromCartLocal(product.productId);
    this.cartProducts = this.cartService.getCartFromLocal();
    this.throwDialog("cart", "Producto eliminado del carrito correctamente.");
    this.cartService.notifyCartChange(); // Notificar el cambio en la cantidad
    console.log('Eliminado producto con la id:', product.productId); // Log :D
  }

  // eliminar un producto del carrito de la bbdd 
  async removeProductBBDD(productId: number): Promise<void> {
    try {
      const response = await this.cartService.removeFromCartBBDD(this.cart.id, productId).toPromise();
      this.throwDialog("cart", response);
      this.cartService.notifyCartChange(); // Notificar el cambio en la cantidad
      this.loadCart();

    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      this.throwError("cart", "Hubo un error al eliminar el producto.");
    }
  }


  // Calcula el total del carrito
  get total(): number {
    let sum = 0;

    if (this.isLog) {
      if (this.cartProducts === null) {
        sum = 0;
      } else {
        for (let line of this.cart.products) {
          sum += line.product.price / 100 * (line.quantity || 1);
        }
      }

    } else {
      if (this.cartProducts === null) {
        sum = 0;
      } else {
        for (let product of this.cartProducts) {
          sum += product.product.price / 100 * (product.quantity || 1);
        }
      }

    }
    return sum;
  }

  // STRIPE
  goToCheckout() {
    this.goToPayment('stripe', '/checkout');
  }

  // BLOCKCHAIN
  goToBlockchain() {

    if (!window.ethereum) {
      this.throwError("cart", "No está instalado Metamask.");
      throw new Error('Metamask not found');
    } else{
      this.goToPayment('blockchain', '/blockchain');
    }
    
  }

  async goToPayment(paymentMethod: string, redirectRoute: string) {
    let allProductStock = true;

    // Comprobar si ha cambiado el stock de los productos
    if (this.isLog) {
      //console.log("Comprobando stock de los productos para usuario logueado...");
      allProductStock = await this.checkStock(this.cart.products);
    } else {
      //console.log("Comprobando stock de los productos para usuario no logueado...");
      allProductStock = await this.checkStock(this.cartProducts);
    }

    // Si el stock no ha cambiado en ningún producto, se crea la orden
    if (allProductStock) {
      let createOrder: Observable<any>;

      if (this.isLog) {
       // console.log("Creando orden en BBDD...");
        this.checkStock(this.cart.products);
        createOrder = this.cartService.newTemporalOrderBBDD(this.cart, paymentMethod);
      } else {
        //console.log("Creando orden localmente...");
        this.checkStock(this.cartProducts);
        createOrder = this.cartService.newTemporalOrderLocal(this.cartProducts, paymentMethod);
      }

      createOrder.subscribe({
        next: (response: any) => {
          //console.log("Orden creada exitosamente: ", response);
          const temporalOrderId = response.id;

          this.router.navigate([redirectRoute], {
            queryParams: {
              temporalOrderId: temporalOrderId,
              paymentMethod: paymentMethod,
            },
          });
        },
        error: (err: any) => {
          console.error("Error al crear la orden: ", err);
          this.throwError("cart", "Error al crear el pedido.");
        },
      });

      this.cartService.actionSource = 'checkout';

      // Si no hay stock en algún producto, no se crea la orden
    } else {
      console.error("No hay suficiente stock en algún producto.");
    }
  }

  // Cuadro de notificación de éxito
  throwDialog(key: string, texto: string) {
    this.messageService.add({ key: key, severity: 'success', summary: 'Éxito', detail: texto })
  }

  // Cuadro de notificación de error
  throwError(key: string, error: string) {
    this.messageService.add({ key: key, severity: 'error', summary: 'Error', detail: error })
  }

}