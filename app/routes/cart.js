import { Router } from "express";
import { authToken, authorizePermission } from "../middleware/auth.js";
import { Permission } from "../authorization.js";
import cartService from "../service/cart-service.js";

const routes = Router();
routes.use(authToken);

routes.get('/cart', authorizePermission(Permission.BROWSE_CART), async (req, res) => {
    try {
        const user_id = req.user.id;
        const userCart = await cartService.getUserCart(user_id);
        
        res.json({cart: userCart});
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

routes.post('/cart', authorizePermission(Permission.ADD_TO_CART), async (req, res) => {
    try {
        const user = req.user;
        const { productId, quantity } = req.body;
        const userCart = await cartService.addProductToCart(productId, quantity, user);
        
        res.json({message: "Successfully add to cart", cart: userCart});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

routes.put('/cart/:id', authorizePermission(Permission.ADD_TO_CART), async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const user = req.user;
        const quantity = req.body.quantity;
        const updateProductInCart = await cartService.updateProductInCart(productId, quantity, user);
        
        res.json({message: "Successfully update in cart", cart: updateProductInCart});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

routes.delete('/cart/:id', authorizePermission(Permission.REMOVE_FROM_CART), async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const user = req.user;
        const removeProductFromCart = await cartService.removeProductFromCart(productId, user);
        
        res.json({message: "Successfully remove from cart", cart: removeProductFromCart});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

routes.delete('/clear/cart', authorizePermission(Permission.REMOVE_FROM_CART), async (req, res) => {
    try {
        const user = req.user.id;
        const cart_id = Number(req.params.id);
        await cartService.clearCart(cart_id, user);
        
        res.json({message: "Successfully clear cart"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default routes;