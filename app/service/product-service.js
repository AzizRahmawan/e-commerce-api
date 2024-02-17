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

        if (products < 1) {
            throw new Error("Products not found");
        }
    
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
    async getMyProduct(user_id) {
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
            include: {
                role: true,
            }
        });

        if (user.role.name !== Role.SELLER) {
            throw new Error("You are not seller");
        }

        const products = await prisma.product.findMany({
            where: {
                seller_id: user_id,
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
        return products;
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
      
    async findProductById(id) {
        const product = await prisma.product.findUnique({
            where: {
            id,
            },
            select: {
            seller_id: true,
            },
        });
    
        this.checkProductExists(product);
    
        return product;
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