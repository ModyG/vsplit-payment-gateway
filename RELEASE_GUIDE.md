# Release Guide

## Quick Release Commands

### One-Step Releases

```bash
# Patch release (1.0.1 → 1.0.2) - for bug fixes
npm run release:patch

# Minor release (1.0.1 → 1.1.0) - for new features
npm run release:minor

# Major release (1.0.1 → 2.0.0) - for breaking changes
npm run release:major
```

### What These Commands Do

Each release command automatically:

1. **Pre-release checks:**

   - ✅ Runs ESLint for code quality
   - ✅ Runs Jest tests to ensure functionality
   - ✅ Builds the package (TypeScript compilation + CSS)

2. **Version management:**

   - ✅ Updates version in package.json
   - ✅ Creates a git commit with the version bump
   - ✅ Creates a git tag (e.g., v1.0.2)

3. **Publishing:**

   - ✅ Pushes code to GitHub
   - ✅ Pushes tags to GitHub
   - ✅ Publishes to NPM registry

4. **Verification:**
   - ✅ Test installation from NPM
   - ✅ Run TypeScript test suite

## Manual Release Process

If you prefer manual control:

```bash
# 1. Make your changes and commit them
git add .
git commit -m "Your feature description"

# 2. Run pre-release checks
npm run pre-release

# 3. Bump version (choose one)
npm version patch   # 1.0.1 → 1.0.2
npm version minor   # 1.0.1 → 1.1.0
npm version major   # 1.0.1 → 2.0.0

# 4. Publish everything
npm run post-release
```

## GitHub Actions (Automated CI/CD)

### Continuous Integration

- Runs on every push to main/develop
- Tests on Node.js 16, 18, 20
- Runs linting, tests, and builds

### Automated Publishing

- Triggers when you push a version tag (v*.*.\*)
- Automatically publishes to NPM
- Creates GitHub release

### Setting Up GitHub Actions

1. **Add NPM Token to GitHub Secrets:**

   ```bash
   # Get your NPM token
   npm token create

   # Add to GitHub:
   # Settings → Secrets and variables → Actions → New repository secret
   # Name: NPM_TOKEN
   # Value: your-npm-token
   ```

2. **Push with tags to trigger release:**
   ```bash
   npm version patch
   git push --tags
   # GitHub Actions will handle the rest!
   ```

## Best Practices

### Semantic Versioning

- **Patch (1.0.1)**: Bug fixes, small improvements
- **Minor (1.1.0)**: New features, backward compatible
- **Major (2.0.0)**: Breaking changes

### Release Checklist

- [ ] Update CHANGELOG.md
- [ ] Update README.md if needed
- [ ] Run TypeScript tests locally
- [ ] Check all examples still work
- [ ] Verify documentation is up to date

### Testing Your Release

```bash
# Test the latest published version
npm run verify-release
```

## Troubleshooting

### Common Issues

1. **Git working directory not clean:**

   ```bash
   git status
   git add .
   git commit -m "Commit pending changes"
   ```

2. **NPM authentication error:**

   ```bash
   npm whoami  # Check if logged in
   npm login   # Login if needed
   ```

3. **Build errors:**
   ```bash
   npm run lint:fix  # Fix linting issues
   npm test         # Check test failures
   ```

### Rollback a Release

If something goes wrong:

```bash
# Unpublish from NPM (within 24 hours)
npm unpublish @vegaci_shared/vsplit-payment-gateway@1.0.2

# Remove git tag
git tag -d v1.0.2
git push origin :refs/tags/v1.0.2
```

## Release Notes Template

```markdown
## v1.0.2

### 🚀 Features

- Add new payment method support

### 🐛 Bug Fixes

- Fix TypeScript type definitions
- Resolve CSS styling issues

### 📚 Documentation

- Update API documentation
- Add new usage examples

### 🔧 Internal

- Improve test coverage
- Update dependencies
```
