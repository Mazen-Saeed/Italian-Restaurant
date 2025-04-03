const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "your_secret_key";
