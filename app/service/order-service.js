import prisma from "../prisma.js";
import cartService from "./cart-service.js"

class Order {
    async getUserOrder(user_id) {
        const order = await prisma.order.findMany({
            where: {
                user_id: user_id,
            },
        });
        if (Object.keys(order).length < 1) {
            throw Error('Order is empty');
        }
        return order;
    }

    async getUserOrderDetail(order_id, user_id) {
        const order = await prisma.itemOrder.findMany({
            where: {
                order_id: order_id,
                orders: {
                    user_id: user_id
                }
            },
        });
        if (order.length === 0) {
            throw Error('Order not found');
        }
        return order;
    }

    async createOrder(user) {
        const cart = await cartService.getUserCart(user.id);
        const invoice = 'ORDER-' + Math.random().toString(36);
        
        const order = await prisma.order.create({
            data: {
                invoice,
                user_id: user.id,
            },
        });
    
        const itemOrderData = cart.products.map((product) => {
            return {
                order_id: order.id,
                product_id: product.id,
                quantity: product.quantity,
                price: product.price,
                total: product.price * product.quantity
            };
        });
    
        const itemOrder = await prisma.itemOrder.createMany({
            data: itemOrderData,
        });
        await cartService.clearCart(user.id);
    
        return { order, itemOrder };
    }    
}

export default new Order;