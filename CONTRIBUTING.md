# Contributing to VSplit Payment Gateway

We welcome contributions to the VSplit Payment Gateway! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@vsplit.com.

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher
- Git
- A Stripe account (for testing)

### Technologies We Use

- **TypeScript** - Primary development language
- **React** - Frontend framework integration
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Stripe** - Payment processing
- **Express.js** - Backend examples

## Development Setup

1. **Fork the repository**

   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/yourusername/vsplit.git
   cd vsplit/vSplit
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your Stripe test keys
   ```

4. **Run the development build**

   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

### Development Scripts

```bash
# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Build documentation
npm run docs:build
```

## Contributing Process

### 1. Find or Create an Issue

- Check existing issues before creating a new one
- Use issue templates when available
- Provide clear descriptions and reproduction steps
- Add appropriate labels

### 2. Discuss Before Building

- Comment on the issue to discuss your approach
- Get feedback from maintainers
- Consider alternative solutions

### 3. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-number-description
```

### 4. Make Your Changes

- Follow our coding standards
- Write tests for new functionality
- Update documentation as needed
- Keep commits atomic and well-described

### 5. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test files
npm test -- src/core.test.ts

# Check test coverage
npm run test:coverage
```

### 6. Submit a Pull Request

- Use the pull request template
- Provide clear description of changes
- Link to related issues
- Request review from maintainers

## Coding Standards

### TypeScript Guidelines

1. **Use strict TypeScript configuration**

   ```typescript
   // Good
   function processPayment(
     amount: number,
     currency: string
   ): Promise<PaymentResult> {
     // Implementation
   }

   // Avoid
   function processPayment(amount: any, currency: any): any {
     // Implementation
   }
   ```

2. **Define interfaces for all data structures**

   ```typescript
   interface PaymentConfig {
     amount: number;
     currency: string;
     orderId: string;
     customer?: CustomerInfo;
   }
   ```

3. **Use enums for constants**
   ```typescript
   enum PaymentStatus {
     PENDING = 'pending',
     SUCCEEDED = 'succeeded',
     FAILED = 'failed',
     CANCELLED = 'cancelled',
   }
   ```

### Code Style

1. **Use meaningful variable names**

   ```typescript
   // Good
   const paymentIntentId = 'pi_1234567890';
   const customerEmail = 'user@example.com';

   // Avoid
   const id = 'pi_1234567890';
   const email = 'user@example.com';
   ```

2. **Write self-documenting code**

   ```typescript
   // Good
   function calculateSplitAmounts(
     totalAmount: number,
     numberOfSplits: number
   ): number[] {
     const baseAmount = Math.floor(totalAmount / numberOfSplits);
     const remainder = totalAmount % numberOfSplits;

     return Array.from(
       { length: numberOfSplits },
       (_, index) => baseAmount + (index < remainder ? 1 : 0)
     );
   }
   ```

3. **Handle errors appropriately**
   ```typescript
   // Good
   try {
     const result = await processPayment(config);
     return { success: true, data: result };
   } catch (error) {
     logger.error('Payment processing failed', { error, config });
     return { success: false, error: error.message };
   }
   ```

### React Guidelines

1. **Use functional components with hooks**

   ```typescript
   // Good
   const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
     const [loading, setLoading] = useState(false);
     const { processPayment } = useVSplit();

     // Component implementation
   };
   ```

2. **Implement proper prop types**

   ```typescript
   interface PaymentFormProps {
     onSuccess?: (result: PaymentResult) => void;
     onError?: (error: string) => void;
     className?: string;
     disabled?: boolean;
   }
   ```

3. **Use custom hooks for business logic**
   ```typescript
   function usePaymentTimer(timeoutSeconds: number) {
     const [timeRemaining, setTimeRemaining] = useState(timeoutSeconds);
     const [isExpired, setIsExpired] = useState(false);

     // Hook implementation

     return { timeRemaining, isExpired };
   }
   ```

### Error Handling

1. **Create custom error classes**

   ```typescript
   class PaymentError extends Error {
     constructor(
       message: string,
       public code: string,
       public metadata?: Record<string, any>
     ) {
       super(message);
       this.name = 'PaymentError';
     }
   }
   ```

2. **Provide meaningful error messages**

   ```typescript
   // Good
   throw new PaymentError(
     'Payment failed due to insufficient funds',
     'INSUFFICIENT_FUNDS',
     { cardLast4: '4242', amount: config.amount }
   );

   // Avoid
   throw new Error('Payment failed');
   ```

## Testing Guidelines

### Test Structure

1. **Organize tests by feature**

   ```
   src/
   ├── core.ts
   ├── core.test.ts
   ├── utils/
   │   ├── validation.ts
   │   └── validation.test.ts
   └── react/
       ├── hooks.tsx
       └── hooks.test.tsx
   ```

2. **Use descriptive test names**

   ```typescript
   describe('VSplitPaymentGateway', () => {
     describe('initializePayment', () => {
       it('should create payment intent with valid configuration', async () => {
         // Test implementation
       });

       it('should throw error when amount is negative', async () => {
         // Test implementation
       });
     });
   });
   ```

### Testing Patterns

1. **Mock external dependencies**

   ```typescript
   jest.mock('@stripe/stripe-js', () => ({
     loadStripe: jest.fn().mockResolvedValue({
       createPaymentMethod: jest
         .fn()
         .mockResolvedValue({ paymentMethod: { id: 'pm_test' } }),
     }),
   }));
   ```

2. **Test error conditions**

   ```typescript
   it('should handle network errors gracefully', async () => {
     apiClient.post.mockRejectedValue(new Error('Network error'));

     const result = await gateway.processPayment('pi_test', paymentMethod);

     expect(result.success).toBe(false);
     expect(result.error).toContain('Network error');
   });
   ```

3. **Use test utilities**
   ```typescript
   // test-utils.ts
   export function createMockPaymentConfig(
     overrides?: Partial<PaymentConfig>
   ): PaymentConfig {
     return {
       amount: 1000,
       currency: 'usd',
       orderId: 'test_order',
       ...overrides,
     };
   }
   ```

### Coverage Requirements

- **Statements**: 90% minimum
- **Branches**: 85% minimum
- **Functions**: 90% minimum
- **Lines**: 90% minimum

```bash
# Check coverage
npm run test:coverage

# Generate HTML coverage report
npm run test:coverage:html
```

## Documentation

### Code Documentation

1. **Document all public APIs**

   ````typescript
   /**
    * Initializes a new payment session with the provided configuration.
    *
    * @param config - Payment configuration including amount, currency, and order details
    * @returns Promise that resolves to payment result with client secret
    * @throws PaymentError when configuration is invalid or payment creation fails
    *
    * @example
    * ```typescript
    * const result = await gateway.initializePayment({
    *   amount: 1000,
    *   currency: 'usd',
    *   orderId: 'order_123'
    * });
    * ```
    */
   async initializePayment(config: PaymentConfig): Promise<PaymentResult> {
     // Implementation
   }
   ````

2. **Update README for new features**

   - Add examples for new functionality
   - Update API reference section
   - Include migration notes for breaking changes

3. **Write integration guides**
   - Step-by-step setup instructions
   - Common use case examples
   - Troubleshooting sections

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**

   ```bash
   npm test
   ```

2. **Check code formatting**

   ```bash
   npm run lint
   npm run format
   ```

3. **Update documentation**

   - README.md for user-facing changes
   - CHANGELOG.md for version history
   - Code comments for complex logic

4. **Test your changes**
   - Run examples to ensure they work
   - Test in different browsers
   - Verify TypeScript compilation

### Pull Request Template

```markdown
## Description

Brief description of the changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is well-commented
- [ ] Documentation updated
- [ ] No breaking changes without version bump
```

### Review Process

1. **Automated checks** must pass
2. **At least one maintainer** must approve
3. **All conversations** must be resolved
4. **Documentation** must be updated

### Merge Strategy

- Use **squash and merge** for feature branches
- Use **rebase and merge** for documentation updates
- Use **merge commit** for release branches

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Update version number**

   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG.md**

   - Move unreleased changes to new version section
   - Add release date
   - Include all notable changes

3. **Create release branch**

   ```bash
   git checkout -b release/v1.2.3
   ```

4. **Final testing**

   ```bash
   npm run test:all
   npm run build
   npm run examples:test
   ```

5. **Create GitHub release**

   - Tag the commit
   - Include changelog information
   - Attach build artifacts

6. **Publish to npm**
   ```bash
   npm publish
   ```

### Release Notes Template

```markdown
## [1.2.3] - 2024-01-20

### Added

- New split payment timeout configuration
- Enhanced error messages for failed payments

### Changed

- Improved TypeScript type definitions
- Updated React component props

### Fixed

- Memory leak in payment timer
- Edge case in amount validation

### Deprecated

- Old payment initialization method (use initializePayment instead)

### Security

- Updated dependencies to fix security vulnerabilities
```

## Community

### Getting Help

- **Documentation**: Check our comprehensive docs first
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: Join our community for discussions
- **Stack Overflow**: Tag questions with `vsplit-payment`

### Reporting Issues

When reporting issues, please include:

- **Environment details** (Node.js version, browser, OS)
- **Reproduction steps** with minimal code example
- **Expected vs actual behavior**
- **Error messages** and stack traces
- **Relevant configuration** (anonymized)

### Feature Requests

For feature requests, please include:

- **Use case description** and business justification
- **Proposed solution** or implementation approach
- **Alternative solutions** considered
- **Impact assessment** on existing functionality

Thank you for contributing to VSplit Payment Gateway! 🎉
