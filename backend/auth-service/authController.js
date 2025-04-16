const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const AppError = require("./utils/appError"); // Import AppError
const catchAsync = require("./utils/catchAsync"); // Import catchAsync
const { add } = require("winston");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const register = catchAsync(async (req, res, next) => {
  const { name, username, email, password, passwordConfirm, address, phone } =
    req.body;

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0)
    return next(new AppError("User already exists", 400));

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    "INSERT INTO users (name, username, email, password, role, address, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [name, username, email, hashedPassword, "user", address, phone]
  );

  res.status(201).json(result.rows[0]);
});

const confirmEmail = catchAsync(async (req, res, next) => {});

const sendConfirmationMail = catchAsync(async (req, res, next) => {});

const login = catchAsync(async (req, res, next) => {});

const logout = catchAsync(async (req, res, next) => {});

const forgetPassword = catchAsync(async (req, res, next) => {});

const resetPassword = catchAsync(async (req, res, next) => {});

module.exports = { register };
