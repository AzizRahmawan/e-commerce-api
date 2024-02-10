import { Router } from "express";
import { authToken, authorizePermission } from "../middleware/middleware.js";
import { Permission } from "../authorization.js";
import cartService from "../service/cart-service.js";

const routes = Router();
routes.use(authToken);

routes.get('/cart', authorizePermission(Permission.BROWSE_CART), async (req, res) => {
    try {
        const user = req.user;
        const userCart = await cartService.getUserCart(user);
        
        res.json(userCart);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

routes.post('/cart', authorizePermission(Permission.ADD_TO_CART), async (req, res) => {

});

routes.delete('/cart', authorizePermission(Permission.REMOVE_FROM_CART), async (req, res) => {

});

export default routes;