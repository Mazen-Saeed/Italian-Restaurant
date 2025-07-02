const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const { Pool } = require("pg");
const { verifyToken } = require("./utils/jwtTokens");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// will be edited to use caching before querying the database
const getUserFromId = async function (id) {
  console.log("Fetching user with ID:", id);
  const query = "SELECT * FROM users WHERE id = $1";
  const values = [id];
  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      console.log("User found:", result.rows[0]);
      return null;
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching user:", err);
    throw new AppError("Database query failed", 500);
  }
};

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.accessToken;
  let decoded;
  console.log("Token received:", token);
  console.log("Verifying token...");
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return next(new AppError("Invalid token", 401));
  }
  console.log("Decoded token:", decoded);
  const user = await getUserFromId(decoded.id);
  console.log(user);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.verified) {
    return next(new AppError("User not verified", 403));
  }

  if (user.role !== "user")
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );

  req.user = user;
  console.log("User authenticated:", user.id);
  next();
});

exports.getMyData = catchAsync(async (req, res, next) => {
  const user = req.user;
  console.log("Fetching data for user:", user.id);
  res.status(200).json({
    status: "success",
    data: {
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        dateofbirth: user.dateofbirth,
        points: user.points,
      },
    },
  });
});

exports.getMyPoints = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: "success",
    data: {
      points: user.points,
    },
  });
});

exports.addAddressToUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  console.log("Adding address for user:", user.id);
  const {
    street,
    building_number,
    apartment_number,
    city,
    country,
    label,
    state,
    postal_code,
    latitude,
    longitude,
    is_default,
  } = req.body;

  if (!street || !city || !country)
    return next(new AppError("Street, city, and country are required", 400));

  const query = `
    INSERT INTO user_addresses (
      user_id, label, street, building_number, apartment_number,
      city, state, postal_code, country, latitude, longitude, is_default
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;
  const values = [
    user.id,
    label || null,
    street,
    building_number || null,
    apartment_number || null,
    city,
    state || null,
    postal_code || null,
    country,
    latitude || null,
    longitude || null,
    is_default || false,
  ];

  const result = await pool.query(query, values);
  if (result.rows.length === 0) {
    return next(new AppError("Failed to add address", 500));
  }
  const newAddress = result.rows[0];
  res.status(201).json({
    status: "success",
    data: {
      address: newAddress,
    },
  });
});

// to do
/*
change password
change phone number

get addresses
delete address

delete account
*/
