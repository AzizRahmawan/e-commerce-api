import { Role } from "../authorization.js";
import prisma from "../prisma.js";

class Product {
    async get(q, page=1) {
        const limit = 5;
        const offset = (page - 1) * limit;
    
        if (isNaN(Number(page)) && page) {
          throw new Error("Invalid page number");
        }
    
        const whereCondition = q ? {
            OR: [
                {
                    name: {
                        contains: q,
                    },
                },
                {
                    category: {
                        name: {
                            contains: q,
                        },
                    },
                },
            ],
        } : {};
    
        const products = await prisma.product.findMany({
            where: whereCondition,
            include: {
                category: {
                select: {
                    name: true,
                },
                },
                seller: {
                select: {
                    name: true,
                },
                },
            },
            take: limit,
            skip: offset,
        });
    
        const totalCount = await prisma.product.count({
            where: whereCondition,
        });
    
        const totalPage = Math.ceil(totalCount / limit);
        const nextPage = page < totalPage ? page + 1 : null;
    
        return {
            data: products.map((product) => this.mapProductData(product)),
            meta: {
                total: totalCount,
                current_page: page,
                next_page: nextPage,
                total_page: totalPage,
            },
        };
    }
    
  
    async getById(id) {
        const product = await prisma.product.findUnique({
            where: {
            id: id,
            },
            include: {
            category: {
                select: {
                name: true,
                },
            },
            seller: {
                select: {
                name: true,
                },
            },
            },
        });
    
        this.checkProductExists(product);
    
        return this.mapProductData(product);
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
        const existingProduct = await this.findProductById(id);
        this.checkSellerAuthorization(seller, existingProduct);
    
        const product = await prisma.product.update({
            where: {
            id,
            },
            data: { ...updateData },
            include: {
            category: {
                select: {
                name: true,
                },
            },
            seller: {
                select: {
                name: true,
                },
            },
            },
        });
    
        return product;
    }
  
    async deleteProduct(id, seller) {
        const existingProduct = await this.findProductById(id);
        this.checkSellerAuthorization(seller, existingProduct);
        await prisma.cartProduct.deleteMany({ where: { product_id: id }});
        await prisma.product.delete({ where: { id } });
        return;
    }
  
    checkListNotEmpty(list) {
        if (Object.keys(list).length < 1) {
            throw new Error('List is empty');
        }
    }
  
    checkProductExists(product) {
        if (!product) {
            throw new Error('Product not found');
        }
    }
  
    mapProductData(product) {
        return {
            id: product.id,
            name: product.name,
            category: product.category.name,
            seller: product.seller.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        };
    }
  
    checkSellerAuthorization(seller, existingProduct) {
        if (seller.role.name !== Role.ADMINISTRATOR) {
            if (existingProduct.seller_id !== seller.id) {
            throw new Error('Unauthorized: You are not the seller of this product');
            }
        }
    }
}
  

export default new Product;