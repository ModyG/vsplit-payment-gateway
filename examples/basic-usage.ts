/**
 * Basic usage example for VSplit Payment Gateway
 */

import VSplitPaymentGateway from '@vsplit/payment-gateway';

// Initialize the gateway
const gateway = new VSplitPaymentGateway({
  stripePublishableKey: 'pk_test_51234567890abcdef...',
  apiEndpoint: 'https://your-backend.com/api',
  apiKey: 'your-api-key',
  currency: 'usd',
  defaultTimeout: 600, // 10 minutes
  theme: {
    primaryColor: '#007bff',
    borderRadius: '8px',
  },
});

// Example 1: Single Payment
async function processSinglePayment() {
  try {
    console.log('Initializing single payment...');

    const paymentResult = await gateway.initializePayment({
      amount: 5000, // $50.00
      currency: 'usd',
      orderId: 'order_123',
      customer: {
        email: 'customer@example.com',
        name: 'John Doe',
      },
      metadata: {
        productId: 'prod_123',
        campaignId: 'camp_456',
      },
    });

    if (!paymentResult.success) {
      throw new Error(paymentResult.error);
    }

    console.log('Payment initialized:', paymentResult);

    // Create payment elements (this would typically be in your UI)
    const elements = gateway.createElements(paymentResult.data!.clientSecret);

    if (!elements) {
      throw new Error('Failed to create payment elements');
    }

    // Simulate payment method confirmation
    // In a real app, this would come from user interaction with Stripe Elements
    const result = await gateway.processPayment(paymentResult.paymentId, {
      elements,
      returnUrl: window.location.href,
    });

    console.log('Payment result:', result);

    if (result.success) {
      console.log('✅ Payment successful!');
    } else {
      console.log('❌ Payment failed:', result.error);
    }
  } catch (error) {
    console.error('Single payment error:', error);
  }
}

// Example 2: Split Payment
async function processSplitPayment() {
  try {
    console.log('Initializing split payment...');

    const splitSession = await gateway.initializeSplitPayment({
      splits: [
        { amount: 2000, label: 'First Card Payment' }, // $20.00
        { amount: 2000, label: 'Second Card Payment' }, // $20.00
        { amount: 1000, label: 'Third Card Payment' }, // $10.00
      ],
      timeout: 300, // 5 minutes
    });

    console.log('Split payment session created:', splitSession);

    // Process each split payment
    for (let i = 0; i < splitSession.paymentIntents.length; i++) {
      const paymentIntent = splitSession.paymentIntents[i];

      console.log(`Processing split ${i + 1}...`);

      // Create elements for this specific payment intent
      const elements = gateway.createElements(paymentIntent.clientSecret);

      if (!elements) {
        console.error(`Failed to create elements for split ${i + 1}`);
        continue;
      }

      try {
        const result = await gateway.processSplitPayment(
          splitSession.sessionId,
          i,
          {
            elements,
            returnUrl: window.location.href,
          }
        );

        console.log(`Split ${i + 1} result:`, result);

        if (result.success) {
          console.log(`✅ Split ${i + 1} successful!`);
        } else {
          console.log(`❌ Split ${i + 1} failed:`, result.error);
        }
      } catch (error) {
        console.error(`Split ${i + 1} processing error:`, error);
      }
    }

    // Check final session status
    const finalSession = gateway.getCurrentSession();
    console.log('Final session status:', finalSession);
  } catch (error) {
    console.error('Split payment error:', error);
  }
}

// Example 3: Event Handling
function setupEventHandling() {
  // Success events
  gateway.on('payment:success', (result) => {
    console.log('🎉 Payment succeeded:', result);
    // Show success message to user
    showNotification('Payment successful!', 'success');
  });

  // Failure events
  gateway.on('payment:failed', (result) => {
    console.log('💥 Payment failed:', result);
    // Show error message to user
    showNotification(`Payment failed: ${result.error}`, 'error');
  });

  // Requires action (e.g., 3D Secure)
  gateway.on('payment:requires_action', (result) => {
    console.log('🔐 Payment requires action:', result);
    showNotification('Please complete the verification', 'warning');
  });

  // Split payment events
  gateway.on('split:completed', (session) => {
    console.log('🏁 All split payments completed:', session);
    showNotification('All payments completed successfully!', 'success');
  });

  gateway.on('split:partial', (session) => {
    console.log('⏳ Partial split payment completed:', session);
    const completed = session.completedPayments;
    const total = session.paymentIntents.length;
    showNotification(`${completed}/${total} payments completed`, 'info');
  });

  gateway.on('split:timeout', (session) => {
    console.log('⏰ Split payment timed out:', session);
    showNotification(
      'Payment session expired. Refunds will be processed.',
      'warning'
    );
  });

  // Payment canceled
  gateway.on('payment:canceled', (result) => {
    console.log('🚫 Payment canceled:', result);
    showNotification('Payment was canceled', 'info');
  });

  // General errors
  gateway.on('error', (error) => {
    console.error('💀 Gateway error:', error);
    showNotification(`System error: ${error.message}`, 'error');
  });
}

// Example 4: Payment Verification
async function verifyPayment(paymentIntentId: string) {
  try {
    const verification = await gateway.verifyPayment({
      paymentIntentId,
      expectedAmount: 5000,
      expectedCurrency: 'usd',
    });

    console.log('Payment verification result:', verification);

    if (verification.verified) {
      console.log('✅ Payment verified successfully');
    } else {
      console.log('❌ Payment verification failed');
    }

    return verification;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
}

// Example 5: Refund Processing
async function processRefund(paymentIntentId: string, amount?: number) {
  try {
    const refund = await gateway.refundPayment({
      paymentIntentId,
      amount, // Optional: partial refund
      reason: 'requested_by_customer',
      metadata: {
        refundReason: 'Customer requested refund',
        processedBy: 'admin',
      },
    });

    console.log('Refund result:', refund);

    if (refund.status === 'succeeded') {
      console.log('✅ Refund processed successfully');
    } else {
      console.log('⏳ Refund is being processed');
    }

    return refund;
  } catch (error) {
    console.error('Refund processing error:', error);
    throw error;
  }
}

// Example 6: Payment Status Tracking
async function trackPaymentStatus(paymentId: string) {
  try {
    const status = await gateway.getPaymentStatus(paymentId);
    console.log('Current payment status:', status);

    // Poll for status updates (in a real app, use webhooks instead)
    const pollInterval = setInterval(async () => {
      try {
        const currentStatus = await gateway.getPaymentStatus(paymentId);
        console.log('Updated payment status:', currentStatus);

        if (['succeeded', 'failed', 'canceled'].includes(currentStatus)) {
          clearInterval(pollInterval);
          console.log('Payment reached final status:', currentStatus);
        }
      } catch (error) {
        console.error('Status polling error:', error);
        clearInterval(pollInterval);
      }
    }, 2000);

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      console.log('Status polling stopped (timeout)');
    }, 300000);
  } catch (error) {
    console.error('Payment tracking error:', error);
  }
}

// Utility function for notifications (implement based on your UI framework)
function showNotification(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info'
) {
  console.log(`[${type.toUpperCase()}] ${message}`);

  // Example implementation with browser notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`VSplit Payment`, {
      body: message,
      icon: '/favicon.ico',
    });
  }
}

// Initialize and run examples
async function runExamples() {
  console.log('🚀 Starting VSplit Payment Gateway Examples');

  // Setup event handling
  setupEventHandling();

  // Run examples (uncomment the ones you want to test)

  // await processSinglePayment();
  // await processSplitPayment();
  // await verifyPayment('pi_1234567890');
  // await processRefund('pi_1234567890', 1000); // Partial refund of $10
  // await trackPaymentStatus('pi_1234567890');

  console.log('✨ Examples completed');
}

// Run examples when script loads
if (typeof window !== 'undefined') {
  // Browser environment
  runExamples().catch(console.error);
} else {
  // Node.js environment
  console.log('Examples ready - call runExamples() to start');
}

export {
  processSinglePayment,
  processSplitPayment,
  verifyPayment,
  processRefund,
  trackPaymentStatus,
  runExamples,
};
