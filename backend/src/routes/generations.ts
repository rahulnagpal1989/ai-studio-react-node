import { Router } from 'express';
import { createGeneration, listGenerations } from '../controllers/generationsController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
router.post('/', authMiddleware, createGeneration);
router.get('/', authMiddleware, listGenerations);

export default router;
