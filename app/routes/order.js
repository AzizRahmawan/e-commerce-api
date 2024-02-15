import { Router } from "express";
import { authToken, authorizePermission } from "../middleware/auth.js";
import { Permission } from "../authorization.js";
import orderService from "../service/order-service.js";

const routes = Router();
routes.use(authToken);

routes.get('/order', authorizePermission(Permission.BROWSE_ORDERS), async (req, res) => {
    try {
        const user = req.user;
        const order = await orderService.getUserOrder(user.id);
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
routes.get('/order/:id', authorizePermission(Permission.VIEW_ORDER_DETAILS), async (req, res) => {
    try {
        const order_id = Number(req.params.id);
        const user_id = req.user.id;
        const order = await orderService.getUserOrderDetail(order_id, user_id);
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
routes.post('/order', authorizePermission(Permission.CREATE_ORDER), async (req, res) => {
    try {
        const user = req.user;
        const order = await orderService.createOrder(user);
        res.json({
            message: 'Order created successfully',
            order: order.order,
            item_order: order.itemOrder
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routes;