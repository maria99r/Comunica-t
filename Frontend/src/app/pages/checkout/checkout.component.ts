import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { StripeService } from 'ngx-stripe';
import {
  StripeEmbeddedCheckout,
  StripeEmbeddedCheckoutOptions,
} from '@stripe/stripe-js';
import { Product } from '../../models/product';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})

//https://docs.stripe.com/checkout/embedded/quickstart
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('checkoutDialog')
  checkoutDialogRef: ElementRef<HTMLDialogElement>;

  product: Product = null;
  sessionId: string = '';
  routeQueryMap$: Subscription;
  stripeEmbedCheckout: StripeEmbeddedCheckout;

  constructor(
    private service: CheckoutService,
    private route: ActivatedRoute,
    private router: Router,
    private stripe: StripeService
  ) {}

  ngOnInit() {
    this.routeQueryMap$ = this.route.queryParamMap.subscribe((queryMap) =>
      this.init(queryMap)
    );
  }

  ngOnDestroy(): void {
    this.routeQueryMap$.unsubscribe();
  }

  async init(queryMap: ParamMap) {
    this.sessionId = queryMap.get('session_id');

    if (this.sessionId) {
      const request = await this.service.getStatus(this.sessionId);

      if (request.success) {
        console.log(request.data);
      }
    } else {
      const request = await this.service.getAllProducts();

      if (request.success) {
        this.product = request.data[0];
      }
    }
  }

  async hostedCheckout() {
    const request = await this.service.getHostedCheckout();

    if (request.success) {
      // Abrimos la url de la session de stripe sin crear una nueva pestaña en el navegador
      window.open(request.data.sessionUrl, '_self');
    }
  }

  async embeddedCheckout() {
    const request = await this.service.getEmbededCheckout();

    if (request.success) {
      const options: StripeEmbeddedCheckoutOptions = {
        clientSecret: request.data.clientSecret,
      };

      this.stripe.initEmbeddedCheckout(options).subscribe((checkout) => {
        this.stripeEmbedCheckout = checkout;
        checkout.mount('#checkout');
        this.checkoutDialogRef.nativeElement.showModal();
      });
    }
  }

  reload() {
    this.router.navigate(['checkout']);
  }

  cancelCheckoutDialog() {
    this.stripeEmbedCheckout.destroy();
    this.checkoutDialogRef.nativeElement.close();
  }
}
