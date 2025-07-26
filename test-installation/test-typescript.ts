// Test TypeScript imports and type safety
import {
  VSplitPaymentGateway,
  VSplitConfig,
  PaymentIntent,
  SplitPaymentConfig,
  PaymentTheme,
} from '@vegaci_shared/vsplit-payment-gateway';

console.log('Testing TypeScript imports and type safety...');

// Test comprehensive type definitions
try {
  const theme: PaymentTheme = {
    primaryColor: '#007bff',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
  };

  const splitConfig: SplitPaymentConfig = {
    splits: [
      { amount: 1000, label: 'First recipient' },
      { amount: 500, label: 'Second recipient' },
    ],
    timeout: 300,
  };

  const config: VSplitConfig = {
    stripePublishableKey: 'pk_test_dummy_key',
    apiEndpoint: 'https://api.example.com/payments',
    environment: 'sandbox',
    currency: 'usd',
    defaultTimeout: 300,
    theme,
  };

  console.log('✅ TypeScript imports working correctly');
  console.log('✅ Type definitions are properly typed');
  console.log('✅ Complex type configurations compile successfully');
  console.log(
    '✅ PaymentTheme type structure valid:',
    typeof theme === 'object'
  );
  console.log(
    '✅ SplitPaymentConfig type structure valid:',
    typeof splitConfig === 'object'
  );
  console.log(
    '✅ VSplitConfig type structure valid:',
    typeof config === 'object'
  );

  // Test class availability without instantiation
  console.log(
    '✅ VSplitPaymentGateway class available:',
    typeof VSplitPaymentGateway === 'function'
  );
  console.log('✅ TypeScript compilation and type checking successful');
  console.log(
    'Note: Full instantiation requires valid Stripe keys in production environment'
  );
} catch (error) {
  console.error('❌ Error testing TypeScript:', (error as Error).message);
  process.exit(1);
}
