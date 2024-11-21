import { Component, OnInit } from '@angular/core';
import { StripeService } from 'ngx-stripe';
import { StripeEmbeddedCheckout, StripeEmbeddedCheckoutOptions } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

//https://docs.stripe.com/checkout/embedded/quickstart
export class CheckoutComponent implements OnInit{
  
  constructor(private stripeService: StripeService){}

  ngOnInit(): void {
      
  }
}
