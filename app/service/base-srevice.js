import prisma from "../prisma.js";

class BaseService {
    constructor(model){
        this.model = model;
    }
    async get(){
        const [rows] = await prisma[this.model].findMany();
        if (Object.keys(rows).length < 1) {
            throw Error("List Empty");
        }
        return rows;
    }
}

export default BaseService;