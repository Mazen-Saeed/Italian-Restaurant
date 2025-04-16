const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

const services = {
  auth: process.env.AUTH_SERVICE_URL,
};

Object.entries(services).forEach(([path, target]) => {
  console.log(`I'm here with ${path} and ${target}`);
  router.use(
    `/${path}`,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^/${path}`]: "",
      },
    })
  );
});

module.exports = router;
