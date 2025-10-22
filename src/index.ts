import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { AFFIRMATIONS, Affirmation } from './data.js';
import { prettyJSON } from 'hono/pretty-json';

const app = new Hono();

app.use('*', cors());
app.use('*', prettyJSON({ space: 2 }));

const sample = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const sampleMany = <T,>(arr: T[], n: number) => {
    const copy = arr.slice();
    const out: T[] = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        out.push(copy.splice(idx, 1)[0]);
    }
    return out;
};

app.get('/v1/affirmation', (c) => {
    const tag = c.req.query('tag');
    const lang = c.req.query('lang');
    let pool = AFFIRMATIONS;

    if (lang) pool = pool.filter(a => (a.lang ?? 'en') === lang);
    if (tag) pool = pool.filter(a => (a.tags ?? []).includes(tag));

    const picked = pool.length ? sample(pool) : sample(AFFIRMATIONS);

    c.header('Cache-Control', 'no-store');
    return c.json(picked);
});

app.get('/', (c) => {
    c.header('Cache-Control', 'no-store');
    return c.json({
        name: 'affirmations-api',
        version: 'v1',
        endpoints: ['/v1/affirmation', '/v1/affirmations', '/v1/affirmations/:id']
    });
});

app.get('/v1/affirmations', (c) => {
    const limit = Math.min(Math.max(parseInt(c.req.query('limit') ?? '1', 10) || 1, 0), 100);
    const tag = c.req.query('tag');
    const lang = c.req.query('lang');

    let list: Affirmation[] = AFFIRMATIONS;
    if (lang) list = list.filter(a => (a.lang ?? 'en') === lang);
    if (tag) list = list.filter(a => (a.tags ?? []).includes(tag));

    const result = limit > 0 ? sampleMany(list.length ? list : AFFIRMATIONS, limit) : [];

    c.header('Cache-Control', 'public, max-age=300');
    return c.json(result, 200);
});

app.get('/v1/affirmations/:id', (c) => {
    const found = AFFIRMATIONS.find(a => a.id === c.req.param('id'));
    if (found) {
        c.header('Cache-Control', 'public, max-age=86400');
        return c.json(found, 200);
    }
    return c.json({ error: 'Not found' }, 404);
});

export default app;