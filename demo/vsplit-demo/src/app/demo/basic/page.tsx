'use client';

import { useState } from 'react';
import CardInputWrapper from '@/components/CardInputWrapper';
import SingleCardInputWrapper from '@/components/SingleCardInputWrapper';
import {
  ArrowLeft,
  CreditCard,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function BasicDemoPage() {
  const [paymentType, setPaymentType] = useState<'single' | 'split' | null>(
    null
  );
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error' | 'timeout' | 'collecting-cards'
  >('idle');
  const [totalAmount] = useState(10000); // $100.00
  const [numberOfCards, setNumberOfCards] = useState(2);
  const [cardAmounts, setCardAmounts] = useState<number[]>([6000, 4000]); // $60 + $40
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [failedCards, setFailedCards] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes

  const handleSinglePayment = () => {
    setPaymentStatus('collecting-cards');
  };

  const handleSingleCardComplete = (success: boolean) => {
    if (success) {
      setPaymentStatus('success');
    } else {
      setPaymentStatus('error');
    }
  };

  const handleSingleCardStart = () => {
    setPaymentStatus('processing');
  };

  const handleSplitPayment = () => {
    setPaymentStatus('collecting-cards');
    setCompletedCards([]);
    setFailedCards([]);
  };

  const handleCardPaymentComplete = (cardIndex: number, success: boolean) => {
    if (success) {
      setCompletedCards((prev) => [...prev, cardIndex]);

      // Check if all cards are completed
      if (completedCards.length + 1 === numberOfCards) {
        setPaymentStatus('success');
      }
    } else {
      setFailedCards((prev) => [...prev, cardIndex]);
      setPaymentStatus('timeout');
      startTimeoutCountdown();
    }
  };

  const startTimeoutCountdown = () => {
    let remaining = 600; // 10 minutes
    const interval = setInterval(() => {
      remaining -= 1;
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        // Auto-refund successful payments
        refundSuccessfulPayments();
      }
    }, 1000);
  };

  const refundSuccessfulPayments = async () => {
    setPaymentStatus('processing');
    // Simulate refund process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPaymentStatus('error');
    setCompletedCards([]);
    setFailedCards([]);
  };

  const updateCardAmount = (index: number, amount: number) => {
    const newAmounts = [...cardAmounts];
    newAmounts[index] = amount;
    setCardAmounts(newAmounts);
  };

  const addCard = () => {
    if (numberOfCards < 5) {
      setNumberOfCards(numberOfCards + 1);
      setCardAmounts([...cardAmounts, 1000]);
    }
  };

  const removeCard = () => {
    if (numberOfCards > 2) {
      setNumberOfCards(numberOfCards - 1);
      setCardAmounts(cardAmounts.slice(0, -1));
    }
  };

  const totalSplitAmount = cardAmounts.reduce((sum, amount) => sum + amount, 0);
  const isValidSplit = totalSplitAmount === totalAmount;

  const resetDemo = () => {
    setPaymentType(null);
    setPaymentStatus('idle');
    setCompletedCards([]);
    setFailedCards([]);
    setTimeRemaining(600);
  };

  const formatAmount = (amount: number) => `$${(amount / 100).toFixed(2)}`;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <CreditCard className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Customer Split Payment Demo
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Customer Payment Splitting
          </h2>
          <p className="text-gray-600 mb-4">
            This demo shows how customers can choose to split their payment
            across multiple cards. Perfect for large purchases, spending limits,
            or when customers want to use multiple payment methods.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              What happens in this demo:
            </h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>
                • Customer chooses single payment or split across multiple cards
              </li>
              <li>
                • Each card is processed separately with timeout protection
              </li>
              <li>
                • If any card fails, successful payments are automatically
                refunded
              </li>
              <li>• Customer has time to retry failed cards before refund</li>
            </ul>
          </div>
        </div>

        {!paymentType && paymentStatus === 'idle' && (
          /* Payment Method Selection */
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Choose Payment Method for {formatAmount(totalAmount)}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Single Payment Option */}
              <div
                className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                onClick={() => setPaymentType('single')}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-center mb-2">
                  Single Card Payment
                </h4>
                <p className="text-gray-600 text-center text-sm">
                  Pay the full amount with one card quickly and easily
                </p>
                <div className="mt-4 text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatAmount(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Split Payment Option */}
              <div
                className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                onClick={() => setPaymentType('split')}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-center mb-2">
                  Split Across Cards
                </h4>
                <p className="text-gray-600 text-center text-sm">
                  Divide the payment across multiple cards as you prefer
                </p>
                <div className="mt-4 text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatAmount(totalAmount)}
                  </span>
                  <div className="text-sm text-gray-500">
                    across {numberOfCards} cards
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentType === 'split' && paymentStatus === 'idle' && (
          /* Split Payment Configuration */
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Configure Your Payment Split
            </h3>

            {/* Number of Cards */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cards
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={removeCard}
                  disabled={numberOfCards <= 2}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{numberOfCards}</span>
                <button
                  onClick={addCard}
                  disabled={numberOfCards >= 5}
                  className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Card Amount Inputs */}
            <div className="space-y-4 mb-6">
              {cardAmounts.slice(0, numberOfCards).map((amount, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4"
                >
                  <span className="w-16 text-sm font-medium text-gray-700">
                    Card {index + 1}:
                  </span>
                  <input
                    type="number"
                    value={amount / 100}
                    onChange={(e) =>
                      updateCardAmount(
                        index,
                        Math.round(parseFloat(e.target.value || '0') * 100)
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <span className="text-lg font-semibold text-gray-900 w-20">
                    {formatAmount(amount)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Validation */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  Total Split Amount:
                </span>
                <span
                  className={`text-lg font-bold ${
                    isValidSplit ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatAmount(totalSplitAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  Required Amount:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatAmount(totalAmount)}
                </span>
              </div>
              {!isValidSplit && (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Split amounts must equal {formatAmount(totalAmount)}
                </div>
              )}
            </div>

            <button
              onClick={handleSplitPayment}
              disabled={!isValidSplit}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Process Split Payment
            </button>
          </div>
        )}

        {paymentType === 'single' && paymentStatus === 'idle' && (
          /* Single Payment Confirmation */
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Confirm Single Payment
            </h3>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {formatAmount(totalAmount)}
              </div>
              <p className="text-gray-600">
                You will be charged this amount on your card
              </p>
            </div>

            <button
              onClick={handleSinglePayment}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Process Single Payment
            </button>
          </div>
        )}

        {paymentType === 'single' && paymentStatus === 'collecting-cards' && (
          /* Single Card Input */
          <SingleCardInputWrapper
            amount={totalAmount}
            onPaymentComplete={handleSingleCardComplete}
            onPaymentStart={handleSingleCardStart}
          />
        )}

        {paymentType === 'split' && paymentStatus === 'collecting-cards' && (
          /* Split Payment Card Inputs */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Enter Card Details for Each Payment
              </h3>
              <p className="text-gray-600 mb-6">
                Process each card payment one at a time. You can use the test
                cards shown below each form.
              </p>
            </div>

            {cardAmounts.slice(0, numberOfCards).map((amount, index) => (
              <CardInputWrapper
                key={index}
                cardNumber={index + 1}
                amount={amount}
                onPaymentComplete={(success: boolean) =>
                  handleCardPaymentComplete(index, success)
                }
                disabled={
                  completedCards.includes(index) || failedCards.includes(index)
                }
                showPayButton={
                  !completedCards.includes(index) &&
                  !failedCards.includes(index)
                }
              />
            ))}
          </div>
        )}

        {/* Payment Status Display */}
        {(paymentStatus === 'processing' ||
          paymentStatus === 'success' ||
          paymentStatus === 'error' ||
          paymentStatus === 'timeout') && (
          <div className="space-y-6">
            {/* Payment Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Status
              </h3>

              {paymentStatus === 'processing' && (
                <div className="flex items-center text-blue-600 mb-4">
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Processing payment{paymentType === 'split' ? 's' : ''}...
                </div>
              )}

              {paymentType === 'split' && (
                <div className="space-y-3">
                  {cardAmounts.slice(0, numberOfCards).map((amount, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <span className="font-medium">
                        Card {index + 1}: {formatAmount(amount)}
                      </span>
                      <div className="flex items-center">
                        {completedCards.includes(index) && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            Completed
                          </div>
                        )}
                        {failedCards.includes(index) && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-5 w-5 mr-1" />
                            Failed
                          </div>
                        )}
                        {!completedCards.includes(index) &&
                          !failedCards.includes(index) &&
                          paymentStatus === 'processing' && (
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-5 w-5 mr-1 animate-spin" />
                              Processing...
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {paymentStatus === 'timeout' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    Payment Timeout - {formatTime(timeRemaining)} remaining
                  </div>
                  <p className="text-sm text-yellow-700">
                    Some card payments failed. You have{' '}
                    {formatTime(timeRemaining)} to retry before successful
                    payments are refunded.
                  </p>
                </div>
              )}
            </div>

            {/* Final Success/Error */}
            {paymentStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Payment Completed Successfully!
                </h3>
                <p className="text-green-700 mb-4">
                  {paymentType === 'single'
                    ? `Payment of ${formatAmount(
                        totalAmount
                      )} processed successfully`
                    : `All ${numberOfCards} card payments completed successfully`}
                </p>
                <button
                  onClick={resetDemo}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Another Payment
                </button>
              </div>
            )}

            {paymentStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  Payment Failed
                </h3>
                <p className="text-red-700 mb-4">
                  {failedCards.length > 0
                    ? 'Some card payments failed and successful payments have been refunded'
                    : 'Payment could not be processed'}
                </p>
                <button
                  onClick={resetDemo}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Code Example */}
        {paymentStatus === 'success' && (
          <div className="bg-gray-900 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Implementation Code
            </h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
              {paymentType === 'single'
                ? `// Single card payment
const gateway = new VSplitPaymentGateway({
  stripePublishableKey: 'pk_test_...',
  environment: 'sandbox'
});

const result = await gateway.initializePayment({
  amount: ${totalAmount},
  currency: 'usd',
  orderId: 'order_123'
});`
                : `// Customer split payment
const gateway = new VSplitPaymentGateway({
  stripePublishableKey: 'pk_test_...',
  environment: 'sandbox'
});

const splitSession = await gateway.initializeSplitPayment({
  totalAmount: ${totalAmount},
  numberOfCards: ${numberOfCards},
  cardAmounts: [${cardAmounts.slice(0, numberOfCards).join(', ')}],
  currency: 'usd',
  orderId: 'order_123',
  timeout: 600
});

// Process each card payment
for (let i = 0; i < splitSession.cardPayments.length; i++) {
  await gateway.processSplitPayment(splitSession.sessionId, i, paymentMethod);
}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
