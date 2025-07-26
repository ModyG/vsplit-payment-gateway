import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { VSplitPaymentGateway } from './core';
import {
  VSplitConfig,
  PaymentSessionConfig,
  SplitPaymentConfig,
  PaymentResult,
  PaymentIntent,
  SplitPaymentSession,
  PaymentStatus,
  UseVSplitOptions,
  UseVSplitReturn,
} from './types';

/**
 * VSplit Context
 */
interface VSplitContextType {
  gateway: VSplitPaymentGateway | null;
  initialized: boolean;
}

const VSplitContext = createContext<VSplitContextType | null>(null);

/**
 * VSplit Provider Component
 */
interface VSplitProviderProps {
  config: VSplitConfig;
  children: React.ReactNode;
}

export function VSplitProvider({ config, children }: VSplitProviderProps) {
  const [gateway, setGateway] = useState<VSplitPaymentGateway | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initGateway = async () => {
      try {
        const gatewayInstance = new VSplitPaymentGateway(config);
        setGateway(gatewayInstance);
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize VSplit gateway:', error);
      }
    };

    initGateway();

    return () => {
      if (gateway) {
        gateway.destroy();
      }
    };
  }, [config]);

  return (
    <VSplitContext.Provider value={{ gateway, initialized }}>
      {children}
    </VSplitContext.Provider>
  );
}

/**
 * VSplit Hook
 */
export function useVSplit(options: UseVSplitOptions = {}): UseVSplitReturn {
  const context = useContext(VSplitContext);

  if (!context) {
    throw new Error('useVSplit must be used within a VSplitProvider');
  }

  const { gateway } = context;

  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<
    PaymentIntent | SplitPaymentSession | null
  >(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);

  // Get Stripe instance
  useEffect(() => {
    if (gateway) {
      setStripe(gateway.getStripe());
    }
  }, [gateway]);

  // Event listeners
  useEffect(() => {
    if (!gateway) return;

    const handleSuccess = (result: PaymentResult) => {
      setStatus('succeeded');
      setLoading(false);
      setError(null);
    };

    const handleFailed = (result: PaymentResult) => {
      setStatus('failed');
      setLoading(false);
      setError(result.error || 'Payment failed');
    };

    const handleRequiresAction = (result: PaymentResult) => {
      setStatus('requires_action');
      setLoading(false);
    };

    const handleError = (err: Error) => {
      setError(err.message);
      setLoading(false);
    };

    gateway.on('payment:success', handleSuccess);
    gateway.on('payment:failed', handleFailed);
    gateway.on('payment:requires_action', handleRequiresAction);
    gateway.on('error', handleError);

    return () => {
      gateway.off('payment:success', handleSuccess);
      gateway.off('payment:failed', handleFailed);
      gateway.off('payment:requires_action', handleRequiresAction);
      gateway.off('error', handleError);
    };
  }, [gateway]);

  // Initialize payment
  const initializePayment = useCallback(
    async (config: PaymentSessionConfig): Promise<PaymentResult> => {
      if (!gateway) {
        throw new Error('Gateway not initialized');
      }

      setLoading(true);
      setError(null);
      setStatus('pending');

      try {
        const result = await gateway.initializePayment(config);

        if (result.success && result.data) {
          setCurrentSession(result.data as PaymentIntent | SplitPaymentSession);
          setStatus(result.status);

          // Create elements if client secret is available
          if ((result.data as PaymentIntent).clientSecret && stripe) {
            const elementsInstance = gateway.createElements(
              (result.data as PaymentIntent).clientSecret
            );
            setElements(elementsInstance);
          }
        }

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setStatus('failed');
        return {
          success: false,
          paymentId: '',
          status: 'failed',
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [gateway, stripe]
  );

  // Process payment
  const processPayment = useCallback(
    async (paymentMethod: any): Promise<PaymentResult> => {
      if (!gateway || !currentSession || !('id' in currentSession)) {
        throw new Error('Invalid payment session');
      }

      setLoading(true);
      setError(null);

      try {
        const result = await gateway.processPayment(
          (currentSession as PaymentIntent).id,
          paymentMethod
        );
        setStatus(result.status);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setStatus('failed');
        return {
          success: false,
          paymentId: (currentSession as PaymentIntent).id,
          status: 'failed',
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [gateway, currentSession]
  );

  // Initialize split payment
  const initializeSplitPayment = useCallback(
    async (config: SplitPaymentConfig): Promise<SplitPaymentSession> => {
      if (!gateway) {
        throw new Error('Gateway not initialized');
      }

      setLoading(true);
      setError(null);
      setStatus('pending');

      try {
        const session = await gateway.initializeSplitPayment(config);
        setCurrentSession(session);
        setStatus(session.status);
        return session;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setStatus('failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [gateway]
  );

  // Process split payment
  const processSplitPayment = useCallback(
    async (splitIndex: number, paymentMethod: any): Promise<PaymentResult> => {
      if (!gateway || !currentSession || !('sessionId' in currentSession)) {
        throw new Error('Invalid split payment session');
      }

      setLoading(true);
      setError(null);

      try {
        const result = await gateway.processSplitPayment(
          (currentSession as SplitPaymentSession).sessionId,
          splitIndex,
          paymentMethod
        );

        // Update session status
        const updatedSession =
          gateway.getCurrentSession() as SplitPaymentSession;
        if (updatedSession) {
          setCurrentSession(updatedSession);
          setStatus(updatedSession.status);
        }

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        return {
          success: false,
          paymentId: (currentSession as SplitPaymentSession).sessionId,
          status: 'failed',
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [gateway, currentSession]
  );

  // Cancel payment
  const cancelPayment = useCallback(async (): Promise<void> => {
    if (!gateway) {
      throw new Error('Gateway not initialized');
    }

    setLoading(true);

    try {
      await gateway.cancelPayment();
      setCurrentSession(null);
      setStatus('canceled');
      setElements(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [gateway]);

  return {
    initializePayment,
    processPayment,
    initializeSplitPayment,
    processSplitPayment,
    cancelPayment,
    status,
    loading,
    error,
    currentSession,
    stripe,
    elements,
  };
}

/**
 * Payment Form Component
 */
interface PaymentFormProps {
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export function PaymentForm({
  onSuccess,
  onError,
  className,
  disabled,
}: PaymentFormProps) {
  const { processPayment, elements, stripe, loading, error } = useVSplit();
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLocalLoading(true);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        throw new Error(submitError.message);
      }

      const result = await processPayment({
        id: 'payment-method',
        type: 'card',
      });

      if (result.success) {
        onSuccess?.(result);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      onError?.(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  if (!elements) {
    return <div>Loading payment form...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
    >
      <div id="payment-element">
        {/* Stripe Elements will be mounted here */}
      </div>
      {error && (
        <div
          className="error-message"
          style={{ color: 'red', marginTop: '10px' }}
        >
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={disabled || loading || localLoading || !stripe}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor:
            disabled || loading || localLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor:
            disabled || loading || localLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {localLoading || loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

/**
 * Split Payment Component
 */
interface SplitPaymentProps {
  splits: Array<{ amount: number; label?: string }>;
  onStepComplete?: (stepIndex: number, result: PaymentResult) => void;
  onAllComplete?: (session: SplitPaymentSession) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function SplitPayment({
  splits,
  onStepComplete,
  onAllComplete,
  onError,
  className,
}: SplitPaymentProps) {
  const {
    initializeSplitPayment,
    processSplitPayment,
    currentSession,
    loading,
    error,
  } = useVSplit();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(splits.length).fill(false)
  );
  const [initialized, setInitialized] = useState(false);

  // Initialize split payment on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const totalAmount = splits.reduce(
          (sum, split) => sum + split.amount,
          0
        );
        const config: SplitPaymentConfig = {
          totalAmount,
          numberOfCards: splits.length,
          cardAmounts: splits.map((split) => split.amount),
          currency: 'usd',
          orderId: `split_${Date.now()}`,
          timeout: 600,
        };
        await initializeSplitPayment(config);
        setInitialized(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize split payment';
        onError?.(errorMessage);
      }
    };

    if (!initialized) {
      initialize();
    }
  }, [initializeSplitPayment, splits, initialized, onError]);

  const handleStepPayment = async (stepIndex: number, paymentMethod: any) => {
    try {
      const result = await processSplitPayment(stepIndex, paymentMethod);

      if (result.success) {
        const newCompletedSteps = [...completedSteps];
        newCompletedSteps[stepIndex] = true;
        setCompletedSteps(newCompletedSteps);

        onStepComplete?.(stepIndex, result);

        // Check if all steps are completed
        if (newCompletedSteps.every((completed) => completed)) {
          const session = currentSession as SplitPaymentSession;
          onAllComplete?.(session);
        } else {
          // Move to next step
          const nextStep = newCompletedSteps.findIndex(
            (completed) => !completed
          );
          if (nextStep !== -1) {
            setCurrentStep(nextStep);
          }
        }
      } else {
        onError?.(result.error || 'Payment failed');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Payment processing failed';
      onError?.(errorMessage);
    }
  };

  if (!initialized || loading) {
    return <div>Initializing split payment...</div>;
  }

  if (error) {
    return (
      <div
        className="error-message"
        style={{ color: 'red' }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="split-payment-progress">
        <h3>
          Payment Progress: {completedSteps.filter(Boolean).length} of{' '}
          {splits.length} completed
        </h3>
        <div
          className="progress-bar"
          style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}
        >
          {splits.map((_, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: '10px',
                backgroundColor: completedSteps[index] ? '#28a745' : '#e9ecef',
                borderRadius: '5px',
              }}
            />
          ))}
        </div>
      </div>

      {splits.map((split, index) => (
        <div
          key={index}
          className={`split-step ${index === currentStep ? 'active' : ''} ${
            completedSteps[index] ? 'completed' : ''
          }`}
          style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '10px',
            opacity: index === currentStep ? 1 : 0.6,
          }}
        >
          <h4>
            Step {index + 1}: {split.label || `Payment ${index + 1}`}
            {completedSteps[index] && ' ✓'}
          </h4>
          <p>Amount: ${(split.amount / 100).toFixed(2)}</p>

          {index === currentStep && !completedSteps[index] && (
            <PaymentForm
              onSuccess={(result) => handleStepPayment(index, result)}
              onError={onError}
            />
          )}
        </div>
      ))}
    </div>
  );
}
