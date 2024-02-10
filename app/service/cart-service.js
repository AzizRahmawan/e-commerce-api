import prisma from "../prisma.js";

// Cart.js
class Cart {
    async getUserCart(user) {
        const cart = await prisma.cart.findUnique({
            where: {
                user_id: user.id,
            },
        });

        if (!cart) {
            throw Error('Cart not found');
        }

        const cartProduct = await prisma.cartProduct.findMany({
            where: {
                cart_id: cart.id,
            },
            select: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        seller: {
                            select: {
                                name: true,
                            }
                        },
                        category: {
                            select: {
                                name: true,
                            }
                        },
                        price: true,
                    }
                },
                quantity: true,
            },
        });    
        if (Object.keys(cartProduct).length <1){
            throw Error('Cart is empty');
        }
        const listProduct = cartProduct.map((item) => ({
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            category: item.products.category.name,
            seller: item.products.seller.name,
            quantity: item.quantity,
            total: item.products.price * item.quantity
        }));
        const total = listProduct.reduce((acc, item) => acc + item.total, 0);
        return {products: listProduct, total};
    }
}

export default new Cart();
