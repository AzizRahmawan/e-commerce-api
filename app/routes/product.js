import { Router } from "express";
import prisma from "../prisma.js";
import { authToken, authorizePermission } from "../middleware/auth.js";
import { Permission } from "../authorization.js";
import productService from "../service/product-service.js"

const routes = Router();
routes.use(authToken);

routes.get('/profile', async (req, res) => {
    try {
        const user = req.user;
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});
routes.get("/products", authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
    try {        
        const { search, page, } = req.query;
        const product = await productService.get(search, page);
        res.json(product);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

routes.get("/my-product", authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
    try {        
        const user_id = req.user.id;
        const product = await productService.getMyProduct(user_id);
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
        const seller = req.user;
        const product = await productService.addProduct(name, price, description, category_id, stock, seller);
        res.json({ message: 'Product added successfully', product});
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});

routes.put('/products/:id', authorizePermission(Permission.EDIT_PRODUCT), async(req, res) => {
    try {
        const id = Number(req.params.id);
        const updateData = req.body;
        const seller = req.user;
        const product = await productService.updateProduct(id, updateData, seller);
        res.json({ message: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routes.delete('/products/:id', authorizePermission(Permission.DELETE_PRODUCT), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const seller = req.user;
        const product = await productService.deleteProduct(id, seller);
        res.json({ message: 'Product deleted successfully', product });
    } catch (err) {
        res.json({ message: err.message });
    }
});

export default routes;