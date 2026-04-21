import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productsRoutes.js';
import cartRoutes from './routes/cart.js';
import addressRoutes from './routes/address.js';
import orderRoutes from './routes/order.js';
import path from "path";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// static files
app.use('/uploads', express.static(path.resolve("uploads")));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/order', orderRoutes);

// test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// DB connect
connectDB();

// ✅ IMPORTANT: PORT fix for deployment
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});