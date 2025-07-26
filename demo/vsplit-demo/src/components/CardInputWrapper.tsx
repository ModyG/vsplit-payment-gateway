'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardInput from './CardInput';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CardInputWrapperProps {
  cardNumber: number;
  amount: number;
  onPaymentComplete: (success: boolean, paymentMethod?: { id: string }) => void;
  disabled?: boolean;
  showPayButton?: boolean;
}

export default function CardInputWrapper(props: CardInputWrapperProps) {
  return (
    <Elements stripe={stripePromise}>
      <CardInput {...props} />
    </Elements>
  );
}
