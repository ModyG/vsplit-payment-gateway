import Link from 'next/link';
import { ArrowLeft, Download, Code, ExternalLink } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Start */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Download className="h-5 w-5 mr-2 text-blue-600" />
              Installation
            </h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400">
                npm install @vegaci_shared/vsplit-payment-gateway
              </code>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Code className="h-5 w-5 mr-2 text-blue-600" />
              Basic Usage
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                {`import { VSplitPaymentGateway } from '@vegaci_shared/vsplit-payment-gateway';

// Initialize the gateway
const gateway = new VSplitPaymentGateway({
  stripePublishableKey: 'pk_test_...',
  environment: 'sandbox',
  currency: 'usd'
});

// Configure split payment
const splitConfig = {
  splits: [
    { 
      amount: 8500, // $85.00
      label: 'Merchant Revenue',
      recipient: 'merchant_account_id' 
    },
    { 
      amount: 1500, // $15.00
      label: 'Platform Fee',
      recipient: 'platform_account_id'
    }
  ]
};

// Process the payment
await gateway.processSplitPayment(splitConfig);`}
              </pre>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Key Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multi-Recipient Splits
              </h3>
              <p className="text-gray-600 text-sm">
                Split payments across unlimited recipients with custom amounts
                or percentages.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                TypeScript First
              </h3>
              <p className="text-gray-600 text-sm">
                Full TypeScript support with comprehensive type definitions and
                IntelliSense.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                React Integration
              </h3>
              <p className="text-gray-600 text-sm">
                Pre-built React components and hooks for seamless integration.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stripe Powered
              </h3>
              <p className="text-gray-600 text-sm">
                Built on Stripe&apos;s secure infrastructure with PCI compliance
                included.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Examples */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Live Demo Examples
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/demo/basic"
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Basic Split Payment
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Simple 2-way split between merchant and platform fee.
              </p>
              <span className="text-blue-600 text-sm font-medium">
                View Demo →
              </span>
            </Link>

            <Link
              href="/demo/restaurant"
              className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Restaurant Delivery
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                3-way split between restaurant, driver, and platform.
              </p>
              <span className="text-green-600 text-sm font-medium">
                View Demo →
              </span>
            </Link>

            <Link
              href="/demo/marketplace"
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Marketplace
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Multi-vendor marketplace with complex split logic.
              </p>
              <span className="text-purple-600 text-sm font-medium">
                View Demo →
              </span>
            </Link>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                More Examples
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Additional demos coming soon: Freelance, Events, and Custom.
              </p>
              <span className="text-gray-500 text-sm">Coming Soon</span>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Resources</h2>

          <div className="space-y-4">
            <a
              href="https://github.com/ModyG/vsplit-payment-gateway"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  GitHub Repository
                </h3>
                <p className="text-gray-600 text-sm">
                  View source code, report issues, and contribute
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </a>

            <a
              href="https://www.npmjs.com/package/@vegaci_shared/vsplit-payment-gateway"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  NPM Package
                </h3>
                <p className="text-gray-600 text-sm">
                  Install the package and view documentation
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </a>

            <a
              href="https://stripe.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Stripe Documentation
                </h3>
                <p className="text-gray-600 text-sm">
                  Learn more about Stripe&apos;s payment infrastructure
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
