// Jest setup file
import 'jest-environment-jsdom';

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() =>
    Promise.resolve({
      elements: jest.fn(() => ({
        create: jest.fn(),
        submit: jest.fn(() => Promise.resolve({ error: null })),
      })),
      confirmPayment: jest.fn(() =>
        Promise.resolve({
          paymentIntent: {
            id: 'pi_test_123',
            status: 'succeeded',
            amount: 5000,
            currency: 'usd',
          },
          error: null,
        })
      ),
      handleCardAction: jest.fn(() =>
        Promise.resolve({
          paymentIntent: { status: 'succeeded' },
          error: null,
        })
      ),
    })
  ),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock window.location
(window as any).location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  reload: jest.fn(),
  assign: jest.fn(),
  replace: jest.fn(),
};

// Export to make this a module instead of a script
export {};

// Mock console methods to reduce noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
