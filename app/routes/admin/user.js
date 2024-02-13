import { Router } from "express";
import { authAdminToken, authorizePermission } from "../../middleware/auth.js";
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

routes.patch('/user/:id', authorizePermission(Permission.EDIT_USER), async(req, res) => {
    try {
        const user_id = Number(req.params.id);
        const { is_block } = req.body;
        const user = await userService.updateStatusUser(user_id, is_block);
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// routes.delete('/user/:id', authorizePermission(Permission.DELETE_USER), async(req, res) => {
//     try {
//         const user_id = Number(req.params.id);
//         const user = await userService.deleteUser(user_id);
//         res.json({ message: 'User deleted successfully', user });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

export default routes;