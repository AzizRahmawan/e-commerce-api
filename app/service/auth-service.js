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
    async loginUser(email, password) {
        let sessionToken = '';
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
        // if (user.role.name !== Role.ADMINISTRATOR) {
        //     throw Error ('You are not allowed to access');
        // }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            throw Error ('Invalid credentials');
        }
        const existingToken = await prisma.token.findFirst({
            where: {
            user_id: user.id,
            },
        });
        if (!existingToken) {
            throw Error('You must Register');
        } else if (existingToken.expires_at < new Date()) {
            const createToken = generateSessionToken();
            await prisma.token.create({
            data: {
                user_id: user.id,
                token: createToken,
                expires_at: new Date(new Date().getTime() + 30 * 24 * 3600 * 1000),
            },
            });
            sessionToken = createToken;
        }
        else {
            sessionToken = existingToken.token;
        }
        const userData = {
            message: 'Login successful',
            userEmail: user.email,
            userName: user.name,
            token: sessionToken,
        };
        return userData;
    }
}

export default new AuthService;
