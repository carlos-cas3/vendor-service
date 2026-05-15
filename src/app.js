require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { router: vendorRouter, directBranchRouter } = require('./routes/vendor.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/vendors', vendorRouter);
app.use('/api', directBranchRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'vendor-service', timestamp: new Date().toISOString() });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Error interno del servidor';

  console.error(`[ERROR] ${statusCode} - ${err.message}`);
  if (!err.isOperational) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
  });
});

app.listen(PORT, () => {
  console.log(`[Vendor Service] corriendo en puerto ${PORT}`);
});

module.exports = app;
