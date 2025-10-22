import { serve } from '@hono/node-server';
import app from './index.js';

const port = Number(process.env.PORT) || 8787;

const server = serve({ fetch: app.fetch, port }, (info: { port: number }) => {
    console.log(`Affirmations API listening on http://localhost:${info.port}`);
});

process.on('SIGINT', () => server.close());
process.on('SIGTERM', () => server.close());
