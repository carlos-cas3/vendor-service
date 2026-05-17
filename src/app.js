require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
    router: vendorRouter,
    directBranchRouter,
} = require("./routes/vendor.routes");

const app = express();
const helmet = require("helmet");
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(helmet()); // Seguridad básica con Helmet

// Rutas
app.use("/api/vendors", vendorRouter);
app.use("/api", directBranchRouter);

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "vendor-service",
        timestamp: new Date().toISOString(),
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.statusCode || 500} - ${err.message}`);
    
    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
    }

    // Errores operacionales conocidos
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (err.name === "NotFoundError") {
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }

    if (err.name === "ConflictError") {
        return res.status(409).json({
            success: false,
            message: err.message,
        });
    }

    // Error genérico
    res.status(err.statusCode || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Error interno del servidor"
                : err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});
// 404 handler — debe ir después del error handler
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
