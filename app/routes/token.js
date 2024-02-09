import { Router } from "express";
import prisma from "../prisma.js";
import { validateTokenRequest } from "../middleware/validator.js";
import { authorizePermission } from "../middleware/middleware.js";
import { Permission } from "../authorization.js";

const routes = Router();

routes.get("/token", authorizePermission(Permission.BROWSE_TOKENS), async (req, res) => {
    const token = await prisma.token.findMany();
    res.json(token);
});

routes.post('/token', async(req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    });
    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
    if (user.is_blocked) {
        return res.status(401).json({
            message: "Your account is blocked"
        });
    }
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
});

export default routes;