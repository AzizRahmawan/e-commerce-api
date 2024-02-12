import { Role } from "../authorization.js";
import prisma from "../prisma.js";

class User {
    async getUser() {
        const user = await prisma.user.findMany({
            where: {
            role: {
                name: Role.REGULAR_USER || Role.SELLER
            }
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
            role: user.role.name
        }
        return dataUser;
    }
}

export default new User;