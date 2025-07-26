'use client';

import { useState } from 'react';
import { VSplitPaymentGateway } from '@vegaci_shared/vsplit-payment-gateway';
import StripeProvider from '@/components/StripeProvider';
import { ArrowLeft, CreditCard, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function BasicDemoPage() {
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [paymentAmount, setPaymentAmount] = useState(5000); // $50.00
  const [merchantSplit, setMerchantSplit] = useState(85); // 85%
  const [platformFee, setPlatformFee] = useState(15); // 15%

  const handlePayment = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      alert('Please configure your Stripe keys in .env.local');
      return;
    }

    try {
      setPaymentStatus('processing');

      // Initialize VSplit with demo configuration
      const gateway = new VSplitPaymentGateway({
        stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        apiEndpoint:
          process.env.NEXT_PUBLIC_VSPLIT_API_ENDPOINT ||
          'https://api.vsplit.com/v1',
        environment: 'sandbox',
        currency: 'usd',
      });

      // Calculate split amounts
      const merchantAmount = Math.round((paymentAmount * merchantSplit) / 100);
      const platformAmount = paymentAmount - merchantAmount;

      // Create split payment configuration
      const splitConfig = {
        splits: [
          {
            amount: merchantAmount,
            label: 'Merchant Revenue',
            recipient: 'merchant_account_id',
          },
          {
            amount: platformAmount,
            label: 'Platform Fee',
            recipient: 'platform_account_id',
          },
        ],
        timeout: 300,
        description: 'Basic split payment demo',
      };

      // Simulate payment processing (in real implementation, this would process the payment)
      console.log('Processing payment with gateway:', gateway);
      console.log('Split configuration:', splitConfig);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentStatus('success');
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
    }
  };

  const resetDemo = () => {
    setPaymentStatus('idle');
  };

  return (
    <StripeProvider>
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
                  Basic Split Payment Demo
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Demo Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Simple 2-Way Payment Split
            </h2>
            <p className="text-gray-600 mb-4">
              This demo shows how to split a payment between a merchant and
              platform fee. Perfect for marketplaces, SaaS platforms, or any
              business model requiring revenue sharing.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                What happens in this demo:
              </h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Customer pays total amount</li>
                <li>
                  • Payment is automatically split between merchant and platform
                </li>
                <li>• Each recipient receives their share instantly</li>
                <li>• Full transaction tracking and reporting</li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Payment Configuration
              </h3>

              {/* Payment Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={paymentAmount / 100}
                    onChange={(e) =>
                      setPaymentAmount(
                        Math.round(parseFloat(e.target.value) * 100)
                      )
                    }
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    step="0.01"
                    disabled={paymentStatus !== 'idle'}
                  />
                </div>
              </div>

              {/* Split Configuration */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Split
                </label>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Merchant Share
                      </span>
                      <span className="text-sm font-medium">
                        {merchantSplit}%
                      </span>
                    </div>
                    <input
                      type="range"
                      value={merchantSplit}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setMerchantSplit(value);
                        setPlatformFee(100 - value);
                      }}
                      className="w-full"
                      min="10"
                      max="90"
                      disabled={paymentStatus !== 'idle'}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Platform Fee
                      </span>
                      <span className="text-sm font-medium">
                        {platformFee}%
                      </span>
                    </div>
                    <input
                      type="range"
                      value={platformFee}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setPlatformFee(value);
                        setMerchantSplit(100 - value);
                      }}
                      className="w-full"
                      min="10"
                      max="90"
                      disabled={paymentStatus !== 'idle'}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={paymentStatus === 'processing'}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Process Split Payment
                  </>
                )}
              </button>

              {paymentStatus === 'success' && (
                <button
                  onClick={resetDemo}
                  className="w-full mt-3 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Try Another Payment
                </button>
              )}
            </div>

            {/* Split Visualization */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Payment Split Breakdown
              </h3>

              <div className="space-y-4">
                {/* Total Amount */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Payment</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${(paymentAmount / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Merchant Split */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">
                        Merchant Revenue
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-900">
                      $
                      {(
                        Math.round((paymentAmount * merchantSplit) / 100) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    {merchantSplit}% of total payment
                  </div>
                </div>

                {/* Platform Fee */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-900">
                        Platform Fee
                      </span>
                    </div>
                    <span className="text-xl font-bold text-green-900">
                      $
                      {(
                        Math.round((paymentAmount * platformFee) / 100) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    {platformFee}% platform commission
                  </div>
                </div>

                {/* Status */}
                {paymentStatus === 'success' && (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">
                        Payment completed successfully!
                      </span>
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      Funds have been split and transferred to recipients.
                    </div>
                  </div>
                )}

                {paymentStatus === 'error' && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                    <div className="flex items-center text-red-800">
                      <span className="font-medium">
                        Payment failed. Please try again.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-gray-900 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Implementation Code
            </h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
              {`// Initialize VSplit Gateway
const gateway = new VSplitPaymentGateway({
  stripePublishableKey: 'pk_test_...',
  environment: 'sandbox',
  currency: 'usd'
});

// Configure split payment
const splitConfig = {
  splits: [
    { 
      amount: ${Math.round((paymentAmount * merchantSplit) / 100)}, // $${(
                Math.round((paymentAmount * merchantSplit) / 100) / 100
              ).toFixed(2)}
      label: 'Merchant Revenue',
      recipient: 'merchant_account_id' 
    },
    { 
      amount: ${Math.round((paymentAmount * platformFee) / 100)}, // $${(
                Math.round((paymentAmount * platformFee) / 100) / 100
              ).toFixed(2)}
      label: 'Platform Fee',
      recipient: 'platform_account_id'
    }
  ]
};

// Process the split payment
await gateway.processSplitPayment(splitConfig);`}
            </pre>
          </div>
        </div>
      </div>
    </StripeProvider>
  );
}
