import express from 'express';
import adminAuthRoutes from './app/routes/admin/authentication.js';
import adminProductRoutes from './app/routes/admin/product.js';
import adminCartRoutes from './app/routes/admin/cart.js';
import adminUserRoutes from './app/routes/admin/user.js';
import adminOrderRoutes from './app/routes/admin/order.js';
import authRoutes from './app/routes/authentication.js';
import productRoutes from './app/routes/product.js';
import cartRoutes from './app/routes/cart.js'
import orderRoutes from './app/routes/order.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())
app.get('/', async (req, res) => {
    res.json({message: 'Ok'});
});
app.use('/admin', adminAuthRoutes);
app.use('/admin', adminProductRoutes);
app.use('/admin', adminCartRoutes);
app.use('/admin', adminUserRoutes);
app.use('/admin', adminOrderRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

export default app;