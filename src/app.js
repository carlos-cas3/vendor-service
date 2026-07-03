require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");
const internalRoutes = require("./routes/internal.routes");
const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const swaggerDocument = yaml.load(
    fs.readFileSync(path.join(__dirname, "../docs/openapi.yaml"), "utf8"),
);

/** @type {import('express').Express} */
const app = express();

const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:5173",
        "http://localhost:3006",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

// Middlewares globales
app.use(helmet());
app.use(cors(corsOptions));

/**
 * Maneja preflight requests OPTIONS.
 */
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.json());

// API ROUTES
app.use("/api/vendors", routes);

// Internal routes (inter-service communication, x-service-secret)
app.use("/api", internalRoutes);

/**
 * Healthcheck - verifica que el servicio esté operativo.
 *
 * @name GET /health
 * @returns {{ status: string, service: string, timestamp: string }}
 */
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "vendor-service",
        timestamp: new Date().toISOString(),
    });
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Middleware global de manejo de errores.
 * Captura errores personalizados por su nombre (ValidationError -> 400, NotFoundError -> 404, ConflictError -> 409).
 */
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.statusCode || 500} - ${err.message}`);

    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
    }

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

    res.status(err.statusCode || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Error interno del servidor"
                : err.message,

        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
});

/**
 * Middleware para rutas no encontradas (404).
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    });
});

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`[Vendor Service] corriendo en puerto ${PORT}`);
    });
}

module.exports = app;
