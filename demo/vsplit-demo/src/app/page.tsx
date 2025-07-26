import Link from 'next/link';
import {
  CreditCard,
  Users,
  Zap,
  Shield,
  Globe,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <CreditCard className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                VSplit Payment Gateway
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/docs"
                className="text-gray-600 hover:text-gray-900"
              >
                Documentation
              </Link>
              <Link
                href="https://github.com/ModyG/vsplit-payment-gateway"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Split Payments Made <span className="text-blue-600">Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Powerful TypeScript payment gateway for seamlessly splitting
            payments between multiple recipients. Built with Stripe, optimized
            for modern web applications.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/demo/basic"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Try Live Demo <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo/restaurant"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View Examples
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose VSplit?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">
                Multi-Recipient Splits
              </h4>
              <p className="text-gray-600">
                Split payments across unlimited recipients with custom
                percentages or fixed amounts.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
              <p className="text-gray-600">
                Optimized for performance with minimal bundle size and
                TypeScript support.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure & Compliant</h4>
              <p className="text-gray-600">
                Built on Stripe&apos;s secure infrastructure with PCI compliance
                out of the box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Scenarios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Live Demo Scenarios
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Payment */}
            <Link
              href="/demo/basic"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-500 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">
                Basic Split Payment
              </h4>
              <p className="text-gray-600 mb-4">
                Simple 2-way split between merchant and platform fee.
              </p>
              <div className="text-sm text-blue-600 font-medium">
                Try Demo →
              </div>
            </Link>

            {/* Restaurant */}
            <Link
              href="/demo/restaurant"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-green-500 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">
                Restaurant Delivery
              </h4>
              <p className="text-gray-600 mb-4">
                Split between restaurant, delivery driver, and platform.
              </p>
              <div className="text-sm text-green-600 font-medium">
                Try Demo →
              </div>
            </Link>

            {/* Marketplace */}
            <Link
              href="/demo/marketplace"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-purple-500 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Marketplace</h4>
              <p className="text-gray-600 mb-4">
                Multi-vendor marketplace with complex split logic.
              </p>
              <div className="text-sm text-purple-600 font-medium">
                Try Demo →
              </div>
            </Link>

            {/* Freelance */}
            <Link
              href="/demo/freelance"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-orange-500 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Freelance Platform</h4>
              <p className="text-gray-600 mb-4">
                Escrow payments with milestone releases.
              </p>
              <div className="text-sm text-orange-600 font-medium">
                Coming Soon
              </div>
            </Link>

            {/* Event Tickets */}
            <Link
              href="/demo/events"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-pink-500 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Event Tickets</h4>
              <p className="text-gray-600 mb-4">
                Split between organizer, venue, and platform.
              </p>
              <div className="text-sm text-pink-600 font-medium">
                Coming Soon
              </div>
            </Link>

            {/* Custom Integration */}
            <Link
              href="/demo/custom"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-indigo-500 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Custom Integration</h4>
              <p className="text-gray-600 mb-4">
                Build your own split payment scenario.
              </p>
              <div className="text-sm text-indigo-600 font-medium">
                Coming Soon
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to integrate VSplit?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Get started with our TypeScript-first payment gateway in minutes.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/docs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/demo/basic"
              className="bg-blue-500 text-white border-2 border-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">VSplit</h5>
              <p className="text-gray-400 text-sm">
                Modern payment splitting for the web. Built with TypeScript and
                Stripe.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Documentation</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/docs">Installation</Link>
                </li>
                <li>
                  <Link href="/docs">API Reference</Link>
                </li>
                <li>
                  <Link href="/docs">Examples</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="https://github.com/ModyG/vsplit-payment-gateway">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="https://www.npmjs.com/package/@vegaci_shared/vsplit-payment-gateway">
                    NPM
                  </Link>
                </li>
                <li>
                  <Link href="/docs">Changelog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/docs">FAQ</Link>
                </li>
                <li>
                  <Link href="mailto:support@vsplit.com">Contact</Link>
                </li>
                <li>
                  <Link href="/docs">Troubleshooting</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; 2025 VSplit Payment Gateway. Built with Next.js and Stripe.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
