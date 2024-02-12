import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import { Buffer } from "buffer";
import prisma from '../prisma.js';
import { Role } from '../authorization.js';

const generateSessionToken = () => {
  const token = Buffer.from(randomstring.generate()).toString('base64');
  return token;
};

class AuthService {
    async getUser(email, password) {
        const user = await prisma.user.findUnique({
            where: {
            email: email,
            },
            include: {
            role: true,
            },
        });
        if (!user) {
            throw Error ('User not found');
        }

        if (user.is_blocked) {
            throw Error ('Your account is blocked');
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            throw Error ('Invalid credentials');
        }
        return user;
    }
    async getToken(user_id){
        let sessionToken = '';
        const existingToken = await prisma.token.findFirst({
            where: {
            user_id: user_id,
            },
        });
        // if (!existingToken) {
        //     throw Error('You must Register');
        // } else 
        if (!existingToken || (existingToken && existingToken.expires_at < new Date())) {
            const createToken = generateSessionToken();
            await prisma.token.create({
            data: {
                user_id: user_id,
                token: createToken,
                expires_at: new Date(new Date().getTime() + 30 * 24 * 3600 * 1000),
            },
            });
            sessionToken = createToken;
        }
        else {
            sessionToken = existingToken.token;
        }
        return sessionToken;
    }
    async loginUser(email, password) {
        const user = await this.getUser(email, password);
        if (user.role.name !== Role.REGULAR_USER && user.role.name !== Role.SELLER) {
            throw Error ('You are not allowed to access');
        }
        const sessionToken = await this.getToken(user.id);
        const userData = {
            message: 'Login successful',
            userEmail: user.email,
            userName: user.name,
            token: sessionToken,
        };
        return userData;
    }
    async loginAdmin(email, password) {
        const admin = await this.getUser(email, password);
        if (admin.role.name !== Role.ADMINISTRATOR) {
            throw Error ('You are not admin');
        }
        const sessionToken = await this.getToken(admin.id);
        const adminData = {
            message: 'Login successful',
            userEmail: admin.email,
            userName: admin.name,
            token: sessionToken,
        };
        return adminData;
    }
}

export default new AuthService;
