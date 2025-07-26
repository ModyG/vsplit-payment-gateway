import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import {
  VSplitConfig,
  PaymentSessionConfig,
  SplitPaymentConfig,
  PaymentResult,
  PaymentIntent,
  SplitPaymentSession,
  PaymentStatus,
  PaymentGatewayEvents,
  RefundRequest,
  RefundResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from './types';
import { ApiClient } from './utils/api-client';
import { EventEmitter } from './utils/event-emitter';
import { PaymentTimer } from './utils/payment-timer';

/**
 * Main VSplit Payment Gateway class
 */
export class VSplitPaymentGateway {
  private stripe: Stripe | null = null;
  private config: VSplitConfig;
  private apiClient: ApiClient;
  private eventEmitter: EventEmitter<PaymentGatewayEvents>;
  private paymentTimer: PaymentTimer;
  private currentSession: PaymentIntent | SplitPaymentSession | null = null;

  constructor(config: VSplitConfig) {
    this.config = {
      currency: 'usd',
      defaultTimeout: 600, // 10 minutes
      environment: 'production',
      ...config,
    };

    this.apiClient = new ApiClient(this.config);
    this.eventEmitter = new EventEmitter();
    this.paymentTimer = new PaymentTimer();

    this.initialize();
  }

  /**
   * Initialize Stripe
   */
  private async initialize(): Promise<void> {
    try {
      this.stripe = await loadStripe(this.config.stripePublishableKey);
      if (!this.stripe) {
        throw new Error('Failed to load Stripe');
      }
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Get Stripe instance
   */
  public getStripe(): Stripe | null {
    return this.stripe;
  }

  /**
   * Create payment elements
   */
  public createElements(clientSecret: string): StripeElements | null {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    return this.stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: this.config.theme?.primaryColor || '#0066cc',
          borderRadius: this.config.theme?.borderRadius || '4px',
          fontFamily: this.config.theme?.fontFamily || 'system-ui, sans-serif',
        },
      },
    });
  }

  /**
   * Initialize a single payment session
   */
  public async initializePayment(
    config: PaymentSessionConfig
  ): Promise<PaymentResult> {
    try {
      const response = await this.apiClient.post<PaymentIntent>(
        '/payment/initialize',
        {
          ...config,
          currency: config.currency || this.config.currency,
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to initialize payment');
      }

      this.currentSession = response.data;
      return {
        success: true,
        paymentId: response.data.id,
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      const result = {
        success: false,
        paymentId: '',
        status: 'failed' as PaymentStatus,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.eventEmitter.emit('payment:failed', result);
      return result;
    }
  }

  /**
   * Process a single payment
   */
  public async processPayment(
    paymentIntentId: string,
    paymentMethod: { elements: StripeElements; id?: string; returnUrl?: string }
  ): Promise<PaymentResult> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      const { paymentIntent, error } = await this.stripe.confirmPayment({
        elements: paymentMethod.elements,
        confirmParams: {
          payment_method: paymentMethod.id || 'auto',
          return_url: paymentMethod.returnUrl || window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        const result = {
          success: false,
          paymentId: paymentIntentId,
          status: 'failed' as PaymentStatus,
          error: error.message,
        };
        this.eventEmitter.emit('payment:failed', result);
        return result;
      }

      const result = {
        success: paymentIntent?.status === 'succeeded',
        paymentId: paymentIntent?.id || paymentIntentId,
        status: (paymentIntent?.status as PaymentStatus) || 'failed',
        data: paymentIntent,
      };

      if (result.success) {
        this.eventEmitter.emit('payment:success', result);
      } else if (paymentIntent?.status === 'requires_action') {
        this.eventEmitter.emit('payment:requires_action', result);
      } else {
        this.eventEmitter.emit('payment:failed', result);
      }

      return result;
    } catch (error) {
      const result = {
        success: false,
        paymentId: paymentIntentId,
        status: 'failed' as PaymentStatus,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.eventEmitter.emit('payment:failed', result);
      return result;
    }
  }

  /**
   * Initialize split payment session
   */
  public async initializeSplitPayment(
    config: SplitPaymentConfig
  ): Promise<SplitPaymentSession> {
    try {
      const timeout = config.timeout || this.config.defaultTimeout || 600;

      const response = await this.apiClient.post<SplitPaymentSession>(
        '/payment/split/initialize',
        {
          ...config,
          timeout,
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to initialize split payment');
      }

      this.currentSession = response.data;

      // Start timeout timer
      this.paymentTimer.startTimer(timeout * 1000, () => {
        this.handleSplitPaymentTimeout(response.data?.sessionId || '');
      });

      return response.data;
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Process a split payment step
   */
  public async processSplitPayment(
    sessionId: string,
    splitIndex: number,
    paymentMethod: { elements: StripeElements; id?: string; returnUrl?: string }
  ): Promise<PaymentResult> {
    try {
      const session = this.currentSession as SplitPaymentSession;
      if (!session || session.sessionId !== sessionId) {
        throw new Error('Invalid session');
      }

      const paymentIntent = session.paymentIntents[splitIndex];
      if (!paymentIntent) {
        throw new Error('Invalid split index');
      }

      const result = await this.processPayment(paymentIntent.id, paymentMethod);

      if (result.success) {
        // Update session status
        session.completedPayments += 1;

        // Check if all payments are completed
        if (session.completedPayments === session.paymentIntents.length) {
          session.status = 'succeeded';
          this.paymentTimer.clearTimer();
          this.eventEmitter.emit('split:completed', session);
        } else {
          session.status = 'partial';
          this.eventEmitter.emit('split:partial', session);
        }
      } else {
        session.failedPayments += 1;
      }

      return result;
    } catch (error) {
      const result = {
        success: false,
        paymentId: sessionId,
        status: 'failed' as PaymentStatus,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.eventEmitter.emit('payment:failed', result);
      return result;
    }
  }

  /**
   * Handle split payment timeout
   */
  private async handleSplitPaymentTimeout(sessionId: string): Promise<void> {
    try {
      const session = this.currentSession as SplitPaymentSession;
      if (!session || session.sessionId !== sessionId) {
        return;
      }

      session.status = 'canceled';

      // Refund any completed payments
      await this.refundPartialPayments(session);

      this.eventEmitter.emit('split:timeout', session);
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
    }
  }

  /**
   * Refund partial payments in a split payment session
   */
  private async refundPartialPayments(
    session: SplitPaymentSession
  ): Promise<void> {
    const refundPromises = session.paymentIntents
      .filter((pi) => pi.status === 'succeeded')
      .map((pi) =>
        this.refundPayment({
          paymentIntentId: pi.id,
          reason: 'other',
          metadata: {
            reason: 'split_payment_timeout',
            sessionId: session.sessionId,
          },
        })
      );

    await Promise.allSettled(refundPromises);
  }

  /**
   * Cancel current payment
   */
  public async cancelPayment(): Promise<void> {
    try {
      if (!this.currentSession) {
        return;
      }

      this.paymentTimer.clearTimer();

      if ('sessionId' in this.currentSession) {
        // Split payment session
        const splitSession = this.currentSession as SplitPaymentSession;
        await this.apiClient.post(
          `/payment/split/${splitSession.sessionId}/cancel`
        );
        await this.refundPartialPayments(splitSession);
      } else {
        // Single payment
        await this.apiClient.post(`/payment/${this.currentSession.id}/cancel`);
      }

      const result = {
        success: true,
        paymentId: ('sessionId' in this.currentSession
          ? (this.currentSession as SplitPaymentSession).sessionId
          : (this.currentSession as PaymentIntent).id) as string,
        status: 'canceled' as PaymentStatus,
      };

      this.eventEmitter.emit('payment:canceled', result);
      this.currentSession = null;
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Refund a payment
   */
  public async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await this.apiClient.post<RefundResponse>(
        '/payment/refund',
        request
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to process refund');
      }

      return response.data;
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Verify a payment
   */
  public async verifyPayment(
    request: PaymentVerificationRequest
  ): Promise<PaymentVerificationResponse> {
    try {
      const response = await this.apiClient.post<PaymentVerificationResponse>(
        '/payment/verify',
        request
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to verify payment');
      }

      return response.data;
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  public async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await this.apiClient.get<{ status: PaymentStatus }>(
        `/payment/${paymentId}/status`
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get payment status');
      }

      return response.data.status;
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Subscribe to events
   */
  public on<K extends keyof PaymentGatewayEvents>(
    event: K,
    callback: PaymentGatewayEvents[K]
  ): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Unsubscribe from events
   */
  public off<K extends keyof PaymentGatewayEvents>(
    event: K,
    callback: PaymentGatewayEvents[K]
  ): void {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Get current session
   */
  public getCurrentSession(): PaymentIntent | SplitPaymentSession | null {
    return this.currentSession;
  }

  // ========================================
  // MERCHANT REVENUE SPLITTING (OPTIONAL)
  // ========================================

  /**
   * Initialize payment with merchant revenue splitting
   * This processes customer payment and then splits revenue between recipients
   */
  public async initializePaymentWithMerchantSplits(
    config: PaymentSessionConfig & {
      merchantSplits?: Array<{
        amount: number;
        label: string;
        recipient: string;
        percentage?: number;
      }>;
    }
  ): Promise<PaymentResult> {
    try {
      // First, initialize the regular payment
      const paymentResult = await this.initializePayment(config);

      if (!paymentResult.success) {
        return paymentResult;
      }

      // If merchant splits are provided, process them after successful payment
      if (config.merchantSplits && config.merchantSplits.length > 0) {
        // Store the merchant splits for processing after payment confirmation
        (
          paymentResult.data as PaymentResult['data'] & {
            merchantSplits?: typeof config.merchantSplits;
          }
        ).merchantSplits = config.merchantSplits;
      }

      return paymentResult;
    } catch (error) {
      const result = {
        success: false,
        paymentId: '',
        status: 'failed' as PaymentStatus,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.eventEmitter.emit('payment:failed', result);
      return result;
    }
  }

  /**
   * Process merchant revenue splits after successful payment
   */
  public async processMerchantSplits(
    paymentIntentId: string,
    splits: Array<{
      amount: number;
      label: string;
      recipient: string;
    }>
  ): Promise<{
    success: boolean;
    splits: Array<{
      amount: number;
      label: string;
      recipient: string;
      id?: string;
    }>;
    error?: string;
  }> {
    try {
      const response = await this.apiClient.post(
        '/payment/merchant-splits/process',
        {
          paymentIntentId,
          splits,
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to process merchant splits');
      }

      return {
        success: true,
        splits:
          (
            response.data as {
              splits?: Array<{
                amount: number;
                label: string;
                recipient: string;
                id?: string;
              }>;
            }
          )?.splits || [],
      };
    } catch (error) {
      return {
        success: false,
        splits: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Destroy the gateway instance
   */
  public destroy(): void {
    this.paymentTimer.clearTimer();
    this.eventEmitter.removeAllListeners();
    this.currentSession = null;
  }
}
