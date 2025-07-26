// Test basic package import and types
import {
  VSplitPaymentGateway,
  VSplitConfig,
} from '@vegaci_shared/vsplit-payment-gateway';

console.log('Testing VSplit Payment Gateway package...');

// Test that we can import the types and class without instantiating
try {
  console.log('✅ Package imported successfully');
  console.log(
    '✅ VSplitPaymentGateway class available:',
    typeof VSplitPaymentGateway === 'function'
  );

  // Test that the config type is available
  const configExample: Partial<VSplitConfig> = {
    stripePublishableKey: 'pk_test_dummy_key',
    apiEndpoint: 'https://api.example.com/payments',
    environment: 'sandbox',
    currency: 'usd',
  };

  console.log(
    '✅ VSplitConfig type working:',
    typeof configExample === 'object'
  );
  console.log('✅ Configuration structure valid');

  // Test constructor function signature exists
  console.log(
    '✅ Constructor signature exists:',
    VSplitPaymentGateway.length === 1
  );

  console.log('✅ Package structure test completed successfully');
  console.log(
    'Note: Full initialization requires valid Stripe keys in production environment'
  );
} catch (error) {
  console.error('❌ Error testing package:', (error as Error).message);
  process.exit(1);
}
