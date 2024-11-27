import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { CheckoutService } from '../../services/checkout.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StripeEmbeddedCheckout, StripeEmbeddedCheckoutOptions } from '@stripe/stripe-js';
import { StripeService } from 'ngx-stripe';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { TemporalOrder } from '../../models/temporal-order';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [NavComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

//https://docs.stripe.com/checkout/embedded/quickstart
export class CheckoutComponent implements OnInit, OnDestroy {

  @ViewChild('checkoutDialog')
  checkoutDialogRef: ElementRef<HTMLDialogElement>;

  orderDetails: TemporalOrder = null; // Orden temporal
  temporalOrderId: number = 0; // ID de la Orden temporal
  paymentMethod: string = ''; // Método de pago escogido
  routeQueryMap$: Subscription;
  stripeEmbedCheckout: StripeEmbeddedCheckout;
  refreshInterval: any; // Intervalo para refrescar la orden

  public readonly IMG_URL = environment.apiImg;

  constructor(
    private service: CheckoutService,
    private route: ActivatedRoute,
    private stripe: StripeService) { }

  ngOnInit() {

    this.routeQueryMap$ = this.route.queryParamMap.subscribe(queryMap => this.init(queryMap));
  }

  ngOnDestroy(): void {
    this.routeQueryMap$.unsubscribe();
    clearInterval(this.refreshInterval); // Detener el refresco de la orden
    this.cancelCheckoutDialog(); // destruyo la sesion
  }

  async init(queryMap: ParamMap) {
    console.log('Iniciando la página de checkout...');

    //  si el usuario acaba de iniciar sesión desde el redireccionamiento
    const justLoggedIn = sessionStorage.getItem('authRedirection') === 'true';
    sessionStorage.removeItem('authRedirection');

    this.temporalOrderId = parseInt(queryMap.get('session_id'));
    this.paymentMethod = queryMap.get('payment_method');

    console.log('ID:', this.temporalOrderId);
    console.log('Método de pago:', this.paymentMethod);
    console.log('Acaba de iniciar sesión:', justLoggedIn);

    if (!this.temporalOrderId) {
      console.error('No se proporcionó un ID de orden temporal, no se puede continuar.');
    } else {

      if (justLoggedIn) {
        console.log('El usuario acaba de iniciar sesión. Vinculando la orden temporal...');
        const linkResponse = await this.service.linkUserToOrder(this.temporalOrderId);

        if (!linkResponse.success) {
          console.error('Error al vincular la orden temporal:', linkResponse.error);
        }
      }

      console.log('Recuperando los detalles de la orden temporal...');
      const orderResponse = await this.service.getOrderDetails(this.temporalOrderId);

      if (orderResponse.success) {
        this.orderDetails = orderResponse.data;
        console.log('Detalles de la orden cargados:', this.orderDetails);
        console.log('Productos:', this.orderDetails.temporalProductOrder);
        this.startOrderRefresh(); //  refresco de la orden

        //  pago
        if (this.paymentMethod === 'stripe') {
          await this.embeddedCheckout();
        } else {
          console.log('Método de pago:', this.paymentMethod);
        }

      } else {
        console.error('Error al cargar los detalles de la orden:', orderResponse.error);
      }
    }
  }

  // Refrescar la orden orden temporal
  startOrderRefresh() {
    console.log('Iniciando el refresco de la orden temporal...');
    this.refreshInterval = setInterval(async () => {
      const refreshResponse = await this.service.refreshOrder(this.temporalOrderId);
      if (refreshResponse.success) {
        console.log('Orden temporal refrescada correctamente.');
      } else {
        console.error('Error al refrescar la orden temporal:', refreshResponse.error);
      }
    }, 60000); // Se refresca cada minuto
  }

  // Checkout embebido de Stripe
  async embeddedCheckout() {
    console.log('Iniciando el checkout embebido de Stripe...');
    const request = await this.service.getEmbededCheckout();

    if (request.success) {
      const options: StripeEmbeddedCheckoutOptions = {
        clientSecret: request.data.clientSecret,
        //onComplete: orderOnComplete()
      };

      this.stripe.initEmbeddedCheckout(options)
        .subscribe((checkout) => {
          this.stripeEmbedCheckout = checkout;
          checkout.mount('#checkout');
          this.checkoutDialogRef.nativeElement.showModal();
        });

    } else {
      console.error('Error al iniciar el checkout embebido:', request.error);
    }
  }

  cancelCheckoutDialog() {
    this.stripeEmbedCheckout.destroy();
    this.checkoutDialogRef.nativeElement.close();
  }
}
