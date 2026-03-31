import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
import connectDB from './db/dbConnect.js';

dotenv.config();



const app = express();
const PORT = process.env.PORT || 3000;

const isDevelopment = process.env.NODE_ENV !== 'production';

const api = isDevelopment ? [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001"
] : [
    "https://primetradeai.com",
];

app.use(cors({
    origin: isDevelopment ? true : api,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get("/", (req, res) => {
    res.send("API is running...")
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