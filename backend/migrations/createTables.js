require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function dropTables() {
  const client = await pool.connect();
  try {
    console.log("Dropping existing tables...");

    await client.query(`DROP TABLE IF EXISTS reviews CASCADE`);
    await client.query(`DROP TABLE IF EXISTS inquiries CASCADE`);
    await client.query(`DROP TABLE IF EXISTS reservations CASCADE`);
    await client.query(`DROP TABLE IF EXISTS order_items CASCADE`);
    await client.query(`DROP TABLE IF EXISTS orders CASCADE`);
    await client.query(`DROP TABLE IF EXISTS menu_items CASCADE`);
    await client.query(`DROP TABLE IF EXISTS tables CASCADE`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE`);

    console.log("All tables dropped successfully");
  } catch (err) {
    console.error("Error dropping tables:", err);
    throw err;
  } finally {
    client.release();
  }
}

async function createTables() {
  const client = await pool.connect();
  try {
    console.log("Creating tables...");

    // Create users table
    await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                address TEXT,
                phone VARCHAR(20),
                order_count INTEGER DEFAULT 0,
                points INTEGER DEFAULT 0,
                verified BOOLEAN DEFAULT false
            );
        `);

    // Create menu_items table
    await client.query(`
            CREATE TABLE IF NOT EXISTS menu_items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(50) NOT NULL,
                available BOOLEAN DEFAULT true
            );
        `);

    // Create tables table
    await client.query(`
            CREATE TABLE IF NOT EXISTS tables (
                id SERIAL PRIMARY KEY,
                number INTEGER UNIQUE NOT NULL,
                capacity INTEGER NOT NULL,
                available BOOLEAN DEFAULT true
            );
        `);

    // Create orders table
    await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) NOT NULL,
                total_price DECIMAL(10,2) NOT NULL
            );
        `);

    // Create order_items table
    await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id),
                menu_item_id INTEGER REFERENCES menu_items(id),
                quantity INTEGER NOT NULL,
                price DECIMAL(10,2) NOT NULL
            );
        `);

    // Create reservations table
    await client.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                table_id INTEGER REFERENCES tables(id),
                reservation_date TIMESTAMP NOT NULL,
                status VARCHAR(20) NOT NULL
            );
        `);

    // Create inquiries table
    await client.query(`
            CREATE TABLE IF NOT EXISTS inquiries (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                subject VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT 'pending'
            );
        `);

    // Create reviews table
    await client.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                menu_item_id INTEGER REFERENCES menu_items(id),
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    console.log("All tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

async function resetDatabase() {
  try {
    await dropTables();
    await createTables();
    console.log("Database reset completed successfully");
  } catch (err) {
    console.error("Error resetting database:", err);
    process.exit(1);
  }
}

resetDatabase();
