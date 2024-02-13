import { Router } from "express";
import { authAdminToken, authorizePermission } from "../../middleware/auth.js";
import { Permission } from "../../authorization.js";
import cartService from "../../service/cart-service.js";
import userService from "../../service/user-service.js";

const routes = Router();
routes.use(authAdminToken);

routes.get('/cart', authorizePermission(Permission.BROWSE_CART), async(req, res) =>{
    try {
        const cart = await cartService.getCart();
        res.json(cart);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

routes.get('/cart/:id', authorizePermission(Permission.BROWSE_CART), async(req, res) => {
    try {
        const user_id = Number(req.params.id)
        const user = await userService.getUserById(user_id);
        const cart = await cartService.getUserCart(user_id);
        res.json({ user: user, cart: cart });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default routes;