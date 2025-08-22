import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { config } from './config.js';
import sendRoutes from './routes/send.routes.js';
import movegisticsRoutes from './routes/movegistics.routes.js';
import checklistRoutes from './routes/checklist.routes.js';
import { initTemplates } from './templates/templateCache.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (config.cors.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  methods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PATCH', 'PUT']
};
app.use(cors(corsOptions));

app.use('/send', sendRoutes);
app.use('/Movegistics', movegisticsRoutes);
app.use('/Checklist', checklistRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: err?.message || 'Internal Server Error' });
});

await initTemplates();

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});


