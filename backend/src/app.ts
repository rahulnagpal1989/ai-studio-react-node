import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import authRoutes from './routes/auth';
import generationsRoutes from './routes/generations';

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use('/auth', authRoutes);
app.use('/generations', generationsRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

export default app;
