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

routes.get('/order-product', authorizePermission(Permission.BROWSE_ORDERS), async (req, res) => {
    try {
        const user = req.user;
        const order = await orderService.getOrderSeller(user.id);
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
        res.json({
            order: order.order, 
            detail: order.orderDetail
        });
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
            order: order,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
routes.post('/pay-order', authorizePermission(Permission.CREATE_ORDER), async (req, res) => {
    try {
        const { order_id, amount, cardNumber, cvv, expiryMonth, expiryYear } = req.body;
        const user = req.user;
        const order = await orderService.getUserOrderDetail(order_id, user.id);
        if (amount < order.order.total) {
            throw Error('Amount is less of order total')
        }
        const paymentResult = await fetch('http://localhost:3000/pay', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                cardNumber,
                cvv,
                expiryMonth,
                expiryYear,
            }),
        });
        const updateOrder = await orderService.updateStatusOrder(order_id, user.id);
        const result = await paymentResult.json();
    
        res.json({
            result,
            updateOrder
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

export default routes;