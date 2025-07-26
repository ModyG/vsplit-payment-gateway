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

try {
  const gateway = new VSplitPaymentGateway(config);

  console.log('✅ TypeScript imports working correctly');
  console.log('✅ Type definitions are properly typed');
  console.log('✅ Complex type configurations compile successfully');

  // Test method signatures (TypeScript will catch errors at compile time)
  console.log('Gateway instance created with proper typing');
} catch (error) {
  console.error('❌ Error testing TypeScript:', (error as Error).message);
}
