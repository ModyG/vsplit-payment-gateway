/**
 * React integration example for VSplit Payment Gateway
 */

import React, { useState, useEffect } from 'react';
import {
  VSplitProvider,
  useVSplit,
  PaymentForm,
  SplitPayment,
} from '@vsplit/payment-gateway/react';

// Main App Component
export function App() {
  return (
    <VSplitProvider
      config={{
        stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!,
        apiEndpoint: process.env.REACT_APP_API_ENDPOINT!,
        apiKey: process.env.REACT_APP_API_KEY,
        currency: 'usd',
        defaultTimeout: 600,
        theme: {
          primaryColor: '#007bff',
          borderRadius: '8px',
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            VSplit Payment Gateway Demo
          </h1>
          <PaymentDashboard />
        </div>
      </div>
    </VSplitProvider>
  );
}

// Payment Dashboard Component
function PaymentDashboard() {
  const [activeTab, setActiveTab] = useState<'single' | 'split'>('single');

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-1 shadow-md">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'single'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Single Payment
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'split'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Split Payment
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'single' && <SinglePaymentDemo />}
      {activeTab === 'split' && <SplitPaymentDemo />}
    </div>
  );
}

// Single Payment Demo Component
function SinglePaymentDemo() {
  const { initializePayment, status, loading, error, currentSession } =
    useVSplit();

  const [amount, setAmount] = useState(5000); // $50.00
  const [orderId, setOrderId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentInitialized, setPaymentInitialized] = useState(false);

  // Generate random order ID on mount
  useEffect(() => {
    setOrderId(`order_${Math.random().toString(36).substring(7)}`);
  }, []);

  const handleInitializePayment = async () => {
    try {
      const result = await initializePayment({
        amount,
        currency: 'usd',
        orderId,
        customer: {
          email: customerEmail || undefined,
        },
        metadata: {
          demo: 'true',
          timestamp: new Date().toISOString(),
        },
      });

      if (result.success) {
        setPaymentInitialized(true);
      }
    } catch (err) {
      console.error('Failed to initialize payment:', err);
    }
  };

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
    alert('Payment successful! Check console for details.');
    setPaymentInitialized(false);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Single Payment Demo</h2>

      {!paymentInitialized ? (
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (cents)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5000"
            />
            <p className="text-sm text-gray-500 mt-1">
              ${(amount / 100).toFixed(2)}
            </p>
          </div>

          {/* Order ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="order_123"
            />
          </div>

          {/* Customer Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Email (optional)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="customer@example.com"
            />
          </div>

          {/* Initialize Button */}
          <button
            onClick={handleInitializePayment}
            disabled={loading || !amount || !orderId}
            className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Initializing...' : 'Initialize Payment'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Payment Status */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Payment Status:</p>
            <p
              className={`font-semibold ${
                status === 'succeeded'
                  ? 'text-green-600'
                  : status === 'failed'
                  ? 'text-red-600'
                  : status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`}
            >
              {status?.toUpperCase()}
            </p>
          </div>

          {/* Payment Form */}
          <PaymentForm
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            className="vsplit-form"
          />

          {/* Reset Button */}
          <button
            onClick={() => setPaymentInitialized(false)}
            className="w-full py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Start Over
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Current Session Info */}
      {currentSession && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm font-medium text-gray-900">Current Session:</p>
          <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
            {JSON.stringify(currentSession, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Split Payment Demo Component
function SplitPaymentDemo() {
  const [splits, setSplits] = useState([
    { amount: 2000, label: 'First Card' },
    { amount: 2000, label: 'Second Card' },
    { amount: 1000, label: 'Third Card' },
  ]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);

  const addSplit = () => {
    setSplits([
      ...splits,
      { amount: 1000, label: `Card ${splits.length + 1}` },
    ]);
  };

  const removeSplit = (index: number) => {
    if (splits.length > 1) {
      const newSplits = splits.filter((_, i) => i !== index);
      setSplits(newSplits);
    }
  };

  const updateSplit = (
    index: number,
    field: 'amount' | 'label',
    value: string | number
  ) => {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setSplits(newSplits);
  };

  const handleStepComplete = (stepIndex: number, result: any) => {
    console.log(`Step ${stepIndex + 1} completed:`, result);
    setCompletedSteps((prev) => [...prev, stepIndex]);
  };

  const handleAllComplete = (session: any) => {
    console.log('All split payments completed:', session);
    setAllCompleted(true);
    alert('All split payments completed successfully!');
  };

  const handleError = (error: string) => {
    console.error('Split payment error:', error);
    alert(`Split payment error: ${error}`);
  };

  const resetDemo = () => {
    setCompletedSteps([]);
    setAllCompleted(false);
  };

  const totalAmount = splits.reduce((sum, split) => sum + split.amount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Split Payment Configuration
        </h2>

        <div className="space-y-4">
          {splits.map((split, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 border border-gray-200 rounded-md"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={split.label}
                  onChange={(e) => updateSplit(index, 'label', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={split.amount}
                  onChange={(e) =>
                    updateSplit(index, 'amount', Number(e.target.value))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="text-sm text-gray-500">
                ${(split.amount / 100).toFixed(2)}
              </div>
              {splits.length > 1 && (
                <button
                  onClick={() => removeSplit(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={addSplit}
            disabled={splits.length >= 5}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Add Split
          </button>
          <div className="text-lg font-semibold">
            Total: ${(totalAmount / 100).toFixed(2)}
          </div>
        </div>

        {allCompleted && (
          <button
            onClick={resetDemo}
            className="w-full mt-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Reset Demo
          </button>
        )}
      </div>

      {/* Split Payment Component */}
      {!allCompleted && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Process</h2>

          <SplitPayment
            splits={splits}
            onStepComplete={handleStepComplete}
            onAllComplete={handleAllComplete}
            onError={handleError}
            className="vsplit-split-payment"
          />
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-3">Progress Summary</h3>
        <div className="space-y-2">
          {splits.map((split, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 border-b border-gray-100"
            >
              <span className="font-medium">{split.label}</span>
              <div className="flex items-center space-x-2">
                <span>${(split.amount / 100).toFixed(2)}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    completedSteps.includes(index)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {completedSteps.includes(index) ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {completedSteps.length} of {splits.length} payments completed
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
