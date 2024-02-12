import express from 'express';
import authRoutes from './app/routes/authentication.js';
import adminAuthRoutes from './app/routes/admin/authentication.js';
import productRoutes from './app/routes/product.js';
import cartRoutes from './app/routes/cart.js'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())
app.get('/', async (req, res) => {
    res.json({message: 'Ok'});
});
app.use('/admin', adminAuthRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);

export default app;