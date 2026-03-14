import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(private stripe: Stripe) {
    this.stripe = new Stripe(process.env.PUBLISHABLE_KEY as string);
  }
  async chechoutSession({
    success_url = process.env.SUCCESS_URL as string,
    cancel_url = process.env.CANCELED_URL as string,
    mode = 'payment',
    discounts = [],
    metadata = {},
    customer_email,
    line_items,
  }: Stripe.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create({
      success_url,
      cancel_url,
      line_items,
      mode,
      discounts,
      metadata,
      customer_email,
    });
    return session;
  }
}
