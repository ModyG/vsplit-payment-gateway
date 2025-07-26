# VSplit Payment Gateway - NPM Publishing & Testing Guide

## 📦 Step 1: Prepare for NPM Publishing

### 1.1 Create NPM Account (if you don't have one)

1. Go to [npmjs.com](https://www.npmjs.com/)
2. Click "Sign Up" and create an account
3. Verify your email address

### 1.2 Login to NPM CLI

```bash
npm login
```

- Enter your NPM username
- Enter your NPM password
- Enter your email address
- Complete 2FA if enabled

### 1.3 Verify Login

```bash
npm whoami
```

This should display your NPM username.

## 🔍 Step 2: Pre-Publishing Checks

### 2.1 Check Package Name Availability

```bash
npm view @vsplit/payment-gateway
```

If this returns "npm ERR! 404", the name is available.

### 2.2 Verify Package Configuration

Check that your `package.json` has:

- ✅ Correct `name`: `@vsplit/payment-gateway`
- ✅ Valid `version`: `1.0.0`
- ✅ Proper `main`: `dist/index.js`
- ✅ Proper `types`: `dist/index.d.ts`
- ✅ `files` array including `dist/**/*`

### 2.3 Run Final Build & Tests

```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build
npm test
npm run lint
```

### 2.4 Test Package Locally

```bash
# Create a tarball to test
npm pack
```

This creates a `.tgz` file you can test locally.

## 📤 Step 3: Publish to NPM

### 3.1 Dry Run (Test Publish)

```bash
npm publish --dry-run
```

This shows what would be published without actually publishing.

### 3.2 Publish (First Time)

```bash
npm publish --access public
```

Note: `--access public` is required for scoped packages (@vsplit/...)

### 3.3 Verify Publication

```bash
npm view @vsplit/payment-gateway
```

This should show your published package information.

## 🧪 Step 4: Testing Your Published Package

### 4.1 Create a Test Project

```bash
# Navigate to a different directory
cd /c/temp
mkdir vsplit-test
cd vsplit-test
npm init -y
```

### 4.2 Install Your Package

```bash
npm install @vsplit/payment-gateway
```

### 4.3 Test Basic Import

Create `test-basic.js`:

```javascript
const { VSplitPaymentGateway } = require('@vsplit/payment-gateway');

console.log(
  'VSplitPaymentGateway imported successfully:',
  typeof VSplitPaymentGateway
);

// Test basic initialization
try {
  const gateway = new VSplitPaymentGateway({
    baseUrl: 'https://api.example.com',
    stripePublishableKey: 'pk_test_123',
  });
  console.log('Gateway created successfully');
} catch (error) {
  console.error('Error creating gateway:', error.message);
}
```

Run: `node test-basic.js`

### 4.4 Test TypeScript Import

Create `test-typescript.ts`:

```typescript
import { VSplitPaymentGateway, VSplitConfig } from '@vsplit/payment-gateway';

const config: VSplitConfig = {
  baseUrl: 'https://api.example.com',
  stripePublishableKey: 'pk_test_123',
};

const gateway = new VSplitPaymentGateway(config);
console.log('TypeScript import successful');
```

### 4.5 Test React Components

Create a simple React test:

```typescript
import React from 'react';
import { VSplitProvider, useVSplit } from '@vsplit/payment-gateway/react';

function TestComponent() {
  const { gateway, initialized } = useVSplit();
  return <div>Gateway initialized: {String(initialized)}</div>;
}

function App() {
  return (
    <VSplitProvider
      config={{
        baseUrl: 'https://api.example.com',
        stripePublishableKey: 'pk_test_123',
      }}
    >
      <TestComponent />
    </VSplitProvider>
  );
}
```

## 🔄 Step 5: Version Management

### 5.1 Update Package Version

For future updates:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### 5.2 Publish Updates

```bash
npm publish
```

## 🛠 Step 6: Advanced Testing

### 6.1 Test with Different Node Versions

Use nvm to test compatibility:

```bash
nvm use 16
npm install @vsplit/payment-gateway
node test-basic.js

nvm use 18
npm install @vsplit/payment-gateway
node test-basic.js
```

### 6.2 Test Bundle Size

```bash
npm install -g bundlephobia
bundlephobia @vsplit/payment-gateway
```

### 6.3 Test in Different Environments

1. **Next.js App**: Create a Next.js app and test integration
2. **React App**: Create a React app with Create React App
3. **Node.js Backend**: Test in a Node.js server environment

## 📊 Step 7: Monitor Your Package

### 7.1 NPM Package Statistics

- Visit: https://www.npmjs.com/package/@vsplit/payment-gateway
- Monitor downloads, versions, and dependents

### 7.2 Set up Package Health Monitoring

```bash
# Check for vulnerabilities
npm audit

# Check for outdated dependencies
npm outdated
```

## 🔧 Step 8: Common Issues & Solutions

### Issue 1: "Package name already exists"

**Solution**: Change the package name in `package.json`

```json
{
  "name": "@your-username/payment-gateway"
}
```

### Issue 2: "403 Forbidden"

**Solutions**:

- Make sure you're logged in: `npm whoami`
- For scoped packages, use: `npm publish --access public`
- Check if you have permission to publish to the scope

### Issue 3: "Version already exists"

**Solution**: Update version number

```bash
npm version patch
npm publish
```

### Issue 4: Missing dependencies in published package

**Solution**: Check `files` array in `package.json` and ensure all necessary files are included

## 🚀 Step 9: Best Practices

### 9.1 Pre-publish Checklist

- [ ] All tests pass
- [ ] Code is linted
- [ ] Version number is correct
- [ ] README is up to date
- [ ] CHANGELOG is updated
- [ ] License file exists

### 9.2 Continuous Integration

Set up GitHub Actions for automated testing and publishing:

```yaml
# .github/workflows/publish.yml
name: Publish to NPM
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📋 Step 10: Documentation

### 10.1 Update README with Installation Instructions

Add to your README:

````markdown
## Installation

```bash
npm install @vsplit/payment-gateway
```
````

## Quick Start

```typescript
import { VSplitPaymentGateway } from '@vsplit/payment-gateway';

const gateway = new VSplitPaymentGateway({
  baseUrl: 'https://your-api.com',
  stripePublishableKey: 'pk_your_key',
});
```

```

### 10.2 Create Usage Examples
Provide clear examples for:
- Basic payment processing
- Split payments
- React integration
- Error handling

This guide covers everything you need to successfully publish and test your VSplit Payment Gateway package! 🎉
```
