import { Router } from "express";
import { authorizePermission } from "../../middleware/auth.js";
import { Permission } from "../../authorization.js";
import orderService from "../../service/order-service.js";

const routes = Router();

routes.get('/order', authorizePermission(Permission.BROWSE_ORDERS),async (req, res) => {
    try {
        const order = await orderService.getOrder();
        res.json(order);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default routes;