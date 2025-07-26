# VSplit Payment Gateway - Technical Documentation

## Architecture Overview

The VSplit Payment Gateway is designed as a comprehensive B2B payment solution that abstracts Stripe's complexity while providing advanced split payment capabilities. The architecture consists of several key components:

### Core Components

1. **VSplitPaymentGateway** - Main gateway class
2. **ApiClient** - HTTP client for backend communication
3. **EventEmitter** - Event handling system
4. **PaymentTimer** - Timeout management
5. **React Integration** - Hooks and components
6. **Utility Functions** - Validation, formatting, etc.

### Payment Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Merchant      │    │   VSplit         │    │   Customer      │
│   Backend       │    │   Gateway        │    │   Frontend      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │  1. Initialize Payment │                        │
         │◄──────────────────────│                        │
         │                        │                        │
         │  2. Create Payment     │                        │
         │    Intent              │                        │
         │───────────────────────►│                        │
         │                        │                        │
         │                        │  3. Show Payment Form  │
         │                        │───────────────────────►│
         │                        │                        │
         │                        │  4. Submit Payment     │
         │                        │◄───────────────────────│
         │                        │                        │
         │  5. Confirm Payment    │                        │
         │◄──────────────────────│                        │
         │                        │                        │
         │  6. Webhook            │                        │
         │◄───────────────────────│                        │
```

### Split Payment Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Backend       │    │   VSplit         │    │   Frontend      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │  1. Initialize Split   │                        │
         │◄──────────────────────│                        │
         │                        │                        │
         │  2. Create Multiple    │                        │
         │     Payment Intents    │                        │
         │───────────────────────►│                        │
         │                        │                        │
         │                        │  3. Start Timer        │
         │                        │──────────┐             │
         │                        │          │             │
         │                        │          ▼             │
         │                        │    ┌─────────────┐     │
         │                        │    │   Timer     │     │
         │                        │    │  (5-10 min) │     │
         │                        │    └─────────────┘     │
         │                        │                        │
         │                        │  4. Process Each Split │
         │                        │───────────────────────►│
         │                        │                        │
         │                        │  5. Card 1 Payment     │
         │                        │◄───────────────────────│
         │                        │                        │
         │                        │  6. Card 2 Payment     │
         │                        │◄───────────────────────│
         │                        │                        │
         │                        │  7. Card N Payment     │
         │                        │◄───────────────────────│
         │                        │                        │
         │  8. All Complete OR    │                        │
         │     Timeout & Refund   │                        │
         │◄──────────────────────│                        │
```

## API Reference

### VSplitPaymentGateway Class

#### Constructor

```typescript
constructor(config: VSplitConfig)
```

#### Methods

##### initializePayment()

```typescript
async initializePayment(config: PaymentSessionConfig): Promise<PaymentResult>
```

Initializes a single payment session.

**Parameters:**

- `config.amount` - Amount in smallest currency unit (cents)
- `config.currency` - ISO 4217 currency code
- `config.orderId` - Unique order identifier
- `config.customer` - Optional customer information
- `config.metadata` - Optional metadata

**Returns:**

- `PaymentResult` object with success status and payment details

##### processPayment()

```typescript
async processPayment(paymentIntentId: string, paymentMethod: any): Promise<PaymentResult>
```

Processes a payment using Stripe Elements.

##### initializeSplitPayment()

```typescript
async initializeSplitPayment(config: SplitPaymentConfig): Promise<SplitPaymentSession>
```

Initializes a split payment session with multiple payment intents.

##### processSplitPayment()

```typescript
async processSplitPayment(
  sessionId: string,
  splitIndex: number,
  paymentMethod: any
): Promise<PaymentResult>
```

Processes an individual split payment.

##### refundPayment()

```typescript
async refundPayment(request: RefundRequest): Promise<RefundResponse>
```

Processes a refund for a completed payment.

##### verifyPayment()

```typescript
async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse>
```

Verifies a payment's status and details.

##### Event Methods

```typescript
on<K extends keyof PaymentGatewayEvents>(event: K, callback: PaymentGatewayEvents[K]): void
off<K extends keyof PaymentGatewayEvents>(event: K, callback: PaymentGatewayEvents[K]): void
```

Subscribe/unsubscribe to gateway events.

### React Integration

#### VSplitProvider

```typescript
interface VSplitProviderProps {
  config: VSplitConfig;
  children: React.ReactNode;
}
```

Context provider that initializes the gateway for child components.

#### useVSplit Hook

```typescript
function useVSplit(options?: UseVSplitOptions): UseVSplitReturn;
```

Main hook for accessing gateway functionality in React components.

#### PaymentForm Component

```typescript
interface PaymentFormProps {
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}
```

Pre-built payment form component with Stripe Elements integration.

#### SplitPayment Component

```typescript
interface SplitPaymentProps {
  splits: Array<{ amount: number; label?: string }>;
  onStepComplete?: (stepIndex: number, result: PaymentResult) => void;
  onAllComplete?: (session: SplitPaymentSession) => void;
  onError?: (error: string) => void;
  className?: string;
}
```

Pre-built split payment component with progress tracking.

## Backend Integration

### Required Endpoints

Your backend must implement these endpoints for the gateway to function properly:

#### POST /payment/initialize

Creates a single payment intent.

**Request:**

```json
{
  "amount": 5000,
  "currency": "usd",
  "orderId": "order_123",
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "metadata": {
    "productId": "prod_123"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "pi_1234567890",
    "clientSecret": "pi_1234567890_secret_...",
    "status": "requires_payment_method",
    "amount": 5000,
    "currency": "usd",
    "created": 1640995200
  }
}
```

#### POST /payment/split/initialize

Creates multiple payment intents for split payment.

**Request:**

```json
{
  "splits": [
    { "amount": 2000, "label": "Card 1" },
    { "amount": 3000, "label": "Card 2" }
  ],
  "timeout": 300,
  "orderId": "order_123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "split_1640995200_abc123",
    "paymentIntents": [
      {
        "id": "pi_1111111111",
        "clientSecret": "pi_1111111111_secret_...",
        "status": "requires_payment_method",
        "amount": 2000,
        "currency": "usd",
        "created": 1640995200
      },
      {
        "id": "pi_2222222222",
        "clientSecret": "pi_2222222222_secret_...",
        "status": "requires_payment_method",
        "amount": 3000,
        "currency": "usd",
        "created": 1640995200
      }
    ],
    "status": "pending",
    "totalAmount": 5000,
    "currency": "usd",
    "expiresAt": 1640995500,
    "completedPayments": 0,
    "failedPayments": 0
  }
}
```

#### Other Required Endpoints

- `POST /payment/refund` - Process refunds
- `POST /payment/verify` - Verify payment status
- `GET /payment/:id/status` - Get payment status
- `POST /payment/:id/cancel` - Cancel payment
- `POST /payment/split/:sessionId/cancel` - Cancel split session

### Webhook Handling

Implement webhook endpoints to receive payment status updates:

```typescript
app.post('/webhooks/vsplit', (req, res) => {
  const event: WebhookEvent = req.body;

  switch (event.type) {
    case 'payment.succeeded':
      // Handle successful payment
      handlePaymentSuccess(event.data.object);
      break;

    case 'split_payment.completed':
      // Handle completed split payment
      handleSplitCompleted(event.data.object);
      break;

    case 'split_payment.timeout':
      // Handle split payment timeout
      handleSplitTimeout(event.data.object);
      break;

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  res.json({ received: true });
});
```

## Security Considerations

### API Key Management

- Never expose secret keys in frontend code
- Use environment variables for sensitive configuration
- Implement proper API key rotation

### HTTPS Requirements

- All communication must use HTTPS in production
- Validate SSL certificates
- Use secure headers

### Webhook Security

- Verify webhook signatures
- Use idempotency keys
- Implement proper error handling and retries

### PCI Compliance

- Never handle raw card data
- Use Stripe Elements for payment collection
- Follow PCI DSS guidelines

### Input Validation

- Validate all inputs on backend
- Sanitize metadata fields
- Check amount limits and currency validity

## Error Handling

### Common Error Scenarios

1. **Network Errors**

   - Connection timeouts
   - DNS resolution failures
   - SSL certificate errors

2. **Payment Errors**

   - Insufficient funds
   - Card declined
   - 3D Secure authentication required

3. **Split Payment Errors**

   - Timeout exceeded
   - Partial completion
   - Individual card failures

4. **Configuration Errors**
   - Invalid API keys
   - Missing required parameters
   - Unsupported currency

### Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "metadata": {
    "field": "validation_error_details"
  }
}
```

### Retry Logic

The gateway implements automatic retry logic for:

- Network timeouts (3 retries with exponential backoff)
- Rate limit errors (automatic retry after delay)
- Temporary server errors (5xx responses)

## Performance Optimization

### Caching Strategy

- Cache Stripe public key and elements configuration
- Use request deduplication for status checks
- Implement proper cache invalidation

### Network Optimization

- Minimize API calls
- Use compression for large responses
- Implement request/response compression

### Memory Management

- Clean up event listeners on component unmount
- Clear timers and intervals
- Implement proper garbage collection

## Testing

### Unit Testing

```bash
npm test
```

### Integration Testing

Use Stripe test mode and test cards:

- `4242424242424242` - Visa (succeeds)
- `4000000000000002` - Card declined
- `4000000000009995` - Insufficient funds

### End-to-End Testing

Test complete payment flows with various scenarios:

- Successful single payments
- Successful split payments
- Timeout scenarios
- Refund flows
- Error conditions

## Monitoring and Logging

### Key Metrics to Monitor

- Payment success rate
- Average payment processing time
- Split payment completion rate
- Timeout frequency
- Error rates by type

### Logging Best Practices

- Log all payment attempts with unique IDs
- Include relevant metadata
- Sanitize sensitive information
- Use structured logging (JSON format)

### Alerting

Set up alerts for:

- High error rates (>5%)
- Payment processing delays (>30s)
- Split payment timeout spikes
- Webhook delivery failures

## Migration Guide

### From Other Payment Processors

1. **Stripe Direct Integration**

   - Replace Stripe SDK calls with VSplit methods
   - Update payment form components
   - Implement split payment logic

2. **PayPal Integration**

   - Convert amount handling (PayPal uses decimal amounts)
   - Update webhook handlers
   - Migrate customer data format

3. **Square Integration**
   - Update API endpoint configurations
   - Convert payment method handling
   - Update error handling logic

### Version Upgrades

Follow semantic versioning for updates:

- Patch versions (1.0.x) - Bug fixes, backward compatible
- Minor versions (1.x.0) - New features, backward compatible
- Major versions (x.0.0) - Breaking changes, migration required

## Troubleshooting

### Common Issues

1. **"Stripe not initialized" Error**

   - Check publishable key configuration
   - Verify network connectivity
   - Ensure proper async/await usage

2. **Split Payment Timeout**

   - Check timeout configuration
   - Verify payment processing speed
   - Monitor customer payment behavior

3. **Webhook Delivery Failures**

   - Verify webhook URL accessibility
   - Check signature validation
   - Monitor response times

4. **Payment Element Not Loading**
   - Check client secret validity
   - Verify Stripe Elements configuration
   - Check browser console for errors

### Debug Mode

Enable debug logging:

```typescript
const gateway = new VSplitPaymentGateway({
  // ... config
  debug: true, // Enable debug logging
});
```

### Support Channels

- Documentation: https://docs.vsplit.com
- GitHub Issues: https://github.com/ModyG/vsplit/issues
- Email Support: support@vsplit.com
- Community Discord: https://discord.gg/vsplit
