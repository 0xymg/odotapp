import { Router } from 'express';
import { TodoController } from '../controllers/todoController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get user's todos
 *     description: Retrieve all todos belonging to the authenticated user
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TodoResponse'
 *                 total:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.get('/', TodoController.getTodos);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Create a new todo item for the authenticated user
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodoRequest'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo created successfully"
 *                 todo:
 *                   $ref: '#/components/schemas/TodoResponse'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', TodoController.createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Update an existing todo item
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodoRequest'
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo updated successfully"
 *                 todo:
 *                   $ref: '#/components/schemas/TodoResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', TodoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Delete an existing todo item
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo UUID
 *     responses:
 *       204:
 *         description: Todo deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', TodoController.deleteTodo);

/**
 * @swagger
 * /api/todos/stats:
 *   get:
 *     summary: Get todo statistics
 *     description: Get statistics about user's todos (total, completed, pending)
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 10
 *                     completed:
 *                       type: integer
 *                       example: 7
 *                     pending:
 *                       type: integer
 *                       example: 3
 *                     completion_rate:
 *                       type: integer
 *                       example: 70
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/stats', TodoController.getStats);

export default router;