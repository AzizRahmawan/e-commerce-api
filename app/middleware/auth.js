import prisma from "../prisma.js";

const validateToken = async (req, res, next, isAdmin) => {
    const token = isAdmin ? req.cookies.sessionAdminToken : req.cookies.sessionToken;
    
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
                    role: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });

    if (!validToken) {
        return res.status(401).json({
            message: 'You are not allowed to access this'
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

    if (isAdmin) {
        req.isAdmin = true;
    }

    next();
};

const authToken = async (req, res, next) => {
    await validateToken(req, res, next, false);
};

const authAdminToken = async (req, res, next) => {
    await validateToken(req, res, next, true);
};


const authorizePermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }

            const permissionRecords = await prisma.permissionRole.findMany({
                where: { role_id: req.user.role.id },
                include: { permissions: true }
            });

            const permissions = permissionRecords.map((record) => record.permissions.name);

            if (!permissions.includes(permission)) {
                return res.status(403).json({
                    message: 'Forbidden permission'
                });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    };
};

const checkLogout = (req, res, next) => {
    const sessionToken = req.cookies.sessionToken;
  
    if (sessionToken) {
        return res.status(401).json({
            message: 'You are already logged in. Logout before logging in again.',
        });
    }
  
    next();
};

const checkAdminLogout = (req, res, next) => {
    const sessionToken = req.cookies.sessionAdminToken;
  
    if (sessionToken) {
      return res.status(401).json({
        message: 'You are already logged in. Logout before logging in again.',
      });
    }
  
    next();
};

export { authToken, authAdminToken, authorizePermission, checkLogout, checkAdminLogout };