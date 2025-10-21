# GitHub Actions Workflows

This directory contains the CI/CD pipeline configuration for the AI Studio project.

## Workflows Overview

### 1. **CI Pipeline** (`ci.yml`)
**Triggers:** Push to main/develop, Pull Requests
**Purpose:** Comprehensive testing and validation

**Jobs:**
- **Test Matrix**: Runs on Node.js 18, 20, 21
  - ESLint & Prettier checks
  - Frontend unit tests with coverage
  - Backend unit tests with coverage
  - Code coverage reporting to Codecov
- **E2E Tests**: End-to-end testing with Playwright
- **Build**: Creates production builds
- **Security**: Vulnerability scanning with Trivy

### 2. **Dependencies & Security** (`dependencies.yml`)
**Triggers:** Weekly schedule (Mondays 2 AM), Manual dispatch
**Purpose:** Dependency management and security monitoring

**Features:**
- Outdated package detection
- Security audit with npm audit
- Dependency review on PRs
- Automated security reports

### 3. **Code Quality** (`code-quality.yml`)
**Triggers:** Pull Requests, Push to main/develop
**Purpose:** Code quality enforcement

**Checks:**
- ESLint with detailed JSON output
- Prettier formatting validation
- TypeScript type checking
- TODO/FIXME comment detection
- Console statement detection
- Bundle size analysis

### 4. **Release** (`release.yml`)
**Triggers:** Git tags (v*), Manual dispatch
**Purpose:** Automated release management

**Features:**
- Automated testing before release
- Changelog generation from git commits
- GitHub release creation
- Build artifact uploads
- Deployment notifications

## Workflow Status Badges

Add these to your README.md:

```markdown
![CI](https://github.com/yourusername/ai-studio-react-node/workflows/CI%20Pipeline/badge.svg)
![Code Quality](https://github.com/yourusername/ai-studio-react-node/workflows/Code%20Quality/badge.svg)
![Dependencies](https://github.com/yourusername/ai-studio-react-node/workflows/Dependencies%20%26%20Security/badge.svg)
```

## Local Development

### Running Tests Locally

```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run lint
npm run format:check
cd frontend && npm test
cd backend && npm test
npm run test:e2e
```

### Pre-commit Checks

```bash
# Fix linting and formatting issues
npm run fix

# Check everything before committing
npm run check
```

## Workflow Configuration

### Environment Variables

The workflows use these environment variables:
- `GITHUB_TOKEN`: Automatically provided by GitHub
- `NODE_VERSION`: Set to 20 for consistency

### Secrets (Optional)

For enhanced functionality, add these secrets in GitHub:
- `CODECOV_TOKEN`: For detailed coverage reporting
- `DEPLOY_TOKEN`: For automated deployments
- `SLACK_WEBHOOK`: For deployment notifications

### Matrix Strategy

The test job uses a matrix strategy to test against multiple Node.js versions:
- Node.js 18 (LTS)
- Node.js 20 (LTS)
- Node.js 21 (Current)

## Troubleshooting

### Common Issues

1. **Test Failures**: Check the Actions tab for detailed logs
2. **Coverage Issues**: Ensure all test files are properly configured
3. **Build Failures**: Verify all dependencies are installed correctly
4. **E2E Timeouts**: Check if servers are starting properly

### Debug Commands

```bash
# Debug E2E tests
npm run test:e2e:debug

# Run tests with verbose output
npm run test:e2e -- --reporter=line

# Check Playwright installation
npx playwright install --with-deps
```

## Customization

### Adding New Checks

1. Add the check to the appropriate workflow file
2. Update the local scripts in package.json
3. Test locally before pushing

### Modifying Triggers

Update the `on:` section in workflow files:
```yaml
on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Mondays
```

### Adding Notifications

Add notification steps to workflows:
```yaml
- name: Notify on Success
  if: success()
  run: |
    echo "✅ All checks passed!"
    
- name: Notify on Failure
  if: failure()
  run: |
    echo "❌ Some checks failed!"
```

## Best Practices

1. **Keep workflows fast**: Use caching and parallel jobs
2. **Fail fast**: Put quick checks first
3. **Clear naming**: Use descriptive job and step names
4. **Documentation**: Keep this README updated
5. **Testing**: Test workflow changes in feature branches
6. **Security**: Use minimal permissions and secrets
7. **Monitoring**: Set up notifications for failures

## Support

For issues with the CI/CD pipeline:
1. Check the Actions tab in GitHub
2. Review the workflow logs
3. Test locally with the same commands
4. Create an issue with detailed error information
