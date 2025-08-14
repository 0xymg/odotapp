import pool from '../config/database';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { v4 as uuidv4 } from 'uuid';

export class TodoModel {
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        user_uuid VARCHAR(36) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.query(query);
    
    // Create index for user_uuid for better query performance
    const indexQuery = `
      CREATE INDEX IF NOT EXISTS idx_todos_user_uuid ON todos(user_uuid)
    `;
    await pool.query(indexQuery);
  }

  static async findByUserUuid(userUuid: string): Promise<Todo[]> {
    const query = 'SELECT * FROM todos WHERE user_uuid = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userUuid]);
    return result.rows;
  }

  static async findByUuid(uuid: string): Promise<Todo | null> {
    const query = 'SELECT * FROM todos WHERE uuid = $1';
    const result = await pool.query(query, [uuid]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async findByUuidAndUser(uuid: string, userUuid: string): Promise<Todo | null> {
    const query = 'SELECT * FROM todos WHERE uuid = $1 AND user_uuid = $2';
    const result = await pool.query(query, [uuid, userUuid]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async create(todoData: CreateTodoRequest, userUuid: string): Promise<Todo> {
    const uuid = uuidv4();
    const query = `
      INSERT INTO todos (uuid, content, user_uuid, completed)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [uuid, todoData.content, userUuid, false]);
    return result.rows[0];
  }

  static async update(uuid: string, userUuid: string, updateData: UpdateTodoRequest): Promise<Todo | null> {
    const setParts: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updateData.content !== undefined) {
      setParts.push(`content = $${paramCount}`);
      values.push(updateData.content);
      paramCount++;
    }

    if (updateData.completed !== undefined) {
      setParts.push(`completed = $${paramCount}`);
      values.push(updateData.completed);
      paramCount++;
    }

    if (setParts.length === 0) {
      return null;
    }

    setParts.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(uuid, userUuid);

    const query = `
      UPDATE todos 
      SET ${setParts.join(', ')}
      WHERE uuid = $${paramCount} AND user_uuid = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async delete(uuid: string, userUuid: string): Promise<boolean> {
    const query = 'DELETE FROM todos WHERE uuid = $1 AND user_uuid = $2';
    const result = await pool.query(query, [uuid, userUuid]);
    return (result.rowCount ?? 0) > 0;
  }

  static async count(userUuid: string): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM todos WHERE user_uuid = $1';
    const result = await pool.query(query, [userUuid]);
    return parseInt(result.rows[0].count);
  }

  static async countCompleted(userUuid: string): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM todos WHERE user_uuid = $1 AND completed = true';
    const result = await pool.query(query, [userUuid]);
    return parseInt(result.rows[0].count);
  }
}