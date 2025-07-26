'use client';

import { useState } from 'react';
import StripeProvider from '@/components/StripeProvider';
import {
  ArrowLeft,
  ShoppingCart,
  Store,
  CreditCard,
  Truck,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function MarketplaceDemoPage() {
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');

  const cartItems = [
    {
      vendor: 'TechStore Pro',
      item: 'Wireless Earbuds',
      price: 8999,
      vendorSplit: 85,
    },
    {
      vendor: 'Fashion Hub',
      item: 'Designer T-Shirt',
      price: 2999,
      vendorSplit: 80,
    },
    {
      vendor: 'BookWorld',
      item: 'Programming Guide',
      price: 4999,
      vendorSplit: 75,
    },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shippingFee = 999;
  const grandTotal = total + shippingFee;

  const handlePayment = async () => {
    setPaymentStatus('processing');

    try {
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

  const calculateVendorAmount = (price: number, split: number) => {
    return Math.round((price * split) / 100);
  };

  const calculatePlatformFee = (price: number, split: number) => {
    return price - calculateVendorAmount(price, split);
  };

  return (
    <StripeProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
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
                <div className="bg-purple-600 text-white p-2 rounded-lg mr-3">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Marketplace Demo
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Demo Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Multi-Vendor Marketplace
            </h2>
            <p className="text-gray-600 mb-4">
              This demo shows how marketplaces can automatically split payments
              between multiple vendors, with different commission rates per
              vendor and category.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">
                Perfect for:
              </h3>
              <ul className="text-purple-800 text-sm space-y-1">
                <li>• E-commerce marketplaces (Amazon, Etsy style)</li>
                <li>• Digital product platforms</li>
                <li>• Service marketplaces</li>
                <li>• Any multi-vendor platform</li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shopping Cart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <ShoppingCart className="h-6 w-6 mr-2 text-purple-600" />
                Shopping Cart
              </h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.item}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Store className="h-4 w-4 mr-1" />
                          <span>{item.vendor}</span>
                        </div>
                      </div>
                      <span className="font-bold text-lg">
                        ${(item.price / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Vendor gets {item.vendorSplit}%
                      </span>
                      <span className="text-purple-600 font-medium">
                        Platform fee: {100 - item.vendorSplit}%
                      </span>
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium">
                      ${(total / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Shipping</span>
                    <span className="font-medium">
                      ${(shippingFee / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>${(grandTotal / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={paymentStatus === 'processing'}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Complete Purchase
                  </>
                )}
              </button>

              {paymentStatus === 'success' && (
                <button
                  onClick={resetDemo}
                  className="w-full mt-3 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Shop More Items
                </button>
              )}
            </div>

            {/* Payment Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Payment Distribution
              </h3>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {item.vendor}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Vendor Revenue
                        </span>
                        <span className="font-bold text-green-600">
                          $
                          {(
                            calculateVendorAmount(
                              item.price,
                              item.vendorSplit
                            ) / 100
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Platform Commission
                        </span>
                        <span className="font-bold text-purple-600">
                          $
                          {(
                            calculatePlatformFee(item.price, item.vendorSplit) /
                            100
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-l-full"
                          style={{ width: `${item.vendorSplit}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Shipping */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">
                        Shipping Revenue
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-900">
                      ${(shippingFee / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    100% to platform (logistics)
                  </div>
                </div>

                {/* Total Summary */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-900 mb-3">
                    Total Distribution
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-purple-800">Total to Vendors</span>
                      <span className="font-bold text-green-600">
                        $
                        {(
                          cartItems.reduce(
                            (sum, item) =>
                              sum +
                              calculateVendorAmount(
                                item.price,
                                item.vendorSplit
                              ),
                            0
                          ) / 100
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-800">
                        Total Platform Revenue
                      </span>
                      <span className="font-bold text-purple-600">
                        $
                        {(
                          (cartItems.reduce(
                            (sum, item) =>
                              sum +
                              calculatePlatformFee(
                                item.price,
                                item.vendorSplit
                              ),
                            0
                          ) +
                            shippingFee) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                {paymentStatus === 'success' && (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <div className="flex items-center text-green-800 mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Purchase completed!</span>
                    </div>
                    <div className="text-sm text-green-700">
                      • All vendors have been paid instantly
                      <br />
                      • Order confirmation sent to email
                      <br />• Tracking information will be provided
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Implementation Code */}
          <div className="bg-gray-900 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Implementation Example
            </h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
              {`// Multi-vendor marketplace split
const marketplaceSplit = {
  splits: [
${cartItems
  .map(
    (item, index) => `    {
      amount: ${calculateVendorAmount(item.price, item.vendorSplit)}, // $${(
      calculateVendorAmount(item.price, item.vendorSplit) / 100
    ).toFixed(2)}
      label: '${item.vendor} - ${item.item}',
      recipient: 'vendor_${index + 1}_account_id',
      metadata: { vendorId: '${item.vendor
        .toLowerCase()
        .replace(/\s+/g, '_')}' }
    },
    {
      amount: ${calculatePlatformFee(item.price, item.vendorSplit)}, // $${(
      calculatePlatformFee(item.price, item.vendorSplit) / 100
    ).toFixed(2)}
      label: 'Platform Commission - ${item.vendor}',
      recipient: 'platform_account_id'
    }${index < cartItems.length - 1 ? ',' : ''}`
  )
  .join(',\n')}${
                shippingFee > 0
                  ? `,
    {
      amount: ${shippingFee}, // $${(shippingFee / 100).toFixed(2)}
      label: 'Shipping Revenue',
      recipient: 'platform_account_id'
    }`
                  : ''
              }
  ],
  metadata: {
    orderId: 'MKT-${Date.now()}',
    vendorCount: ${cartItems.length},
    totalAmount: ${grandTotal}
  }
};

await gateway.processSplitPayment(marketplaceSplit);`}
            </pre>
          </div>
        </div>
      </div>
    </StripeProvider>
  );
}
