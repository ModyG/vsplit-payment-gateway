'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SingleCardInput from './SingleCardInput';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface SingleCardInputWrapperProps {
  amount: number;
  onPaymentComplete: (success: boolean) => void;
  onPaymentStart: () => void;
}

export default function SingleCardInputWrapper(
  props: SingleCardInputWrapperProps
) {
  return (
    <Elements stripe={stripePromise}>
      <SingleCardInput {...props} />
    </Elements>
  );
}
