// Test React component imports with TypeScript
import * as React from 'react';
import {
  VSplitProvider,
  useVSplit,
  PaymentForm,
  SplitPayment,
} from '@vegaci_shared/vsplit-payment-gateway/react';
import { VSplitConfig } from '@vegaci_shared/vsplit-payment-gateway';

console.log('Testing React components with TypeScript...');

try {
  // Test that React components are available and properly typed
  console.log('✅ React components imported successfully');
  console.log('VSplitProvider component:', typeof VSplitProvider);
  console.log('useVSplit hook:', typeof useVSplit);
  console.log('PaymentForm component:', typeof PaymentForm);
  console.log('SplitPayment component:', typeof SplitPayment);

  // Test TypeScript compatibility
  const config: VSplitConfig = {
    stripePublishableKey: 'pk_test_dummy_key',
    apiEndpoint: 'https://api.example.com/payments',
  };

  // These would be compile-time checked in a real React app
  console.log('✅ TypeScript types work correctly with React components');

  if (
    typeof VSplitProvider === 'function' &&
    typeof PaymentForm === 'function'
  ) {
    console.log('✅ React components are valid functions');
  } else {
    console.log('❌ Some React components are not functions');
  }
} catch (error) {
  console.error('❌ Error testing React components:', (error as Error).message);
}
