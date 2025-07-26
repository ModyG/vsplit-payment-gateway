'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface CardInputProps {
  cardNumber: number;
  amount: number;
  onPaymentComplete: (success: boolean, paymentMethod?: { id: string }) => void;
  disabled?: boolean;
  showPayButton?: boolean;
}

export default function CardInput({
  cardNumber,
  amount,
  onPaymentComplete,
  disabled = false,
  showPayButton = true,
}: CardInputProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
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

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
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

        // Simulate 90% success rate for demo
        const success = Math.random() > 0.1;

        if (success) {
          setCompleted(true);
          onPaymentComplete(true, paymentMethod);
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
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Card {cardNumber}
        </h4>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatAmount(amount)}
          </div>
          {completed && (
            <div className="flex items-center text-green-600 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed
            </div>
          )}
          {processing && (
            <div className="flex items-center text-blue-600 text-sm mt-1">
              <Clock className="h-4 w-4 mr-1 animate-spin" />
              Processing...
            </div>
          )}
          {error && (
            <div className="flex items-center text-red-600 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              Failed
            </div>
          )}
        </div>
      </div>

      {!completed && (
        <div className="space-y-4">
          <div className="p-3 border border-gray-300 rounded-md">
            <CardElement options={cardElementOptions} />
          </div>

          {error && (
            <div className="text-red-600 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}

          {showPayButton && (
            <button
              onClick={handlePayment}
              disabled={disabled || processing || !stripe || !elements}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? 'Processing...' : `Pay ${formatAmount(amount)}`}
            </button>
          )}

          {/* Test Card Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="font-medium text-blue-900 text-sm mb-2">
              Test Cards for Demo:
            </h5>
            <div className="text-blue-800 text-xs space-y-1">
              <div>✓ Success: 4242 4242 4242 4242</div>
              <div>✗ Decline: 4000 0000 0000 0002</div>
              <div>Any future date, any 3-digit CVC</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
