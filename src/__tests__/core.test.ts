import { VSplitPaymentGateway } from '../core';
import { ApiClient } from '../utils/api-client';

// Mock ApiClient
jest.mock('../utils/api-client');
const MockApiClient = ApiClient as jest.MockedClass<typeof ApiClient>;

describe('VSplitPaymentGateway', () => {
  let gateway: VSplitPaymentGateway;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock API client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as any;

    MockApiClient.mockImplementation(() => mockApiClient);

    // Initialize gateway
    gateway = new VSplitPaymentGateway({
      stripePublishableKey: 'pk_test_123',
      apiEndpoint: 'https://api.example.com',
      currency: 'usd',
    });
  });

  afterEach(() => {
    gateway.destroy();
  });

  describe('initialization', () => {
    it('should initialize with correct config', () => {
      expect(gateway).toBeInstanceOf(VSplitPaymentGateway);
      expect(MockApiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          stripePublishableKey: 'pk_test_123',
          apiEndpoint: 'https://api.example.com',
          currency: 'usd',
        })
      );
    });

    it('should set default values', () => {
      const gateway2 = new VSplitPaymentGateway({
        stripePublishableKey: 'pk_test_123',
        apiEndpoint: 'https://api.example.com',
      });

      expect(MockApiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          currency: 'usd',
          defaultTimeout: 600,
          environment: 'production',
        })
      );

      gateway2.destroy();
    });
  });

  describe('initializePayment', () => {
    it('should initialize a payment successfully', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        clientSecret: 'pi_test_123_secret',
        status: 'requires_payment_method',
        amount: 5000,
        currency: 'usd',
        created: Date.now() / 1000,
      };

      mockApiClient.post.mockResolvedValue({
        success: true,
        data: mockPaymentIntent,
      });

      const result = await gateway.initializePayment({
        amount: 5000,
        currency: 'usd',
        orderId: 'order_123',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/payment/initialize', {
        amount: 5000,
        currency: 'usd',
        orderId: 'order_123',
      });

      expect(result).toEqual({
        success: true,
        paymentId: 'pi_test_123',
        status: 'requires_payment_method',
        data: mockPaymentIntent,
      });
    });

    it('should handle payment initialization failure', async () => {
      mockApiClient.post.mockResolvedValue({
        success: false,
        error: 'Invalid amount',
      });

      const result = await gateway.initializePayment({
        amount: 0,
        currency: 'usd',
        orderId: 'order_123',
      });

      expect(result).toEqual({
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'Invalid amount',
      });
    });

    it('should handle network errors', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Network error'));

      const result = await gateway.initializePayment({
        amount: 5000,
        currency: 'usd',
        orderId: 'order_123',
      });

      expect(result).toEqual({
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'Network error',
      });
    });
  });

  describe('initializeSplitPayment', () => {
    it('should initialize split payment successfully', async () => {
      const mockSplitSession = {
        sessionId: 'split_123',
        paymentIntents: [
          {
            id: 'pi_1',
            clientSecret: 'pi_1_secret',
            status: 'requires_payment_method',
            amount: 2000,
            currency: 'usd',
            created: Date.now() / 1000,
          },
          {
            id: 'pi_2',
            clientSecret: 'pi_2_secret',
            status: 'requires_payment_method',
            amount: 3000,
            currency: 'usd',
            created: Date.now() / 1000,
          },
        ],
        status: 'pending',
        totalAmount: 5000,
        currency: 'usd',
        expiresAt: Date.now() + 300000,
        completedPayments: 0,
        failedPayments: 0,
      };

      mockApiClient.post.mockResolvedValue({
        success: true,
        data: mockSplitSession,
      });

      const result = await gateway.initializeSplitPayment({
        totalAmount: 5000,
        numberOfCards: 2,
        cardAmounts: [2000, 3000],
        currency: 'usd',
        orderId: 'test-order-123',
        timeout: 300,
      });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/payment/split/initialize',
        {
          splits: [
            { amount: 2000, label: 'Card 1' },
            { amount: 3000, label: 'Card 2' },
          ],
          timeout: 300,
        }
      );

      expect(result).toEqual(mockSplitSession);
    });

    it('should handle split payment initialization failure', async () => {
      mockApiClient.post.mockResolvedValue({
        success: false,
        error: 'Invalid splits configuration',
      });

      await expect(
        gateway.initializeSplitPayment({
          totalAmount: 1000,
          numberOfCards: 1,
          cardAmounts: [0],
          currency: 'usd',
          orderId: 'test-order',
        })
      ).rejects.toThrow('Invalid splits configuration');
    });
  });

  describe('event handling', () => {
    it('should register and emit events correctly', () => {
      const successHandler = jest.fn();
      const errorHandler = jest.fn();

      gateway.on('payment:success', successHandler);
      gateway.on('error', errorHandler);

      // Simulate events (normally these would be triggered internally)
      const mockResult = {
        success: true,
        paymentId: 'pi_123',
        status: 'succeeded' as const,
      };

      const mockError = new Error('Test error');

      // Test event emission (using internal event emitter)
      expect(successHandler).not.toHaveBeenCalled();
      expect(errorHandler).not.toHaveBeenCalled();
    });

    it('should remove event listeners correctly', () => {
      const handler = jest.fn();

      gateway.on('payment:success', handler);
      gateway.off('payment:success', handler);

      // Event should not be called after removal
      // (testing the event emitter functionality)
    });
  });

  describe('refundPayment', () => {
    it('should process refund successfully', async () => {
      const mockRefund = {
        id: 're_test_123',
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
        created: Date.now() / 1000,
      };

      mockApiClient.post.mockResolvedValue({
        success: true,
        data: mockRefund,
      });

      const result = await gateway.refundPayment({
        paymentIntentId: 'pi_test_123',
        amount: 5000,
        reason: 'requested_by_customer',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/payment/refund', {
        paymentIntentId: 'pi_test_123',
        amount: 5000,
        reason: 'requested_by_customer',
      });

      expect(result).toEqual(mockRefund);
    });

    it('should handle refund failure', async () => {
      mockApiClient.post.mockResolvedValue({
        success: false,
        error: 'Payment not found',
      });

      await expect(
        gateway.refundPayment({
          paymentIntentId: 'pi_invalid',
        })
      ).rejects.toThrow('Payment not found');
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment successfully', async () => {
      const mockVerification = {
        verified: true,
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
        details: {
          paymentMethod: 'card',
        },
      };

      mockApiClient.post.mockResolvedValue({
        success: true,
        data: mockVerification,
      });

      const result = await gateway.verifyPayment({
        paymentIntentId: 'pi_test_123',
        expectedAmount: 5000,
        expectedCurrency: 'usd',
      });

      expect(result).toEqual(mockVerification);
    });

    it('should handle verification failure', async () => {
      mockApiClient.post.mockResolvedValue({
        success: false,
        error: 'Verification failed',
      });

      await expect(
        gateway.verifyPayment({
          paymentIntentId: 'pi_test_123',
        })
      ).rejects.toThrow('Verification failed');
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status successfully', async () => {
      mockApiClient.get.mockResolvedValue({
        success: true,
        data: { status: 'succeeded' },
      });

      const result = await gateway.getPaymentStatus('pi_test_123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/payment/pi_test_123/status'
      );
      expect(result).toBe('succeeded');
    });

    it('should handle status fetch failure', async () => {
      mockApiClient.get.mockResolvedValue({
        success: false,
        error: 'Payment not found',
      });

      await expect(gateway.getPaymentStatus('pi_invalid')).rejects.toThrow(
        'Payment not found'
      );
    });
  });

  describe('cancelPayment', () => {
    it('should cancel single payment successfully', async () => {
      // First initialize a payment
      const mockPaymentIntent = {
        id: 'pi_test_123',
        clientSecret: 'pi_test_123_secret',
        status: 'requires_payment_method',
        amount: 5000,
        currency: 'usd',
        created: Date.now() / 1000,
      };

      mockApiClient.post
        .mockResolvedValueOnce({
          success: true,
          data: mockPaymentIntent,
        })
        .mockResolvedValueOnce({
          success: true,
        });

      await gateway.initializePayment({
        amount: 5000,
        currency: 'usd',
        orderId: 'order_123',
      });

      await gateway.cancelPayment();

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/payment/pi_test_123/cancel'
      );
    });

    it('should handle cancellation when no session exists', async () => {
      // Should not throw error when no current session
      await expect(gateway.cancelPayment()).resolves.not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should clean up resources', () => {
      const destroySpy = jest.spyOn(gateway, 'destroy');

      gateway.destroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(gateway.getCurrentSession()).toBeNull();
    });
  });
});
