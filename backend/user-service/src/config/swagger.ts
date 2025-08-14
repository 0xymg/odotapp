import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'User Service API',
    version: '1.0.0',
    description: 'Authentication service for ODO Todo application. Handles user registration, login, and JWT token management.',
    contact: {
      name: 'API Support'
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Auto-generated unique identifier',
            example: 1,
          },
          uuid: {
            type: 'string',
            format: 'uuid',
            description: 'Unique UUID identifier',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          user_email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@example.com',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Account last update timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['user_email', 'user_pwd'],
        properties: {
          user_email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@example.com',
          },
          user_pwd: {
            type: 'string',
            minLength: 6,
            description: 'User password (minimum 6 characters)',
            example: 'password123',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['user_email', 'user_pwd'],
        properties: {
          user_email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@example.com',
          },
          user_pwd: {
            type: 'string',
            description: 'User password',
            example: 'password123',
          },
        },
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User registered successfully',
          },
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'JWT access token',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            type: 'object',
            properties: {
              uuid: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
              user_email: {
                type: 'string',
                format: 'email',
                example: 'user@example.com',
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Invalid credentials',
          },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'OK',
          },
          service: {
            type: 'string',
            example: 'User Service',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00.000Z',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/index.ts'], // paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;