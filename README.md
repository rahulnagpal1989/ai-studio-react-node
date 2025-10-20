# Modelia AI Studio - Next.js Frontend + Node.js Backend

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
