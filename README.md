# AI Studio - Next.js Frontend + Node.js Backend

This repo contains two folders:
- backend: Express + TypeScript + Prisma (runs on port 4000)
- frontend: Next.js App Router (runs on port 3000)

## Quick start (local)
1. Backend
   - cd backend
   - npm install
   - npx prisma generate
   - npx prisma migrate dev --name init
   - npm run dev
2. Frontend
   - cd frontend
   - npm install
   - npm run dev
3. Visit http://localhost:3000 and create an account, then go to Studio.


# AI Studio E2E Tests

This directory contains comprehensive End-to-End (E2E) tests for the AI Studio application using Playwright.

## 🧪 Test Coverage

### Authentication Flow
- ✅ Login page display and navigation
- ✅ Signup page display and navigation  
- ✅ User registration with validation
- ✅ User login with valid/invalid credentials
- ✅ Logout functionality
- ✅ Form validation (email format, password length)
- ✅ Error handling for authentication failures

### Studio Page - Image Generation
- ✅ Studio interface display
- ✅ Upload component functionality
- ✅ Style selection dropdown
- ✅ Prompt input validation
- ✅ Image generation process
- ✅ Generation abort functionality
- ✅ Result section display
- ✅ History section display

### Responsive Design
- ✅ Mobile device compatibility (375x667)
- ✅ Tablet device compatibility (768x1024)
- ✅ Desktop browser compatibility

### Error Handling
- ✅ Network error handling
- ✅ Server error handling
- ✅ Graceful error message display

### Accessibility
- ✅ Proper form labels and ARIA attributes
- ✅ Keyboard navigation support
- ✅ Button state management
- ✅ Screen reader compatibility

### User Experience
- ✅ Loading indicators and states
- ✅ Form clearing after operations
- ✅ Smooth user interactions
- ✅ Visual feedback for actions

## 🚀 Running Tests

### Prerequisites
Make sure both frontend and backend servers are running:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Tests in Different Modes
```bash
# Run with UI (interactive mode)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# Generate and view test report
npm run test:e2e:report
```

### Run Specific Test Suites
```bash
# Run only authentication tests
npx playwright test --grep "Authentication Flow"

# Run only studio tests
npx playwright test --grep "Studio Page"

# Run only mobile tests
npx playwright test --grep "Responsive Design"
```

## 📁 Test Structure

```
tests/
├── e2e.spec.ts          # Main E2E test file
├── README.md            # This file
└── fixtures/            # Test data and fixtures (if needed)
```

## 🔧 Configuration

The E2E tests are configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000` (frontend)
- **Backend URL**: `http://localhost:4000` (backend)
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5, iPhone 12
- **Auto-start Servers**: Both frontend and backend start automatically

## 📊 Test Data

Tests use the following test data:

```typescript
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  invalidEmail: 'invalid-email',
  shortPassword: '123',
  wrongPassword: 'wrongpassword'
};

const testImage = {
  prompt: 'A beautiful sunset over mountains',
  style: 'Classic'
};
```

## 🐛 Debugging

### View Test Results
```bash
npm run test:e2e:report
```

### Debug Specific Test
```bash
npx playwright test --debug --grep "test name"
```

### Screenshots and Videos
- Screenshots are automatically taken on test failures
- Videos are recorded for failed tests
- Traces are available for debugging

## 📝 Writing New Tests

1. Add new test cases to `e2e.spec.ts`
2. Follow the existing test structure and naming conventions
3. Use descriptive test names
4. Include proper assertions
5. Test both positive and negative scenarios
6. Consider accessibility and responsive design

## 🔍 Best Practices

- **Isolation**: Each test is independent and cleans up after itself
- **Reliability**: Tests wait for elements to be ready before interacting
- **Maintainability**: Use page object model for complex interactions
- **Performance**: Tests run in parallel when possible
- **Coverage**: Test all user journeys and edge cases

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 5000 are available
2. **Database issues**: Tests clean up data automatically
3. **Network timeouts**: Increase timeout in config if needed
4. **Browser issues**: Reinstall browsers with `npx playwright install`

### Getting Help

- Check Playwright documentation: https://playwright.dev/
- Review test output and screenshots
- Use debug mode to step through tests
- Check browser console for errors
