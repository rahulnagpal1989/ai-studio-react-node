# AI Studio - Next.js Frontend + Node.js Backend

A full-stack AI image generation application with user authentication, image upload, and generation capabilities.

## 🏗️ Architecture

This repo contains two main components:
- **backend**: Express + TypeScript + Prisma + SQLite (runs on port 4000)
- **frontend**: Next.js App Router + React + TypeScript (runs on port 3000)

## 📋 Prerequisites

- Node.js 18+ 
- npm 8+
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-studio-react-node
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Environment Variables
Create `.env` files if needed:

**Backend** (`backend/.env`):
```env
JWT_SECRET=your_jwt_secret_here
DATABASE_URL="file:./dev.db"
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 🧪 Testing

### Unit Tests

**Backend Tests:**
```bash
cd backend
npm test
npm test -- --coverage
```

**Frontend Tests:**
```bash
cd frontend
npm test
npm test -- --coverage
```

### E2E Tests

**Prerequisites:**
Make sure both servers are running (see Quick Start steps 5)

**Run E2E Tests:**
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# Generate and view test report
npm run test:e2e:report
```

**Run Specific Test Suites:**
```bash
# Run only authentication tests
npx playwright test --grep "Authentication Flow"

# Run only studio tests
npx playwright test --grep "Studio Page"

# Run only mobile tests
npx playwright test --grep "Responsive Design"
```

### All Tests
```bash
# Run all tests (unit + E2E)
npm run test:all
```

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format

# Run all checks
npm run check
```

### Build for Production
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## 📁 Project Structure

```
ai-studio-react-node/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── server.ts        # Server entry point
│   ├── tests/               # Backend unit tests
│   └── prisma/              # Database schema
├── frontend/                # Next.js frontend
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   └── studio/          # Studio page
│   └── tests/               # Frontend unit tests
├── tests/                   # E2E tests
├── .github/workflows/       # CI/CD pipelines
└── README.md
```

## 🎯 Features

### Authentication
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Form validation

### Image Generation
- Image upload with preview
- Style selection (Classic, Avant-garde, Street)
- Prompt-based generation
- Request abort functionality
- Exponential retry logic
- Generation history

### User Experience
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Accessibility features
- Smooth animations and transitions

## 🚀 Deployment

### Environment Setup
1. Set up production environment variables
2. Configure database (SQLite or PostgreSQL)
3. Set up reverse proxy (nginx)
4. Configure SSL certificates

### Build and Deploy
```bash
# Build both applications
npm run build

# Start production servers
cd backend && npm start
cd frontend && npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 4000 are available
2. **Database issues**: Run `npx prisma migrate dev` to reset database
3. **Dependencies**: Delete `node_modules` and run `npm install`
4. **E2E tests failing**: Ensure both servers are running
5. **Build errors**: Check TypeScript errors with `npx tsc --noEmit`

### Debug Commands
```bash
# Debug E2E tests
npm run test:e2e:debug

# Check TypeScript errors
cd frontend && npx tsc --noEmit
cd backend && npx tsc --noEmit

# Check database
cd backend && npx prisma studio
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Generation Endpoints
- `POST /generations` - Create image generation
- `GET /generations?limit=5` - Get user's generation history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:all`
5. Run linting: `npm run check`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🚀 CI/CD Pipeline

This project includes a comprehensive GitHub Actions CI/CD pipeline with:

### **Automated Testing**
- ✅ **Unit Tests**: Frontend (Jest + React Testing Library) & Backend (Jest + Supertest)
- ✅ **E2E Tests**: Playwright cross-browser testing
- ✅ **Code Quality**: ESLint, Prettier, TypeScript checks
- ✅ **Security**: Vulnerability scanning with Trivy
- ✅ **Coverage**: Code coverage reporting with Codecov

### **Workflows**
- **CI Pipeline**: Runs on every push/PR with Node.js 18, 20, 21
- **Code Quality**: Enforces coding standards and best practices
- **Dependencies**: Weekly security audits and dependency updates
- **Release**: Automated releases with changelog generation

### **Status Badges**
```markdown
![CI](https://github.com/yourusername/ai-studio-react-node/workflows/CI%20Pipeline/badge.svg)
![Code Quality](https://github.com/yourusername/ai-studio-react-node/workflows/Code%20Quality/badge.svg)
![Dependencies](https://github.com/yourusername/ai-studio-react-node/workflows/Dependencies%20%26%20Security/badge.svg)
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 5000 are available
2. **Database issues**: Tests clean up data automatically
3. **Network timeouts**: Increase timeout in config if needed
4. **Browser issues**: Reinstall browsers with `npx playwright install`
5. **CI failures**: Check GitHub Actions tab for detailed logs

### Getting Help

- Check Playwright documentation: https://playwright.dev/
- Review test output and screenshots
- Use debug mode to step through tests
- Check browser console for errors
- Review CI/CD workflow documentation in `.github/workflows/README.md`
