# VSplit Payment Gateway

A comprehensive B2B payment gateway integration package for Stripe with advanced split payment capabilities.

## Features

- 🎯 **Simple Integration**: Minimal setup with just configuration
- 💳 **Single Card Payments**: Traditional one-card payment processing
- 🔄 **Customer Split Payments**: Let customers split their payment across multiple cards
- ⏱️ **Timeout Management**: Automatic cancellation and refunds for incomplete payments
- 💰 **Optional Merchant Splits**: Revenue sharing between merchant, platform, drivers, etc.
- 🔒 **Secure**: Follows Stripe security best practices
- 📱 **React Ready**: Built-in React hooks and components
- 🎨 **Customizable**: Theming and styling options
- 📊 **Real-time Status**: Payment verification and status tracking
- 🪝 **Webhooks**: Event-driven architecture for notifications
- 📱 **TypeScript**: Fully typed for better development experience

## 🚀 Live Demo

Experience VSplit in action with our interactive demo application:

**[→ Try Live Demo](https://vsplit-payment-gateway.vercel.app)**

### Local Demo Setup

1. **Clone & Setup:**

   ```bash
   git clone https://github.com/ModyG/vsplit-payment-gateway.git
   cd vsplit-payment-gateway
   npm run demo
   ```

2. **Add your Stripe keys** to `demo/vsplit-demo/.env.local`

3. **Visit:** `http://localhost:3000`

### Demo Scenarios

- **Customer Split Payment** - Customer chooses to split total across multiple cards
- **Single Card Payment** - Traditional one-card payment processing
- **Merchant Revenue Sharing** - Optional splits for merchant/platform/drivers
- **Timeout & Auto-Refund** - Automatic refunds if split payments incomplete

## Installation

```bash
npm install @vsplit/payment-gateway
# or
yarn add @vsplit/payment-gateway
```

## Quick Start

### 1. Basic Setup (Vanilla JS/TS)

```typescript
import VSplitPaymentGateway from '@vsplit/payment-gateway';

// Initialize the gateway
const gateway = new VSplitPaymentGateway({
  stripePublishableKey: 'pk_test_...',
  apiEndpoint: 'https://your-backend.com/api',
  apiKey: 'your-api-key', // optional
  currency: 'usd',
  defaultTimeout: 600, // 10 minutes
});

// Single payment
const paymentResult = await gateway.initializePayment({
  amount: 5000, // $50.00 in cents
  currency: 'usd',
  orderId: 'order_123',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe',
  },
});

// Process the payment
const result = await gateway.processPayment(paymentResult.paymentId, {
  // Stripe payment method or elements
});
```

### 2. React Integration

```tsx
import React from 'react';
import {
  VSplitProvider,
  useVSplit,
  PaymentForm,
} from '@vsplit/payment-gateway/react';

// Wrap your app
function App() {
  return (
    <VSplitProvider
      config={{
        stripePublishableKey: 'pk_test_...',
        apiEndpoint: 'https://your-backend.com/api',
      }}
    >
      <PaymentPage />
    </VSplitProvider>
  );
}

// Payment component
function PaymentPage() {
  const { initializePayment, status, loading, error } = useVSplit();

  const handlePayment = async () => {
    await initializePayment({
      amount: 5000,
      currency: 'usd',
      orderId: 'order_123',
    });
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
      >
        Start Payment
      </button>
      <PaymentForm
        onSuccess={(result) => console.log('Payment successful:', result)}
        onError={(error) => console.error('Payment failed:', error)}
      />
    </div>
  );
}
```

### 3. Customer Split Payments

Customer wants to pay $100 but split across 3 cards:

```typescript
// Customer chooses to split payment
const splitSession = await gateway.initializeSplitPayment({
  totalAmount: 10000, // $100.00
  numberOfCards: 3,
  cardAmounts: [4000, 3500, 2500], // $40 + $35 + $25 = $100
  currency: 'usd',
  orderId: 'order_123',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe',
  },
  timeout: 600, // 10 minutes to complete all payments
});

// Process each card payment
for (let i = 0; i < splitSession.cardPayments.length; i++) {
  const result = await gateway.processSplitPayment(
    splitSession.sessionId,
    i,
    paymentMethod // Customer's card data for this split
  );

  if (!result.success) {
    console.log(`Card ${i + 1} failed:`, result.error);
    // Customer can retry or all payments will be refunded after timeout
  }
}
```

### 4. Merchant Revenue Splitting (Optional)

After customer pays, split revenue between recipients:

````typescript
// Initialize payment with automatic merchant splits
const paymentResult = await gateway.initializePaymentWithMerchantSplits({
  amount: 10000, // $100.00 customer payment
  currency: 'usd',
  orderId: 'order_123',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe',
  },
  // Optional: Automatically split revenue after successful payment
  merchantSplits: [
    { amount: 8500, label: 'Merchant Revenue', recipient: 'merchant_123' }, // $85
    { amount: 1000, label: 'Platform Fee', recipient: 'platform_123' }, // $10
    { amount: 500, label: 'Processing Fee', recipient: 'processor_123' }, // $5
  ],
});

// Process customer's payment first
const result = await gateway.processPayment(paymentResult.paymentId, paymentMethod);

// If customer payment succeeds, merchant splits are processed automatically
if (result.success) {
  console.log('Customer paid $100, revenue split between 3 recipients');
}

### 5. React Customer Split Payment Component

```tsx
import { CustomerSplitPayment } from '@vsplit/payment-gateway/react';

function CustomerSplitPaymentPage() {
  const [paymentAmount, setPaymentAmount] = useState(10000); // $100
  const [numberOfCards, setNumberOfCards] = useState(2);

  const handleSplitAmountChange = (cardIndex: number, amount: number) => {
    // Update split amounts ensuring they sum to total
  };

  return (
    <div>
      <h2>Split Your Payment</h2>
      <p>Total: ${(paymentAmount / 100).toFixed(2)}</p>

      <label>
        How many cards would you like to use?
        <select value={numberOfCards} onChange={(e) => setNumberOfCards(+e.target.value)}>
          <option value={1}>1 Card (Full Payment)</option>
          <option value={2}>2 Cards</option>
          <option value={3}>3 Cards</option>
          <option value={4}>4 Cards</option>
        </select>
      </label>

      {numberOfCards > 1 ? (
        <CustomerSplitPayment
          totalAmount={paymentAmount}
          numberOfCards={numberOfCards}
          onStepComplete={(stepIndex, result) => {
            console.log(`Card ${stepIndex + 1} payment completed:`, result);
          }}
          onAllComplete={(session) => {
            console.log('All card payments completed:', session);
          }}
          onTimeout={(session) => {
            console.log('Payment timeout - refunding all successful payments');
          }}
          onError={(error) => {
            console.error('Split payment error:', error);
          }}
        />
      ) : (
        <SinglePayment amount={paymentAmount} />
      )}
    </div>
  );
}
````

### 6. React Merchant Split Component (Optional)

```tsx
import { MerchantSplitPayment } from '@vsplit/payment-gateway/react';

function MerchantSplitPaymentPage() {
  const merchantSplits = [
    { amount: 8500, label: 'Your Revenue', recipient: 'merchant_123' },
    { amount: 1000, label: 'Platform Fee', recipient: 'platform_123' },
    { amount: 500, label: 'Payment Processing', recipient: 'stripe_123' },
  ];

  return (
    <MerchantSplitPayment
      amount={10000} // $100 total customer payment
      merchantSplits={merchantSplits}
      onPaymentComplete={(result) => {
        console.log('Customer payment completed:', result);
      }}
      onSplitsComplete={(splits) => {
        console.log('Revenue splits completed:', splits);
      }}
      onError={(error) => {
        console.error('Payment or split error:', error);
      }}
    />
  );
}
```

## Configuration

### VSplitConfig

```typescript
interface VSplitConfig {
  /** Stripe publishable key */
  stripePublishableKey: string;
  /** API endpoint for your backend integration */
  apiEndpoint: string;
  /** Optional API key for authentication */
  apiKey?: string;
  /** Environment (sandbox/production) */
  environment?: 'sandbox' | 'production';
  /** Default currency (ISO 4217) */
  currency?: string;
  /** Default timeout for split payments in seconds */
  defaultTimeout?: number;
  /** Custom styling options */
  theme?: PaymentTheme;
}
```

### PaymentTheme

```typescript
interface PaymentTheme {
  /** Primary color */
  primaryColor?: string;
  /** Border radius */
  borderRadius?: string;
  /** Font family */
  fontFamily?: string;
  /** Custom CSS classes */
  customClasses?: {
    container?: string;
    button?: string;
    input?: string;
    error?: string;
    success?: string;
  };
}
```

## Event Handling

```typescript
// Listen to payment events
gateway.on('payment:success', (result) => {
  console.log('Payment succeeded:', result);
});

gateway.on('payment:failed', (result) => {
  console.log('Payment failed:', result);
});

gateway.on('split:completed', (session) => {
  console.log('All split payments completed:', session);
});

gateway.on('split:timeout', (session) => {
  console.log('Split payment timed out:', session);
  // Automatic refunds are handled internally
});

gateway.on('error', (error) => {
  console.error('Gateway error:', error);
});
```

## Backend Integration

### Required API Endpoints

Your backend needs to implement these endpoints:

#### POST /payment/initialize

```typescript
{
  amount: number;
  currency: string;
  orderId: string;
  customer?: CustomerInfo;
  metadata?: Record<string, string>;
}
```

#### POST /payment/split/initialize

```typescript
{
  splits: Array<{ amount: number; label?: string }>;
  timeout?: number;
}
```

#### POST /payment/refund

```typescript
{
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}
```

### Example Backend (Node.js/Express)

```typescript
import Stripe from 'stripe';
import express from 'express';

const stripe = new Stripe('sk_test_...');
const app = express();

app.post('/api/payment/initialize', async (req, res) => {
  try {
    const { amount, currency, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      success: true,
      data: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.post('/api/payment/split/initialize', async (req, res) => {
  try {
    const { splits, timeout } = req.body;

    const paymentIntents = await Promise.all(
      splits.map((split) =>
        stripe.paymentIntents.create({
          amount: split.amount,
          currency: 'usd',
          automatic_payment_methods: { enabled: true },
        })
      )
    );

    const session = {
      sessionId: `split_${Date.now()}`,
      paymentIntents: paymentIntents.map((pi) => ({
        id: pi.id,
        clientSecret: pi.client_secret,
        status: pi.status,
        amount: pi.amount,
        currency: pi.currency,
        created: pi.created,
      })),
      status: 'pending',
      totalAmount: splits.reduce((sum, split) => sum + split.amount, 0),
      currency: 'usd',
      expiresAt: Date.now() + timeout * 1000,
      completedPayments: 0,
      failedPayments: 0,
    };

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
```

## Webhook Handling

```typescript
import { WebhookEvent } from '@vsplit/payment-gateway';

app.post('/webhooks/vsplit', (req, res) => {
  const event: WebhookEvent = req.body;

  switch (event.type) {
    case 'payment.succeeded':
      // Handle successful payment
      break;
    case 'split_payment.completed':
      // Handle completed split payment
      break;
    case 'split_payment.timeout':
      // Handle split payment timeout
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});
```

## Styling

### CSS Classes

The package includes built-in CSS classes that you can customize:

```css
/* Import the base styles */
@import '@vsplit/payment-gateway/dist/styles.css';

/* Customize as needed */
.vsplit-container {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.vsplit-button {
  background: linear-gradient(45deg, #007bff, #0056b3);
}
```

### Custom Theme

```typescript
const gateway = new VSplitPaymentGateway({
  // ... other config
  theme: {
    primaryColor: '#007bff',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
    customClasses: {
      container: 'my-custom-container',
      button: 'my-custom-button',
    },
  },
});
```

## Error Handling

```typescript
try {
  const result = await gateway.processPayment(paymentId, paymentMethod);
  if (!result.success) {
    // Handle payment failure
    console.error('Payment failed:', result.error);
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error);
}
```

## TypeScript Support

The package is fully typed. Import types as needed:

```typescript
import {
  VSplitConfig,
  PaymentResult,
  PaymentSessionConfig,
  SplitPaymentConfig,
  PaymentStatus,
  WebhookEvent,
} from '@vsplit/payment-gateway';
```

## Testing

```typescript
// Use Stripe test keys for development
const gateway = new VSplitPaymentGateway({
  stripePublishableKey: 'pk_test_...',
  apiEndpoint: 'http://localhost:3000/api',
  environment: 'sandbox',
});

// Test card numbers (Stripe test cards)
// 4242424242424242 - Visa
// 4000000000000002 - Card declined
// 4000000000009995 - Insufficient funds
```

## Security Best Practices

1. **API Keys**: Never expose secret keys in frontend code
2. **HTTPS**: Always use HTTPS in production
3. **Validation**: Validate all inputs on your backend
4. **Webhooks**: Verify webhook signatures
5. **PCI Compliance**: This package handles sensitive data securely through Stripe

## Support

- 📧 Email: support@vsplit.com
- 📚 Documentation: https://docs.vsplit.com
- 🐛 Issues: https://github.com/ModyG/vsplit/issues

## License

MIT License - see LICENSE file for details.
