export const openApiV1 = {
    openapi: '3.0.3',
    info: {
        title: 'Affirmations API',
        version: '1.0.0',
        description: 'Simple API that returns random affirmations. '
            + 'Supports filtering by tag and language, plus random sampling for lists.'
    },
    servers: [
        { url: '/', description: 'Current server' }
    ],
    tags: [
        { name: 'affirmations', description: 'Affirmation retrieval endpoints' }
    ],
    paths: {
        '/v1/affirmation': {
            get: {
                tags: ['affirmations'],
                summary: 'Get one random affirmation',
                parameters: [
                    { name: 'tag', in: 'query', schema: { type: 'string' }, description: 'Filter by tag' },
                    { name: 'lang', in: 'query', schema: { type: 'string', default: 'en' }, description: 'Language code' }
                ],
                responses: {
                    '200': {
                        description: 'Affirmation',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Affirmation' }
                            }
                        }
                    }
                }
            }
        },
        '/v1/affirmations': {
            get: {
                tags: ['affirmations'],
                summary: 'Get a random list of affirmations',
                parameters: [
                    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 0, maximum: 100, default: 1 } },
                    { name: 'tag', in: 'query', schema: { type: 'string' }, description: 'Filter by tag' },
                    { name: 'lang', in: 'query', schema: { type: 'string', default: 'en' }, description: 'Language code' }
                ],
                responses: {
                    '200': {
                        description: 'List of affirmations',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Affirmation' } }
                            }
                        }
                    }
                }
            }
        },
        '/v1/affirmations/{id}': {
            get: {
                tags: ['affirmations'],
                summary: 'Get affirmation by id',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Affirmation',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Affirmation' }
                            }
                        }
                    },
                    '404': {
                        description: 'Not found'
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            Affirmation: {
                type: 'object',
                required: ['id', 'text'],
                properties: {
                    id: { type: 'string' },
                    text: { type: 'string' },
                    author: { type: 'string', nullable: true },
                    tags: { type: 'array', items: { type: 'string' } },
                    lang: { type: 'string', description: 'ISO code', default: 'en' }
                }
            }
        }
    }
} as const;
