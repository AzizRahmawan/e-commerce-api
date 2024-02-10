import { Role } from "../authorization.js";
import prisma from "../prisma.js";

class Product {
    async get(){
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: {
                    select: {
                        name: true,
                    }
                },
                seller: {
                    select: {
                        name: true,
                    }
                },
            }
        });
        if (Object.keys(products).length < 1) {
            throw Error('List is empty');
        }
        const product = products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                category: product.category.name,
                seller: product.seller.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
            }
        })
        return product;
    }
    async getById(id){
        const product = await prisma.product.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: {
                    select: {
                        name: true,
                    }
                },
                seller: {
                    select: {
                        name: true,
                    }
                },
            }
        });
        if (!product) {
            throw Error('Product not found');
        }
        return {
            id: product.id,
            name: product.name,
            category: product.category.name,
            seller: product.seller.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        }
    }
    async addProduct(name, price, description, category_id, stock, seller) {
        const product = await prisma.product.create({
            data: {
            name,
            price,
            description,
            category_id,
            stock,
            seller_id: seller.id
            },
        });
        return product;
    }
    async updateProduct(id, updateData, seller) {
        const existingProduct = await prisma.product.findUnique({
            where: {
                id,
            },
            select: {
                seller_id: true,
            },
        });

        if (!existingProduct) {
            throw Error('Product not found');
        }

        if (seller.role.name !== Role.ADMINISTRATOR) {
            if (existingProduct.seller_id !== seller.id) {
                throw Error('Unauthorized: You are not the seller of this product');
            }
        }

        const product = await prisma.product.update({
            where: {
                id,
            },
            data: {...updateData},
        });
        return product;
    }
    async deleteProduct(id, seller) {
        const existingProduct = await prisma.product.findUnique({
            where: {
                id,
            },
            select: {
                seller_id: true,
            }
        })
        if (!existingProduct) {
            throw Error('Product does not exist');
        }
        if (seller.role.name !== Role.ADMINISTRATOR) {
            if (existingProduct.seller_id!== seller.id) {
                throw Error('Unauthorized: You are not the seller of this product');
            }
        }
        await prisma.product.delete({where: {id}})
        return;
    }
}

export default new Product;