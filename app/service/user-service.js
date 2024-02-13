import { Role } from "../authorization.js";
import prisma from "../prisma.js";

class User {
    async getUserData(user) {
        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            is_blocked: user.is_blocked,
            role: user.role.name
        };
    }

    async getUser() {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { role: { name: Role.REGULAR_USER } },
                    { role: { name: Role.SELLER } }
                ]
            },
            include: {
                role: true,
            },
        });

        const listUsers = users.map(user => this.getUserData(user));
        return Promise.all(listUsers);
    }

    async getUserById(id) {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                role: true,
            },
        });

        return this.getUserData(user);
    }

    async updateStatusUser(id, is_block) {
        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                is_blocked: is_block,
            },
            include: {
                role: true,
            },
        });

        return this.getUserData(user);
    }

    // async deleteUser(id) {
    //     const user = await prisma.user.delete({
    //         where: {
    //             id: id,
    //         },
    //         include: {
    //             role: true,
    //         },
    //     });

    //     return this.getUserData(user);
    // }
}

export default new User;