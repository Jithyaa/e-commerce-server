import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connect from './database/connect.js';
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()
const app=express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true,
}));
app.use(express.json());


const port = process.env.PORT || 5000

app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)

app.listen(port,()=>{
    connect();
    console.log(`Server is running on port ${port}`)
})
