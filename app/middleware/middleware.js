import prisma from "../prisma.js";
import bcrypt from "bcrypt";

const authToken = async (req, res, next) => {
    const token = req.cookies.sessionToken;
    if (!token) {
        return res.status(401).json({
            message: 'You must be logged in'
        });
    }
    const validToken = await prisma.token.findUnique({
        where: { token },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    is_blocked: true,
                    role_id: true
                }
            }
        }
    });
    if (!validToken) {
        return res.status(401).json({
            message: 'You are is not allowed to access this'
        });
    }
    if (validToken.user.is_blocked) {
        return res.status(401).json({
            message: 'Your account is blocked', data : validToken.user,
        });
    }
    if (validToken.expires_at < new Date()) {
        return res.status(401).json({
            message: 'Your session has expired'
        });
    }
    req.user = validToken.user;
    next();
}

const authorizePermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const permissionRecords = await prisma.permissionRole.findMany({
            where: { role_id: req.user.role_id },
            include: { permissions: true }
        });
        const permissions = permissionRecords.map((record) => record.permissions.name);
        if (!permissions.includes(permission)) {
            return res.status(403).json({
                message: 'Forbidden permission'
            });
        }

        next();
    }
}

export { authToken, authorizePermission };