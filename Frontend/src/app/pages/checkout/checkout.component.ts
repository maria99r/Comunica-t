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
export class CheckoutComponent implements OnInit, OnDestroy  {

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
    private stripe: StripeService) {}

  ngOnInit() {
    console.log('ngOnInit called');
    // El evento ngOnInit solo se llama una vez en toda la vida del componente.
    // Por tanto, para poder captar los cambios en la url nos suscribimos al queryParamMap del route.
    // Cada vez que se cambie la url se llamará al método onInit
    this.routeQueryMap$ = this.route.queryParamMap.subscribe(queryMap => this.init(queryMap));
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    // Cuando este componente se destruye hay que cancelar la suscripción.
    // Si no se cancela se seguirá llamando aunque el usuario no esté ya en esta página
    this.routeQueryMap$.unsubscribe();
  }

  async init(queryMap: ParamMap) {
    console.log('init method called');
    this.sessionId = queryMap.get('session_id');
    console.log('Session ID:', this.sessionId);
  
    if (this.sessionId) {
      const request = await this.service.getStatus(this.sessionId);
  
      if (request.success) {
        console.log('Status Request Success:', request.data);
      } else {
        console.error('Status Request Failed:', request);
      }
    } else {
      const request = await this.service.getAllProducts();
      console.log('Product Request:', request);
  
      if (request.success) {
        this.product = request.data[0];
        console.log('Product Loaded:', this.product);
      } else {
        // Aquí mejoramos el log para mostrar el error de la API
        console.error('Product Request Failed:', request);
        if (request.error) {
          console.error('Error details:', request.error);
        }
      }
    }
  }

  async hostedCheckout() {
    console.log('hostedCheckout method called');
    const request = await this.service.getHostedCheckout();

    if (request.success) {
      console.log('Hosted Checkout Success:', request.data);
      // Abrimos la url de la session de stripe sin crear una nueva pestaña en el navegador 
      window.open(request.data.sessionUrl, '_self');
    } else {
      console.error('Hosted Checkout Failed:', request);
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
          
          // Verifica si el elemento está presente
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

  reload() {
    console.log('reload method called');
    this.router.navigate(['checkout']);
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
