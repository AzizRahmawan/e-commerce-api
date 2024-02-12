# How to Install & Run Project
1. Pull Code
2. run: ``` npm install ```
3. run: ``` npx prisma init ``` or with ``` --datasource-provider=mysql ```
4. configure the database url in .env
5. run: ``` npm migrate dev ```
6. run: ``` node ./seeder/authorization-seed.js ```
7. run: ``` node ./seeder/user-seed.js ```
8. run: ``` node ./seeder/category-seed.js ``` (optional)
8. run: ``` node ./seeder/product-seed.js ``` (optional)
9. run: ``` npm start ```