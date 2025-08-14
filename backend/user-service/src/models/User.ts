import pool from '../config/database';
import { User, CreateUserRequest } from '../types/user';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export class UserModel {
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        user_email VARCHAR(255) UNIQUE NOT NULL,
        user_pwd VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.query(query);
  }

  static async seedTestUsers(): Promise<void> {
    try {
      // Check if test users already exist
      const testUser = await this.findByEmail('test@example.com');
      const adminUser = await this.findByEmail('admin@odotapp.com');

      // Create test user if doesn't exist
      if (!testUser) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const uuid = uuidv4();
        const query = `
          INSERT INTO users (uuid, user_email, user_pwd, role)
          VALUES ($1, $2, $3, $4)
        `;
        await pool.query(query, [uuid, 'test@example.com', hashedPassword, 'user']);
        console.log('Test user created: test@example.com');
      }

      // Create admin user if doesn't exist
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const uuid = uuidv4();
        const query = `
          INSERT INTO users (uuid, user_email, user_pwd, role)
          VALUES ($1, $2, $3, $4)
        `;
        await pool.query(query, [uuid, 'admin@odotapp.com', hashedPassword, 'admin']);
        console.log('Admin user created: admin@odotapp.com');
      }
    } catch (error) {
      console.error('Error seeding test users:', error);
    }
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

  static async findAll(): Promise<User[]> {
    const query = 'SELECT uuid, user_email, role, created_at, updated_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async deleteByUuid(uuid: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE uuid = $1';
    const result = await pool.query(query, [uuid]);
    return (result.rowCount || 0) > 0;
  }

  static async updateRole(uuid: string, role: string): Promise<User | null> {
    const query = `
      UPDATE users 
      SET role = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE uuid = $2 
      RETURNING uuid, user_email, role, created_at, updated_at
    `;
    const result = await pool.query(query, [role, uuid]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}