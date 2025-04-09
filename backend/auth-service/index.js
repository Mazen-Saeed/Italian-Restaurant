const { Pool } = require("pg");

const pool = new Pool({
  host: "postgres",
  user: "mazen",
  password: "Maz22mezo@",
  database: "italiano_restaurant",
  port: 5432,
});

async function insertUser() {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to database");

    // Test inserting a user
    const testUser = {
      username: "test_user2", // Change username for each test to avoid unique constraint error
      email: "test2@example.com", // Change email for each test to avoid unique constraint error
      password: "hashedpassword123",
      role: "customer",
      address: "123 Test Street",
      phone: "1234567890",
    };

    const insertResult = await client.query(
      `INSERT INTO users 
        (username, email, password, role, address, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        testUser.username,
        testUser.email,
        testUser.password,
        testUser.role,
        testUser.address,
        testUser.phone,
      ]
    );
    console.log("Inserted user:", insertResult.rows[0]);

    // Verify by selecting the inserted user
    const selectResult = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [testUser.username]
    );
    console.log("Verified inserted user:", selectResult.rows[0]);

    client.release();
  } catch (err) {
    console.error("Database operation error:", err);
    if (err.code === "23505") {
      console.log("Error: Username or email already exists");
    }
  } finally {
    await pool.end();
  }
}

// Run the insert
insertUser();
