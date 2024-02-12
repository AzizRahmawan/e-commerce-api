import { Role } from "../authorization.js";
import prisma from "../prisma.js";

class User {
    async getUser() {
        const user = await prisma.user.findMany({
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
        if (!user) {
            throw Error ('User not found');
        }
        const listUser = user.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            is_blocked: user.is_blocked,
            role: user.role.name
        }));
        return listUser;
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
        if (!user) {
            throw Error ('User not found');
        }
        const dataUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            is_blocked: user.is_blocked,
            role: user.role.name
        }
        return dataUser;
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
        if (!user) {
            throw Error ('User not found');
        }
        const dataUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            is_blocked: user.is_blocked,
            role: user.role.name
        }
        return dataUser;
    }
}

export default new User;