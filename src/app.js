require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");

const app = express();

const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:5173",
        "http://localhost:3006",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

// Middlewares globales
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// API ROUTES
app.use("/api/vendors", routes);

// HEALTHCHECK
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "vendor-service",
        timestamp: new Date().toISOString(),
    });
});

// ERROR HANDLER
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

// 404
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
