import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Todo Service API',
    version: '1.0.0',
    description: 'Todo management service for ODO Todo application. Handles CRUD operations for user todos with JWT authentication.',
    contact: {
      name: 'API Support'
    },
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token received from User Service login',
      },
    },
    schemas: {
      Todo: {
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
          content: {
            type: 'string',
            description: 'Todo content/description',
            example: 'Buy groceries',
          },
          user_uuid: {
            type: 'string',
            format: 'uuid',
            description: 'UUID of the user who owns this todo',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          completed: {
            type: 'boolean',
            description: 'Whether the todo is completed',
            example: false,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Todo creation timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Todo last update timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
        },
      },
      TodoResponse: {
        type: 'object',
        properties: {
          uuid: {
            type: 'string',
            format: 'uuid',
            description: 'Unique UUID identifier',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          content: {
            type: 'string',
            description: 'Todo content/description',
            example: 'Buy groceries',
          },
          completed: {
            type: 'boolean',
            description: 'Whether the todo is completed',
            example: false,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Todo creation timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Todo last update timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
        },
      },
      CreateTodoRequest: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
            description: 'Todo content/description (1-500 characters)',
            example: 'Buy groceries',
          },
        },
      },
      UpdateTodoRequest: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
            description: 'Updated todo content/description (1-500 characters)',
            example: 'Buy groceries and cook dinner',
          },
          completed: {
            type: 'boolean',
            description: 'Updated completion status',
            example: true,
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Todo not found',
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
            example: 'Todo Service',
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