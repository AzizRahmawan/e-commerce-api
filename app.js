import express from 'express';
import productRoutes from './app/routes/product.js';
import authRoutes from './app/routes/authentication.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())
app.get('/', async (req, res) => {
    res.json({message: 'Ok'});
});
app.use(authRoutes);
app.use(productRoutes);

export default app;