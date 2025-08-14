import pool from '../config/database';
import { User, CreateUserRequest } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        user_email VARCHAR(255) UNIQUE NOT NULL,
        user_pwd VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.query(query);
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE user_email = $1';
    const result = await pool.query(query, [email]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async findByUuid(uuid: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE uuid = $1';
    const result = await pool.query(query, [uuid]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async create(userData: CreateUserRequest): Promise<User> {
    const uuid = uuidv4();
    const query = `
      INSERT INTO users (uuid, user_email, user_pwd)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [uuid, userData.user_email, userData.user_pwd]);
    return result.rows[0];
  }

  static async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}