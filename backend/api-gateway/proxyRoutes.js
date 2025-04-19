// api-gateway/proxyRoutes.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

const services = {
  auth: process.env.AUTH_SERVICE_URL,
  email: process.env.EMAIL_SERVICE_URL,
};

// For each entry, mount a proxy at /api/<name>
Object.entries(services).forEach(([name, target]) => {
  router.use(
    `/api/${name}`,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      onError(err, req, res) {
        console.error(
          `[Proxy:${name}] ${req.method} ${req.originalUrl} → ${target} failed:`,
          err.message
        );
        res.status(502).json({ error: `${name} service unavailable` });
      },
    })
  );
});

module.exports = router;
