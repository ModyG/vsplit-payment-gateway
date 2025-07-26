import { Stripe, StripeElements } from '@stripe/stripe-js';

/**
 * Configuration for initializing the VSplit Payment Gateway
 */
export interface VSplitConfig {
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

/**
 * Theme configuration for payment components
 */
export interface PaymentTheme {
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

/**
 * Payment session configuration
 */
export interface PaymentSessionConfig {
  /** Total amount to be paid (in smallest currency unit) */
  amount: number;
  /** Currency code (ISO 4217) */
  currency: string;
  /** Unique order/transaction ID */
  orderId: string;
  /** Customer information */
  customer?: CustomerInfo;
  /** Timeout in seconds for split payments */
  timeout?: number;
  /** Metadata to attach to the payment */
  metadata?: Record<string, string>;
  /** Return URL after payment completion */
  returnUrl?: string;
  /** Webhook URL for payment notifications */
  webhookUrl?: string;
}

/**
 * Customer information
 */
export interface CustomerInfo {
  /** Customer email */
  email?: string;
  /** Customer name */
  name?: string;
  /** Customer phone */
  phone?: string;
  /** Billing address */
  billingAddress?: Address;
  /** Shipping address */
  shippingAddress?: Address;
}

/**
 * Address information
 */
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

/**
 * Split payment configuration
 */
export interface SplitPaymentConfig {
  /** Total amount to split across multiple customer cards */
  totalAmount: number;
  /** Number of cards customer wants to use */
  numberOfCards: number;
  /** Individual card amounts (must sum to totalAmount) */
  cardAmounts: number[];
  /** Currency code (ISO 4217) */
  currency: string;
  /** Unique order/transaction ID */
  orderId: string;
  /** Customer information */
  customer?: CustomerInfo;
  /** Timeout in seconds for completing all payments */
  timeout?: number;
  /** Metadata to attach to the payments */
  metadata?: Record<string, string>;
}

/**
 * Individual payment split (for customer card splitting)
 */
export interface PaymentSplit {
  /** Amount for this card (in smallest currency unit) */
  amount: number;
  /** Card index/identifier */
  cardIndex: number;
  /** Payment status for this card */
  status: 'pending' | 'processing' | 'completed' | 'failed';
  /** Stripe payment intent ID for this card */
  paymentIntentId?: string;
  /** Client secret for this card payment */
  clientSecret?: string;
  /** Error message if payment failed */
  error?: string;
}

/**
 * Payment method types
 */
export type PaymentMethodType = 'card' | 'bank_transfer' | 'digital_wallet';

/**
 * Payment status
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'requires_action'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'partial'
  | 'refunded'
  | 'completed'
  | 'timeout'
  | 'refunding';

/**
 * Payment intent response
 */
export interface PaymentIntent {
  /** Payment intent ID */
  id: string;
  /** Client secret for frontend */
  clientSecret: string;
  /** Payment status */
  status: PaymentStatus;
  /** Amount */
  amount: number;
  /** Currency */
  currency: string;
  /** Creation timestamp */
  created: number;
  /** Metadata */
  metadata?: Record<string, string>;
}

/**
 * Split payment session (for customer multi-card payments)
 */
export interface SplitPaymentSession {
  /** Session ID */
  sessionId: string;
  /** Total amount to be paid */
  totalAmount: number;
  /** Currency */
  currency: string;
  /** Order ID */
  orderId: string;
  /** Array of individual card payments */
  cardPayments: PaymentSplit[];
  /** Array of payment intents for each card */
  paymentIntents: PaymentIntent[];
  /** Overall session status */
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'timeout'
    | 'refunding'
    | 'succeeded'
    | 'partial'
    | 'canceled';
  /** Number of completed payments */
  completedPayments: number;
  /** Number of failed payments */
  failedPayments: number;
  /** Session creation timestamp */
  createdAt: number;
  /** Session expiration timestamp */
  expiresAt: number;
  /** Whether session has timed out */
  isTimedOut: boolean;
  /** Refund status if timeout occurred */
  refundStatus?: 'pending' | 'completed' | 'failed';
  /** Customer information */
  customer?: CustomerInfo;
  /** Metadata */
  metadata?: Record<string, string>;
}

/**
 * Payment result
 */
export interface PaymentResult {
  /** Success flag */
  success: boolean;
  /** Payment intent or session ID */
  paymentId: string;
  /** Payment status */
  status: PaymentStatus;
  /** Error message if failed */
  error?: string;
  /** Additional data */
  data?: any;
}

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.canceled'
  | 'split_payment.completed'
  | 'split_payment.partial'
  | 'split_payment.timeout'
  | 'split_payment.refunded';

/**
 * Webhook event
 */
export interface WebhookEvent {
  /** Event type */
  type: WebhookEventType;
  /** Event ID */
  id: string;
  /** Timestamp */
  created: number;
  /** Event data */
  data: {
    object: PaymentIntent | SplitPaymentSession;
  };
  /** Request details */
  request?: {
    id: string;
    idempotency_key?: string;
  };
}

/**
 * Event callback function type
 */
export type EventCallback<T = any> = (event: T) => void | Promise<void>;

/**
 * Payment gateway events
 */
export interface PaymentGatewayEvents {
  /** Payment succeeded */
  'payment:success': EventCallback<PaymentResult>;
  /** Payment failed */
  'payment:failed': EventCallback<PaymentResult>;
  /** Payment requires action */
  'payment:requires_action': EventCallback<PaymentResult>;
  /** Split payment completed */
  'split:completed': EventCallback<SplitPaymentSession>;
  /** Split payment partially completed */
  'split:partial': EventCallback<SplitPaymentSession>;
  /** Split payment timed out */
  'split:timeout': EventCallback<SplitPaymentSession>;
  /** Payment canceled */
  'payment:canceled': EventCallback<PaymentResult>;
  /** Error occurred */
  error: EventCallback<Error>;
}

/**
 * React hook options
 */
export interface UseVSplitOptions {
  /** Auto-initialize on mount */
  autoInit?: boolean;
  /** Enable split payments */
  enableSplitPayments?: boolean;
  /** Default payment configuration */
  defaultConfig?: Partial<PaymentSessionConfig>;
}

/**
 * React hook return type
 */
export interface UseVSplitReturn {
  /** Initialize payment session */
  initializePayment: (config: PaymentSessionConfig) => Promise<PaymentResult>;
  /** Process single payment */
  processPayment: (paymentMethod: any) => Promise<PaymentResult>;
  /** Initialize split payment */
  initializeSplitPayment: (
    config: SplitPaymentConfig
  ) => Promise<SplitPaymentSession>;
  /** Process split payment step */
  processSplitPayment: (
    splitIndex: number,
    paymentMethod: any
  ) => Promise<PaymentResult>;
  /** Cancel payment */
  cancelPayment: () => Promise<void>;
  /** Current payment status */
  status: PaymentStatus;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Current payment session */
  currentSession: PaymentIntent | SplitPaymentSession | null;
  /** Stripe instance */
  stripe: Stripe | null;
  /** Stripe elements */
  elements: StripeElements | null;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Success flag */
  success: boolean;
  /** Response data */
  data?: T;
  /** Error message */
  error?: string;
  /** Error code */
  code?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Refund request
 */
export interface RefundRequest {
  /** Payment intent ID to refund */
  paymentIntentId: string;
  /** Amount to refund (optional, defaults to full amount) */
  amount?: number;
  /** Reason for refund */
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other';
  /** Additional metadata */
  metadata?: Record<string, string>;
}

/**
 * Refund response
 */
export interface RefundResponse {
  /** Refund ID */
  id: string;
  /** Refund status */
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  /** Refunded amount */
  amount: number;
  /** Currency */
  currency: string;
  /** Creation timestamp */
  created: number;
  /** Reason */
  reason?: string;
}

/**
 * Payment verification request
 */
export interface PaymentVerificationRequest {
  /** Payment intent ID */
  paymentIntentId: string;
  /** Expected amount */
  expectedAmount?: number;
  /** Expected currency */
  expectedCurrency?: string;
}

/**
 * Payment verification response
 */
export interface PaymentVerificationResponse {
  /** Verification result */
  verified: boolean;
  /** Payment status */
  status: PaymentStatus;
  /** Amount */
  amount: number;
  /** Currency */
  currency: string;
  /** Additional details */
  details?: Record<string, any>;
}

// ========================================
// MERCHANT REVENUE SPLITTING (OPTIONAL)
// ========================================

/**
 * Merchant revenue split configuration (optional feature)
 * This splits the received payment between merchant, platform, etc.
 */
export interface MerchantRevenueSplit {
  /** Amount to split to this recipient (in smallest currency unit) */
  amount: number;
  /** Label for this split */
  label: string;
  /** Recipient account/ID */
  recipient: string;
  /** Commission percentage (alternative to amount) */
  percentage?: number;
}

/**
 * Enhanced payment session config with optional merchant splitting
 */
export interface EnhancedPaymentSessionConfig extends PaymentSessionConfig {
  /** Optional merchant revenue splits */
  merchantSplits?: MerchantRevenueSplit[];
  /** Enable automatic merchant splitting */
  enableMerchantSplitting?: boolean;
}
