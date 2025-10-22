import { handle } from 'hono/aws-lambda'
import app from '../../src/index'

// Netlify Functions (AWS Lambda under the hood)
// Exposes your Hono app at:
//   /.netlify/functions/api/*
// Example: /.netlify/functions/api/v1/affirmations
export const handler = handle(app)
