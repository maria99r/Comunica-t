import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { CheckoutService } from '../../services/checkout.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StripeEmbeddedCheckout, StripeEmbeddedCheckoutOptions } from '@stripe/stripe-js';
import { StripeService } from 'ngx-stripe';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";

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

  product: Product = null;
  sessionId: string = '';
  paymentMethod: string = ''; // Método de pago escogido
  routeQueryMap$: Subscription;
  stripeEmbedCheckout: StripeEmbeddedCheckout;

  constructor(
    private service: CheckoutService,
    private route: ActivatedRoute,
    private router: Router,
    private stripe: StripeService) { }

  ngOnInit() {
    this.routeQueryMap$ = this.route.queryParamMap.subscribe(queryMap => this.init(queryMap));
  }

  ngOnDestroy(): void {
    this.routeQueryMap$.unsubscribe();
  }

  async init(queryMap: ParamMap) {
    this.sessionId = queryMap.get('session_id');
    this.paymentMethod = queryMap.get('payment_method');

    console.log('Session ID:', this.sessionId);
    console.log('Payment Method:', this.paymentMethod);

    if (this.sessionId) {
      const request = await this.service.getStatus(this.sessionId);

      if (request.success) {
        console.log('Status Request Success:', request.data);
      } else {
        console.error('Status Request Failed:', request);
      }
    } else {
      const request = await this.service.getAllProducts();

      if (request.success) {
        this.product = request.data[0];
        console.log('Product Loaded:', this.product);

        if (this.paymentMethod === 'stripe') {
          await this.embeddedCheckout(); // Inicia el checkout embebido con Stripe
        } else {
          // Pago con Ethereum
          console.log("Se va a pagar con Ethereum");
        }
      } else {
        console.error('Product Request Failed:', request);
      }
    }
  }

  async embeddedCheckout() {
    console.log('embeddedCheckout method called');
    const request = await this.service.getEmbededCheckout();

    if (request.success) {
      console.log('Embedded Checkout Success:', request.data);

      const options: StripeEmbeddedCheckoutOptions = {
        clientSecret: request.data.clientSecret
      };

      this.stripe.initEmbeddedCheckout(options)
        .subscribe((checkout) => {
          this.stripeEmbedCheckout = checkout;
          console.log('Stripe Embedded Checkout Initialized:', checkout);
          checkout.mount('#checkout');

          if (this.checkoutDialogRef && this.checkoutDialogRef.nativeElement) {
            console.log('Dialog Element:', this.checkoutDialogRef.nativeElement);
            if (this.checkoutDialogRef.nativeElement.showModal) {
              console.log('Calling showModal');
              this.checkoutDialogRef.nativeElement.showModal();
            } else {
              console.error('showModal not available on dialog element');
            }
          } else {
            console.error('Checkout dialog element is null or undefined');
          }
        });
    } else {
      console.error('Embedded Checkout Request Failed:', request);
    }
  }

  cancelCheckoutDialog() {
    console.log('cancelCheckoutDialog method called');
    if (this.stripeEmbedCheckout) {
      console.log('Destroying Stripe Checkout');
      this.stripeEmbedCheckout.destroy();
    }

    if (this.checkoutDialogRef && this.checkoutDialogRef.nativeElement) {
      console.log('Closing dialog');
      this.checkoutDialogRef.nativeElement.close();
    } else {
      console.error('Dialog element is null or undefined');
    }
  }
}
