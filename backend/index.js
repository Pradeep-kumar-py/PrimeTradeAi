import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import connectDB from './db/dbConnect.js';
import userRoutes from './routes/user.route.js';
import todoRoutes from './routes/todo.route.js';
import { AppError } from './utils/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const isDevelopment = process.env.NODE_ENV !== 'production';

const allowedOrigins = isDevelopment ? [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001"
] : [
    "https://primetradeai.com",
];

app.use(helmet());
app.use(cors({
    origin: isDevelopment ? true : allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "PrimeTradeAI API is running..." });
});

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/todos', todoRoutes);

app.use((req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    res.status(statusCode).json({
        success: false,
        status,
        message: err.message,
        ...(isDevelopment && { stack: err.stack })
    });
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`Error connecting to the database: ${error.message}`);
        process.exit(1);
    });