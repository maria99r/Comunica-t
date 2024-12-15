import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StripeEmbeddedCheckout, StripeEmbeddedCheckoutOptions } from '@stripe/stripe-js';
import { StripeService } from 'ngx-stripe';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { TemporalOrder } from '../../models/temporal-order';
import { environment } from '../../../environments/environment';
import { Order } from '../../models/order';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [NavComponent, FooterComponent, ToastModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent implements OnInit, OnDestroy {

  orderDetails: TemporalOrder = null; // Orden temporal
  temporalOrderId: number = null; // ID de la Orden temporal
  paymentMethod: string = ''; // Método de pago escogido
  routeQueryMap$: Subscription;
  stripeEmbedCheckout: StripeEmbeddedCheckout;
  refreshInterval: any; // Intervalo para refrescar la orden
  isLoading: boolean = true;

  createdOrder: Order; // el pedido cuando se cree

  public readonly IMG_URL = environment.apiImg;

  constructor(
    private service: CheckoutService,
    private stripe: StripeService,
    private route: ActivatedRoute,
    public router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.routeQueryMap$ = this.route.queryParamMap.subscribe(queryMap => this.init(queryMap));
  }

  ngOnDestroy(): void { // Verifica que la suscripción, el refresco y la sesión existen antes de destruirlos
    if (this.routeQueryMap$) {
      this.routeQueryMap$.unsubscribe();
     // console.log("Suscripción eliminada");
    }

    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      //console.log("Intervalo eliminado");
    }

    if (this.stripeEmbedCheckout) {
      this.cancelCheckoutDialog();
     // console.log("Sesión eliminada");
    }
  }

  async init(queryMap: ParamMap) {
    console.log("Iniciando la página de checkout (tarjeta)...");

    // si el usuario acaba de iniciar sesión desde el redireccionamiento
    const justLoggedIn = sessionStorage.getItem("authRedirection") === 'true';
    sessionStorage.removeItem("authRedirection");

    this.temporalOrderId = parseInt(queryMap.get("temporalOrderId"));

    if (isNaN(this.temporalOrderId)) { // Comprueba que la ID no está vacía
      console.error("El ID de la Orden temporal no es válido: ", this.temporalOrderId);
      this.throwError("catalogError");
    }

    this.paymentMethod = queryMap.get("paymentMethod");

   // console.log("ID de la Orden temporal:", this.temporalOrderId);
    //console.log("Método de pago:", this.paymentMethod);
    //console.log("Acaba de iniciar sesión:", justLoggedIn);

    if (justLoggedIn) {
     // console.log("El usuario acaba de iniciar sesión. Vinculando la orden temporal...");
      const linkResponse = await this.service.linkUserToOrder(this.temporalOrderId);

      if (linkResponse.success) {
      //  console.log("La orden temporal se vinculó exitosamente:", linkResponse.data);
      } else {
        console.error("Error al vincular la orden temporal:", linkResponse.error);
        this.throwError("catalogError");
      }
    }

   // console.log("Recuperando los detalles de la orden temporal...");
    const orderResponse = await this.service.getOrderDetails(this.temporalOrderId);

    if (orderResponse.success) {
      this.orderDetails = orderResponse.data;
     // console.log("Detalles de la orden cargados:", this.orderDetails);
      //console.log("Productos:", this.orderDetails.temporalProductOrder);
      this.startOrderRefresh(); // refresco de la orden

      // pago
      if (this.paymentMethod === "stripe") {
        this.isLoading = false;
        await this.embeddedCheckout();
      } else {
        console.error("El método de pago no es en stripe");
        this.throwError("catalogError");
      }

    } else {
      console.error("Error al cargar los detalles de la orden:", orderResponse.error);
      this.throwError("catalogError");
    }
  }

  // Refrescar la orden orden temporal
  startOrderRefresh() {
   // console.log("Iniciando el refresco de la orden temporal...");
    this.refreshInterval = setInterval(async () => {
      const refreshResponse = await this.service.refreshOrder(this.temporalOrderId);
      if (refreshResponse.success) {
     //   console.log("Orden temporal refrescada correctamente.");
      } else {
        console.error("Error al refrescar la orden temporal:", refreshResponse.error);
        this.throwError("catalogError");
      }
    }, 60000); // Se refresca cada minuto
  }

  // Checkout embebido de Stripe
  async embeddedCheckout() {
    //console.log("Iniciando el checkout embebido de Stripe...");
    try {
      const request = await this.service.getEmbededCheckout(this.temporalOrderId);
      if (request.success) {
        const options: StripeEmbeddedCheckoutOptions = {
          clientSecret: request.data.clientSecret,
          onComplete: () => this.orderOnComplete()
        };

        this.stripe.initEmbeddedCheckout(options).subscribe({
          next: (checkout) => { // next-error son similares a un try-catch en el subscribe
            this.stripeEmbedCheckout = checkout;
            checkout.mount("#checkout");
          },
          error: (err) => {
            console.error("Error al inicializar el checkout embebido:", err);
            this.throwError("catalogError");
          }
        });
      } else {
        console.error("Error al iniciar el checkout embebido:", request.error);
        this.throwError("catalogError");
      }
    } catch (err) {
      console.error("Error en el proceso de checkout:", err);
      this.throwError("catalogError");
    }
  }

  orderOnComplete() {

    this.throwDialog("catalog", "Transacción realizada con éxito. ¡Gracias por tu compra!");

    // creo pedido 
    this.service.newOrder(this.temporalOrderId).subscribe({
      next: (order: Order) => {
        this.createdOrder = order;
        console.log('Pedido creado:', this.createdOrder);

        setTimeout(() => {
          this.router.navigate(['/order-success/', this.createdOrder.id]);
        }, 500); // Espera 500 milisegundos por si acaso
      },
      error: (err) => {
        console.error('Error al crear el pedido:', err);
        this.throwError("catalogError");
      },
    });
  }

  cancelCheckoutDialog() {
    if (this.stripeEmbedCheckout) {
      this.stripeEmbedCheckout.destroy();
    }
  }

  // Cuadro de notificación de éxito
  throwDialog(key: string, texto: string) {
    this.messageService.add({ key: key, severity: 'success', summary: 'Éxito', detail: texto })
  }

  // Cuadro de notificación de error
  throwError(key: string) {
    this.messageService.add({ key: key, severity: 'error', summary: 'Error', detail: "Se ha producido un error procesando tu pedido." })
  }

}