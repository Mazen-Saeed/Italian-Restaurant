const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const AppError = require("./utils/appError"); // Import AppError
const catchAsync = require("./utils/catchAsync"); // Import catchAsync
const jwt = require("jsonwebtoken");
const axios = require("axios");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const checkPassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

exports.register = catchAsync(async (req, res, next) => {
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

  const token = jwt.sign(
    { id: result.rows[0].id },
    process.env.JWT_CONFIRM_SECRET,
    {
      expiresIn: process.env.JWT_CONFIRM_EXPIRATION,
    }
  );

  try {
    await axios.post(
      `${process.env.EMAIL_SERVICE_URL}/api/email/sendEmail`,
      {
        toName: name,
        toEmail: email,
        token,
        func: "confirmEmail",
        containerName: process.env.CONTAINER_NAME,
      },
      { timeout: 5000 }
    );
  } catch (err) {
    console.error("Failed to send confirmation email:", err.message);
  }

  res.status(201).json(result.rows[0]);
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new AppError("No token provided", 400));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_CONFIRM_SECRET);
  } catch (err) {
    return next(new AppError("Invalid token", 400));
  }

  const user = await pool.query("SELECT * FROM users WHERE id = $1", [
    decoded.id,
  ]);

  if (user.rows.length === 0) return next(new AppError("User not found", 404));

  await pool.query("UPDATE users SET verified = true WHERE id = $1", [
    decoded.id,
  ]);

  res.status(200).json({ message: "Email confirmed successfully" });
});

exports.resendConfirmationMail = catchAsync(async (req, res, next) => {});

exports.login = catchAsync(async (req, res, next) => {});

exports.logout = catchAsync(async (req, res, next) => {});

exports.forgetPassword = catchAsync(async (req, res, next) => {});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.protecte = catchAsync(async (req, res, next) => {});
