'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, Clock } from 'lucide-react';

interface SingleCardInputProps {
  amount: number;
  onPaymentComplete: (success: boolean) => void;
  onPaymentStart: () => void;
}

export default function SingleCardInput({
  amount,
  onPaymentComplete,
  onPaymentStart,
}: SingleCardInputProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatAmount = (amount: number) => `$${(amount / 100).toFixed(2)}`;

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    setProcessing(true);
    setError(null);
    onPaymentStart();

    try {
      // Create payment method
      const { error: paymentMethodError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        setError(
          paymentMethodError.message || 'Payment method creation failed'
        );
        onPaymentComplete(false);
      } else {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate 95% success rate for single payments
        const success = Math.random() > 0.05;

        if (success) {
          onPaymentComplete(true);
        } else {
          setError('Payment declined - insufficient funds');
          onPaymentComplete(false);
        }
      }
    } catch {
      setError('Payment processing failed');
      onPaymentComplete(false);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Enter Card Details
      </h3>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {formatAmount(amount)}
        </div>
        <p className="text-gray-600">
          You will be charged this amount on your card
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-gray-300 rounded-md">
          <CardElement options={cardElementOptions} />
        </div>

        {error && (
          <div className="text-red-600 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={processing || !stripe || !elements}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {processing ? (
            <>
              <Clock className="h-5 w-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Pay ${formatAmount(amount)}`
          )}
        </button>

        {/* Test Card Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Test Cards for Demo:
          </h4>
          <div className="text-blue-800 text-sm space-y-1">
            <div>✓ Success: 4242 4242 4242 4242</div>
            <div>✗ Decline: 4000 0000 0000 0002</div>
            <div>Any future date, any 3-digit CVC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
