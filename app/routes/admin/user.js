import { Router } from "express";
import { authAdminToken, authorizePermission } from "../../middleware/middleware.js";
import { Permission } from "../../authorization.js";
import userService from "../../service/user-service.js";

const routes = Router();
routes.use(authAdminToken);

routes.get('/user', authorizePermission(Permission.BROWSE_USERS), async (req, res) => {
    try {
        const user = await userService.getUser();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

routes.get('/user/:id', authorizePermission(Permission.READ_USER), async(req, res) => {
    try {
        const user_id = Number(req.params.id);
        const user = await userService.getUserById(user_id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default routes;