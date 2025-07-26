// Test basic package import
import {
  VSplitPaymentGateway,
  VSplitConfig,
} from '@vegaci_shared/vsplit-payment-gateway';

console.log('Testing VSplit Payment Gateway package...');

// Test basic initialization
try {
  const config: VSplitConfig = {
    stripePublishableKey: 'pk_test_dummy_key',
    apiEndpoint: 'https://api.example.com/payments',
  };

  const gateway = new VSplitPaymentGateway(config);

  console.log('✅ Package imported successfully');
  console.log('✅ VSplitPaymentGateway initialized successfully');
  console.log(
    'Gateway methods available:',
    Object.getOwnPropertyNames(Object.getPrototypeOf(gateway))
  );

  // Test type safety
  const methods = [
    'initialize',
    'createElements',
    'initializePayment',
    'processPayment',
    'initializeSplitPayment',
    'processSplitPayment',
    'cancelPayment',
    'refundPayment',
    'verifyPayment',
  ];

  console.log(
    '✅ Expected methods present:',
    methods.every((method) => typeof (gateway as any)[method] === 'function')
  );
} catch (error) {
  console.error('❌ Error testing package:', (error as Error).message);
}
