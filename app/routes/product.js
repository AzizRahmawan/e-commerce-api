import { Router } from "express";
import prisma from "../prisma.js";
import { authToken, authorizePermission } from "../middleware/middleware.js";
import { Permission } from "../authorization.js";
import productService from "../service/product-service.js"

const routes = Router();
routes.use(authToken);

routes.get("/products", authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
    try {        
        const product = await productService.get();
        res.json(product);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

routes.get('/products/:id', authorizePermission(Permission.READ_PRODUCT), async (req, res) => {
    try {
        const product = await productService.getById(Number(req.params.id));
        res.json(product);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

routes.post('/products', authorizePermission(Permission.ADD_PRODUCT), async(req, res) => {
    try {
        const { name, price, description, category_id, stock } = req.body;
        const seller_id = req.user.id;
        console.log(seller_id);
        const product = await productService.addProduct(name, price, description, category_id, stock, seller_id);
        console.log(product);
        res.json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default routes;