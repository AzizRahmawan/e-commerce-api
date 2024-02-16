import { Role } from "../authorization.js";
import prisma from "../prisma.js";
import cartService from "./cart-service.js"

class Order {
    async getOrder() {
        const order = await prisma.order.findMany({
            select: {
                id: true,
                user_id: true,
                invoice: true,
                total: true,
            }
        });
        if (order.length < 1) {
            throw Error('Order is empty');
        }
        return order;
    }
    async getOrderSeller(seller_id) {
        const seller = await prisma.user.findUnique({
            where: {
                id: seller_id,
            },
            include: {
                role: true,
            }
        });
        if (seller.role.name !== Role.SELLER) {
            throw Error('You are not a seller');
        }
        const orders = await prisma.order.findMany({
            where: {
                products: {
                    some: {
                        products: {
                            seller_id: seller_id,
                        }
                    }
                }
            },
        });
        if (orders.length < 1) {
            throw Error('Order is empty');
        }
        return orders;
    }
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
        const order = await prisma.order.findUnique({
            where: {
                id: order_id,
                user_id: user_id
            }
        });
        if (!order) {
            throw Error('Order not found');
        }
        const orderDetail = await prisma.itemOrder.findMany({
            where: {
                order_id: order_id,
                orders: {
                    user_id: user_id
                }
            },
        });
        if (orderDetail.length === 0) {
            throw Error('Order item is empty');
        }
        return { order, orderDetail };
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

        
        await prisma.itemOrder.createMany({
            data: itemOrderData,
        });
        const totalPriceOrder = itemOrderData.reduce((acc, product) => acc + product.total, 0);
        await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                total: totalPriceOrder,
            },
        });

        const orderDetail = {
            id: order.id,
            invoice: order.invoice,
            total: totalPriceOrder,
            status: order.status
        }
    
        return orderDetail;
    }

    async updateStatusOrder(order_id, user_id) {
        const updateStatusOrder = await prisma.order.update({
            where: {
                id: order_id,
                user_id: user_id,
                status: false,
            },
            data: {
                status: true,
            },
        });
        if (!updateStatusOrder) {
            throw Error('Order has been paid');
        }
        const order = await this.getUserOrderDetail(order_id, user_id);
        const orderProduct = order.orderDetail.map((item) => ({
            id: item.product_id,
            quantity: item.quantity,
        }));
        
        const updateProductPromises = orderProduct.map(async (product) => {
            await prisma.product.update({
                where: {
                    id: product.id,
                },
                data: {
                    stock: {
                        decrement: product.quantity,
                    },
                },
            });
        });
        await Promise.all(updateProductPromises);
        return order;
    }
}

export default new Order;