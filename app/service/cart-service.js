import prisma from "../prisma.js";

class Cart {
    async getCart () {
        const cart = await prisma.cart.findMany({
            select: {
                id: true,
                user_id: true,
                products: true,
            }
        });
        if (Object.keys(cart).length < 1) {
            throw Error('Cart is empty');
        }
        return cart;
    }
    async getUserCart(user_id) {
        const cart = await prisma.cart.findUnique({
            where: {
                user_id: user_id,
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
    async addProductToCart(productId, quantity, user) {
        const cart = await prisma.cart.findUnique({
            where: {
                user_id: user.id,
            },
        });
        if (!cart) {
            await prisma.cart.create({
                data: {
                    user_id: user.id,
                }
            });
        }
        const checkProduct = await prisma.product.findUnique({
            where: {
                id: productId,
                stock: {
                    gt: 0
                }
            },
        });
        if (!checkProduct) {
            throw Error('Product not found or stock 0');
        }
        const productCart = await prisma.cartProduct.findFirst({
            where: {
                cart_id: cart.id,
                product_id: productId,
            }
        });
        if (!productCart) {
            return await prisma.cartProduct.create({
                data: {
                    cart_id: cart.id,
                    product_id: productId,
                    quantity: quantity
                },
                include: {
                    products: true,
                }
            });
        }
        return await prisma.cartProduct.update({
            where: {
                cart_id_product_id: {
                    cart_id: productCart.cart_id,
                    product_id: productCart.product_id
                }
            },
            data: {
                quantity: productCart.quantity + quantity
            },
            include: {
                products: true,
            }
        });
    }
    async updateProductInCart(productId, quantity, user) {
        const cart = await prisma.cart.findUnique({
            where: {
                user_id: user.id,
            },
        });
        if (!cart) {
            throw Error('Cart not found');
        }
        const productCart = await prisma.cartProduct.findFirst({
            where: {
                cart_id: cart.id,
                product_id: productId,
            }
        });
        if (!productCart) {
            throw Error('Product not found in cart');
        }
        return await prisma.cartProduct.update({
            where: {
                cart_id_product_id: {
                    cart_id: productCart.cart_id,
                    product_id: productCart.product_id
                }
            },
            data: {
                quantity: quantity
            },
            include: {
                products: true,
            }
        });
    }
    async removeProductFromCart(productId, user) {
        const cart = await prisma.cart.findUnique({
            where: {
                user_id: user.id,
            },
        });
        if (!cart) {
            throw Error('Cart not found');
        }
        const productCart = await prisma.cartProduct.findFirst({
            where: {
                cart_id: cart.id,
                product_id: productId,
            }
        });
        if (!productCart) {
            throw Error('Product not found in cart');
        }
        await prisma.cartProduct.delete({
            where: {
                cart_id_product_id: {
                    cart_id: productCart.cart_id,
                    product_id: productCart.product_id
                }
            }
        });
        return;
    }
    async clearCart(user_id) {
        return await prisma.cartProduct.deleteMany({
            where: {
                carts: {
                    user_id: user_id
                }
            }
        });
    }
}

export default new Cart();
