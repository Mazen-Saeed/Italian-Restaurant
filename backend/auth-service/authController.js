const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const AppError = require("./utils/appError"); // Import AppError
const catchAsync = require("./utils/catchAsync"); // Import catchAsync
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { generateToken, verifyToken } = require("./utils/jwtTokens");

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

const sendConfirmationEmail = async (id, name, email) => {
  const token = generateToken(
    id,
    process.env.JWT_CONFIRM_SECRET,
    process.env.JWT_CONFIRM_EXPIRATION
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
    console.error("Error sending confirmation email:", err);
  }
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

  await sendConfirmationEmail(result.rows[0].id, name, email);
  res.status(201).json(result.rows[0]);
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new AppError("No token provided", 400));

  const decoded = verifyToken(token, process.env.JWT_CONFIRM_SECRET);
  if (!decoded) return next(new AppError("Invalid or expired token", 400));

  const user = await pool.query("SELECT * FROM users WHERE id = $1", [
    decoded.id,
  ]);

  if (user.rows.length === 0) return next(new AppError("User not found", 404));

  await pool.query("UPDATE users SET verified = true WHERE id = $1", [
    decoded.id,
  ]);

  res.status(200).json({ message: "Email confirmed successfully" });
});

exports.resendConfirmationEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Please provide an email", 400));
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0) return next(new AppError("User not found", 404));

  if (user.rows[0].verified)
    return next(new AppError("Email already verified", 400));

  await sendConfirmationEmail(user.rows[0].id, user.rows[0].name, email);
  res.status(200).json({
    status: "success",
    message: "Confirmation email resent successfully",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, rememberMe = false } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0)
    return next(new AppError("Invalid email or password", 401));

  if (!user.rows[0].verified) {
    sendConfirmationEmail(
      user.rows[0].id,
      user.rows[0].name,
      user.rows[0].email
    );
    return next(
      new AppError(
        "Email not verified, an email with a link to verify teh accound has been sent.",
        401
      )
    );
  }

  const passwordMatch = await checkPassword(password, user.rows[0].password);
  if (!passwordMatch)
    return next(new AppError("Invalid email or password", 401));

  const token = generateToken(
    user.rows[0].id,
    process.env.JWT_ACCESS_SECRET,
    process.env.JWT_ACCESS_EXPIRES
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    ...(rememberMe && {
      maxAge: parseInt(process.env.JWT_ACCESS_EXPIRES, 10) * 1000,
    }),
  };
  res.cookie("accessToken", token, cookieOptions);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {});

exports.forgetPassword = catchAsync(async (req, res, next) => {});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.protect = catchAsync(async (req, res, next) => {});
