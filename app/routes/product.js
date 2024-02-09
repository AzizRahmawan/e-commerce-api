import { Router } from "express";
import prisma from "../prisma.js";
import { authToken, authorizePermission } from "../middleware/middleware.js";
import { Permission } from "../authorization.js";

const routes = Router();
routes.use(authToken);

routes.get("/products", authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
});

export default routes;