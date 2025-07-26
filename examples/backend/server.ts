/**
 * Example backend implementation for VSplit Payment Gateway
 * This example uses Node.js with Express and Stripe
 */

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/webhook' }));

// Storage for sessions (use a proper database in production)
const sessionStorage = new Map();

// API Routes

/**
 * Initialize a single payment
 */
app.post('/api/payment/initialize', async (req, res) => {
  try {
    const { amount, currency, orderId, customer, metadata } = req.body;

    // Validate request
    if (!amount || !currency || !orderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, currency, orderId',
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      metadata: {
        orderId,
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      ...(customer && {
        receipt_email: customer.email,
        shipping: customer.shippingAddress
          ? {
              name: customer.name || 'Customer',
              address: {
                line1: customer.shippingAddress.line1,
                line2: customer.shippingAddress.line2,
                city: customer.shippingAddress.city,
                state: customer.shippingAddress.state,
                postal_code: customer.shippingAddress.postal_code,
                country: customer.shippingAddress.country,
              },
            }
          : undefined,
      }),
    });

    // Store session info
    sessionStorage.set(paymentIntent.id, {
      orderId,
      customer,
      createdAt: new Date(),
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
        metadata: paymentIntent.metadata,
      },
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * Initialize split payment session
 */
app.post('/api/payment/split/initialize', async (req, res) => {
  try {
    const { splits, timeout, orderId, customer, metadata } = req.body;

    // Validate request
    if (!splits || !Array.isArray(splits) || splits.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid splits configuration',
      });
    }

    // Validate splits
    for (const split of splits) {
      if (!split.amount || split.amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Each split must have a positive amount',
        });
      }
    }

    // Create payment intents for each split
    const paymentIntents = await Promise.all(
      splits.map(async (split, index) => {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: split.amount,
          currency: 'usd', // Default currency
          metadata: {
            splitIndex: index.toString(),
            splitLabel: split.label || `Split ${index + 1}`,
            orderId: orderId || `split_${Date.now()}`,
            ...metadata,
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });

        return {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          created: paymentIntent.created,
          metadata: paymentIntent.metadata,
        };
      })
    );

    // Create session
    const sessionId = `split_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
    const expiresAt = Date.now() + (timeout || 600) * 1000; // Default 10 minutes

    const session = {
      sessionId,
      paymentIntents,
      status: 'pending',
      totalAmount: splits.reduce((sum, split) => sum + split.amount, 0),
      currency: 'usd',
      expiresAt,
      completedPayments: 0,
      failedPayments: 0,
      createdAt: new Date(),
      orderId,
      customer,
    };

    // Store session
    sessionStorage.set(sessionId, session);

    // Set timeout for automatic cancellation
    setTimeout(async () => {
      try {
        const storedSession = sessionStorage.get(sessionId);
        if (storedSession && storedSession.status === 'pending') {
          await handleSplitTimeout(sessionId);
        }
      } catch (error) {
        console.error('Error handling split timeout:', error);
      }
    }, (timeout || 600) * 1000);

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Split payment initialization error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * Get payment status
 */
app.get('/api/payment/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    res.json({
      success: true,
      data: {
        status: paymentIntent.status,
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment not found',
    });
  }
});

/**
 * Cancel payment
 */
app.post('/api/payment/:paymentId/cancel', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.cancel(paymentId);

    // Remove from storage
    sessionStorage.delete(paymentId);

    res.json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
      },
    });
  } catch (error) {
    console.error('Cancel payment error:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to cancel payment',
    });
  }
});

/**
 * Cancel split payment session
 */
app.post('/api/payment/split/:sessionId/cancel', async (req, res) => {
  try {
    const { sessionId } = req.params;

    await handleSplitTimeout(sessionId);

    res.json({
      success: true,
      message: 'Split payment session canceled',
    });
  } catch (error) {
    console.error('Cancel split payment error:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to cancel split payment',
    });
  }
});

/**
 * Process refund
 */
app.post('/api/payment/refund', async (req, res) => {
  try {
    const { paymentIntentId, amount, reason, metadata } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required',
      });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason,
      metadata,
    });

    res.json({
      success: true,
      data: {
        id: refund.id,
        status: refund.status,
        amount: refund.amount,
        currency: refund.currency,
        created: refund.created,
        reason: refund.reason,
      },
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to process refund',
    });
  }
});

/**
 * Verify payment
 */
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { paymentIntentId, expectedAmount, expectedCurrency } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required',
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const verified =
      paymentIntent.status === 'succeeded' &&
      (!expectedAmount || paymentIntent.amount === expectedAmount) &&
      (!expectedCurrency ||
        paymentIntent.currency === expectedCurrency.toLowerCase());

    res.json({
      success: true,
      data: {
        verified,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        details: {
          paymentMethod: paymentIntent.payment_method_types,
          created: paymentIntent.created,
        },
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to verify payment',
    });
  }
});

/**
 * Webhook endpoint for Stripe events
 */
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook Error: Invalid signature');
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        handlePaymentFailure(failedPayment);
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment canceled:', canceledPayment.id);
        handlePaymentCancellation(canceledPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

// Helper Functions

async function handleSplitTimeout(sessionId: string) {
  const session = sessionStorage.get(sessionId);
  if (!session) return;

  session.status = 'canceled';
  sessionStorage.set(sessionId, session);

  // Cancel and refund any succeeded payments
  const refundPromises = session.paymentIntents
    .filter((pi: any) => pi.status === 'succeeded')
    .map(async (pi: any) => {
      try {
        await stripe.refunds.create({
          payment_intent: pi.id,
          reason: 'other',
          metadata: {
            reason: 'split_payment_timeout',
            sessionId,
          },
        });
        console.log(`Refunded payment ${pi.id} due to split timeout`);
      } catch (error) {
        console.error(`Failed to refund payment ${pi.id}:`, error);
      }
    });

  await Promise.allSettled(refundPromises);

  // Cancel any pending payments
  const cancelPromises = session.paymentIntents
    .filter((pi: any) =>
      ['requires_payment_method', 'requires_confirmation'].includes(pi.status)
    )
    .map(async (pi: any) => {
      try {
        await stripe.paymentIntents.cancel(pi.id);
        console.log(`Canceled payment ${pi.id} due to split timeout`);
      } catch (error) {
        console.error(`Failed to cancel payment ${pi.id}:`, error);
      }
    });

  await Promise.allSettled(cancelPromises);
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Check if this payment is part of a split session
  const splitIndex = paymentIntent.metadata?.splitIndex;
  if (splitIndex !== undefined) {
    // Find the session containing this payment
    for (const [sessionId, session] of sessionStorage.entries()) {
      if (
        session.paymentIntents?.some((pi: any) => pi.id === paymentIntent.id)
      ) {
        session.completedPayments += 1;

        // Check if all payments in the split are completed
        if (session.completedPayments === session.paymentIntents.length) {
          session.status = 'succeeded';
          console.log(
            `Split payment session ${sessionId} completed successfully`
          );

          // Send webhook notification to merchant
          await sendWebhookNotification({
            type: 'split_payment.completed',
            data: { object: session },
          });
        } else {
          session.status = 'partial';
          await sendWebhookNotification({
            type: 'split_payment.partial',
            data: { object: session },
          });
        }

        sessionStorage.set(sessionId, session);
        break;
      }
    }
  } else {
    // Single payment success
    await sendWebhookNotification({
      type: 'payment.succeeded',
      data: { object: paymentIntent },
    });
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const splitIndex = paymentIntent.metadata?.splitIndex;
  if (splitIndex !== undefined) {
    // Find the session containing this payment
    for (const [sessionId, session] of sessionStorage.entries()) {
      if (
        session.paymentIntents?.some((pi: any) => pi.id === paymentIntent.id)
      ) {
        session.failedPayments += 1;
        sessionStorage.set(sessionId, session);
        break;
      }
    }
  }

  await sendWebhookNotification({
    type: 'payment.failed',
    data: { object: paymentIntent },
  });
}

async function handlePaymentCancellation(paymentIntent: Stripe.PaymentIntent) {
  await sendWebhookNotification({
    type: 'payment.canceled',
    data: { object: paymentIntent },
  });
}

async function sendWebhookNotification(event: any) {
  // Implement webhook sending to merchant's webhook URL
  // This would typically involve:
  // 1. Get merchant's webhook URL from database
  // 2. Sign the payload
  // 3. Send HTTP POST request
  // 4. Handle retries and failures

  console.log('Webhook event:', event.type, event.data);

  // Example implementation:
  const webhookUrl = process.env.MERCHANT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VSplit-Signature': 'signature', // Implement proper signing
        },
        body: JSON.stringify({
          id: `evt_${Date.now()}`,
          type: event.type,
          created: Math.floor(Date.now() / 1000),
          data: event.data,
        }),
      });

      if (!response.ok) {
        console.error(
          'Webhook delivery failed:',
          response.status,
          response.statusText
        );
      } else {
        console.log('Webhook delivered successfully');
      }
    } catch (error) {
      console.error('Webhook delivery error:', error);
    }
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`VSplit backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
