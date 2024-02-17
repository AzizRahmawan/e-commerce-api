# Project Installation & Running Guide

## Installation Steps
1. **Clone the project repository.**
   ```bash
   git clone https://github.com/azizRahmawan/e-commerce-api
   ```

2. **Install project dependencies.**
   ```bash
   npm install
   ```

3. **Initialize Prisma (choose one of the following commands based on your database provider).**
   ```bash
   npx prisma init
   ```
   or
   ```bash
   npx prisma init --datasource-provider=mysql
   ```

4. **Configure the database URL in the `.env` file.**

5. **Run database migration.**
   ```bash
   npm migrate dev
   ```

6. **Seed the database with initial data.**
   ```bash
   node ./seeder/authorization-seed.js
   node ./seeder/user-seed.js
   node ./seeder/category-seed.js
   node ./seeder/product-seed.js
   ```

7. **Start the project.**
   ```bash
   npm start
   ```

## Running Tests

### User Role Test Cases
1. **Login with a user account from the database by accessing the login route:**
   ```http
   127.0.0.1:3000/login
   ```
   Provide the email and password from the database (e.g., password1 to password5).

2. **Access product routes at:**
   ```http
   /products
   ```
   Use queries for searching products: `?search=product name or category name` or navigating to the next page with `?page=number of page`.

3. **Add a product to the cart using the `/cart` route with the `POST` method. Provide the product ID and quantity in the request body, for example:**
   ```json
   {
       "productId": 1,
       "quantity": 2
   }
   ```

4. **Access the cart routes at:**
   ```http
   /cart
   ```

5. **Place an order using the `/order` route with the `POST` method.**

6. **Make a payment for the order by accessing the `/pay-order` route with the `POST` method. Provide data in the request body, for example:**
   ```json
   {
       "order_id": 5,
       "amount": 5000,
       "cardNumber": "4111111111111111",
       "cvv": "123",
       "expiryMonth": 12,
       "expiryYear": 2025
   }
   ```
   Note: Payment for orders can only be made by the user who placed the order.

7. **If payment is successful, the order status will be updated to `status: true`.**
8. **You can logout with routes `/logout` with method `POST`.**

### Seller Role Test Cases
1. **Login with a seller (Role ID: 3) account from the database by accessing the login route:**
   ```http
   127.0.0.1:3000/login
   ```
   Provide the email and password from the database (e.g., password1 to password5).

2. **Add a new product with routes:**
    ```http
    /products
    ```
   with method `POST` and example input:
   ```json
    {
        "name": "Incredible Cotton Chair",
        "category_id": 1,
        "description": "Spiculum tutamen demum averto teneo creta accedo vitiosus patria blandior.",
        "price": 94,
        "stock": 71
    }
   ```

3. **Update your product with routes: `/products/:id your product` with methods `PUT`. You can edit all of the input data or some data:**
   ```json
    {
        "name": "Incredible Cotton Chair",
        "category_id": 1,
        "description": "Spiculum tutamen demum averto teneo creta accedo vitiosus patria blandior.",
        "price": 94,
        "stock": 71
    }
   ```

4. **Delete your product with routes `/products/:id` with method `DELETE`.**

5. **Get the list of your product with routes `/my-product`.**

6. **Get the list of orders for your product with routes `/order-product`.**

