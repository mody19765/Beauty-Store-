# 💄 Beauty Store API

A powerful and modular e-commerce backend for a Beauty Store, built with Node.js, Express, and PostgreSQL. Supports full authentication, role-based access (admin & user), product/category management, and wishlist features.

## 🚀 Features

- JWT Authentication (Login / Signup)
- Roles: `admin` & `user`
- Admin functionalities:
  - Add/edit/delete users
  - Manage products and categories
- User functionalities:
  - View products and categories
  - Add/remove items from wishlist
- Password reset via email
- 3-level category nesting
- PostgreSQL with Sequelize ORM

## 📁 Project Structure

Beauty-Store/
├── config/         → PostgreSQL connection setup  
├── controllers/    → Route logic for auth, users, products, etc.  
├── middlewares/    → Auth, role-based checks  
├── models/         → Sequelize models  
├── routes/         → Express API routes  
├── services/       → Core business logic  
├── utils/          → Token/email helpers  
└── index.js        → App entry point  

## 🔧 Installation

1. Clone the repo:  
   `git clone https://github.com/mody19765/Beauty-Store-.git`  
   `cd Beauty-Store-`

2. Install dependencies:  
   `npm install`

3. Create `.env` file:

4. Start the app:  
`npm start`

## 🔑 API Endpoints

### Auth Routes
- `POST /signup` → Register new user  
- `POST /login` → Login and receive JWT  
- `POST /forgot-password` → Send reset link via email  
- `POST /reset-password` → Reset password with token  

### Admin Routes (requires `admin` role)
- `POST /admin/users` → Add user  
- `GET /admin/users` → List users  
- `PATCH /admin/users/:id` → Update user  
- `DELETE /admin/users/:id` → Delete user  

- `POST /admin/products` → Add product  
- `PATCH /admin/products/:id` → Update product  
- `DELETE /admin/products/:id` → Delete product  

- `POST /admin/categories` → Add category (with nesting)  
- `PATCH /admin/categories/:id` → Update category  
- `DELETE /admin/categories/:id` → Delete category  

### User Routes
- `GET /products` → View all products  
- `GET /categories` → View all categories  
- `POST /wishlist` → Add product to wishlist  
- `GET /wishlist` → View wishlist  
- `DELETE /wishlist/:id` → Remove product from wishlist  
- `PATCH /profile` → Update user info  

## 📦 Database Models

**User**  
- id, name, email, password (hashed), role (`admin` | `user`)

**Product**  
- id, name, description, price, image, categoryId

**Category**  
- id, name, parentCategoryId (nullable for nesting)

**Wishlist**  
- id, userId, productId

## ✅ Upcoming Features

- Admin dashboard with stats  
- Product search and filters  
- Product image upload via cloud storage  
- Swagger API documentation  

## 📫 Contact

Mohamed Ehab
Email: [mody.dev19765@gmail.com](mailto:mody.19765@gmail.com)  
GitHub: [https://github.com/mody19765](https://github.com/mody19765)

## ⭐️ Support

If you like this project, don’t forget to ⭐️ the repo and share it!
