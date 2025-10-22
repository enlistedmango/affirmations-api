import app from './index.js';

(async () => {
    const one = await app.request('http://localhost/v1/affirmation');
    console.log('single status', one.status);
    console.log('single body', await one.text());

    const many = await app.request('http://localhost/v1/affirmations');
    const arr = await many.json();
    console.log('list status', many.status);
    console.log('list length', Array.isArray(arr) ? arr.length : 'not-array');
})();
