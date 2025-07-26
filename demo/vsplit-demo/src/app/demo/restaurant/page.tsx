'use client';

import { useState } from 'react';
import StripeProvider from '@/components/StripeProvider';
import {
  ArrowLeft,
  Truck,
  ChefHat,
  Building,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

export default function RestaurantDemoPage() {
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [orderDetails] = useState({
    subtotal: 2850, // $28.50
    deliveryFee: 350, // $3.50
    tip: 500, // $5.00
    total: 3700, // $37.00
  });

  const splits = {
    restaurant: 75, // 75%
    driver: 15, // 15%
    platform: 10, // 10%
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setPaymentStatus('success');
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
    }
  };

  const resetDemo = () => {
    setPaymentStatus('idle');
  };

  const calculateSplit = (amount: number, percentage: number) => {
    return Math.round((amount * percentage) / 100);
  };

  return (
    <StripeProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-6">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center">
                <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
                  <Truck className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Restaurant Delivery Demo
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Demo Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3-Way Delivery Split
            </h2>
            <p className="text-gray-600 mb-4">
              This demo shows how food delivery platforms can automatically
              split payments between restaurants, delivery drivers, and the
              platform commission.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                Perfect for:
              </h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Food delivery platforms (DoorDash, Uber Eats style)</li>
                <li>• Grocery delivery services</li>
                <li>• Any on-demand delivery marketplace</li>
                <li>• Service platforms with multiple stakeholders</li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <ChefHat className="h-6 w-6 mr-2 text-green-600" />
                Order Details
              </h3>

              {/* Restaurant Info */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center mb-2">
                  <Building className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-medium">
                    Mario&apos;s Italian Kitchen
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>1.2 miles away • 25-35 min</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Margherita Pizza (Large)
                  </span>
                  <span className="font-medium">$18.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Caesar Salad</span>
                  <span className="font-medium">$8.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Garlic Bread</span>
                  <span className="font-medium">$4.50</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium">
                      ${(orderDetails.subtotal / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Delivery Fee</span>
                    <span className="font-medium">
                      ${(orderDetails.deliveryFee / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Driver Tip</span>
                    <span className="font-medium">
                      ${(orderDetails.tip / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span>
                    <span>${(orderDetails.total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={paymentStatus === 'processing'}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Truck className="h-5 w-5 mr-2" />
                    Place Order & Pay
                  </>
                )}
              </button>

              {paymentStatus === 'success' && (
                <button
                  onClick={resetDemo}
                  className="w-full mt-3 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Place Another Order
                </button>
              )}
            </div>

            {/* Payment Split Visualization */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Payment Distribution
              </h3>

              <div className="space-y-4">
                {/* Restaurant Share */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <ChefHat className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="font-medium text-orange-900">
                        Restaurant
                      </span>
                    </div>
                    <span className="text-xl font-bold text-orange-900">
                      $
                      {(
                        calculateSplit(orderDetails.total, splits.restaurant) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-orange-700">
                    {splits.restaurant}% • Food cost + profit
                  </div>
                  <div className="bg-orange-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${splits.restaurant}%` }}
                    ></div>
                  </div>
                </div>

                {/* Driver Share */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">
                        Delivery Driver
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-900">
                      $
                      {(
                        calculateSplit(orderDetails.total, splits.driver) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    {splits.driver}% • Delivery fee + tip
                  </div>
                  <div className="bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${splits.driver}%` }}
                    ></div>
                  </div>
                </div>

                {/* Platform Share */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium text-purple-900">
                        Platform
                      </span>
                    </div>
                    <span className="text-xl font-bold text-purple-900">
                      $
                      {(
                        calculateSplit(orderDetails.total, splits.platform) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-purple-700">
                    {splits.platform}% • Service commission
                  </div>
                  <div className="bg-purple-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${splits.platform}%` }}
                    ></div>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      Total Payment
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${(orderDetails.total / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Status
              </h3>

              {paymentStatus === 'idle' && (
                <div className="text-center py-8">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Ready to place order</p>
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    <span className="text-blue-900">Processing payment...</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg opacity-50">
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3"></div>
                    <span className="text-gray-600">
                      Notifying restaurant...
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg opacity-50">
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3"></div>
                    <span className="text-gray-600">Assigning driver...</span>
                  </div>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-900 font-medium">
                      Payment successful!
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-900">Restaurant notified</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-900">Driver assigned</span>
                  </div>
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-4">
                    <p className="text-green-800 font-medium">
                      Estimated delivery: 25-35 minutes
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      You&apos;ll receive updates via SMS
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Payment failed</p>
                  <p className="text-red-700 text-sm mt-1">
                    Please try again or contact support
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Implementation Code */}
          <div className="bg-gray-900 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Implementation Example
            </h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
              {`// Restaurant delivery split configuration
const deliverySplit = {
  splits: [
    {
      amount: ${calculateSplit(orderDetails.total, splits.restaurant)}, // $${(
                calculateSplit(orderDetails.total, splits.restaurant) / 100
              ).toFixed(2)}
      label: 'Restaurant Revenue',
      recipient: 'restaurant_account_id',
      percentage: ${splits.restaurant}
    },
    {
      amount: ${calculateSplit(orderDetails.total, splits.driver)}, // $${(
                calculateSplit(orderDetails.total, splits.driver) / 100
              ).toFixed(2)}
      label: 'Driver Payment',
      recipient: 'driver_account_id',
      percentage: ${splits.driver}
    },
    {
      amount: ${calculateSplit(orderDetails.total, splits.platform)}, // $${(
                calculateSplit(orderDetails.total, splits.platform) / 100
              ).toFixed(2)}
      label: 'Platform Commission',
      recipient: 'platform_account_id',
      percentage: ${splits.platform}
    }
  ],
  metadata: {
    orderId: 'ORD-${Date.now()}',
    restaurantId: 'rest_mario_kitchen',
    driverId: 'driver_john_doe'
  }
};

await gateway.processSplitPayment(deliverySplit);`}
            </pre>
          </div>
        </div>
      </div>
    </StripeProvider>
  );
}
