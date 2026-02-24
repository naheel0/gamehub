# 📘 LEARN.md — Understanding gamehub

This document explains how **gamehub** works internally in a simple way.  
It helps you understand the architecture, state management, routing, and how to extend the project properly.

---

# 🧠 1. How the App Works (Big Picture)

gamehub is a **React Single Page Application (SPA)**.

Main flow:

UI Components  
↓  
Pages  
↓  
Contexts (Global State)  
↓  
API Service Layer  
↓  
json-server (db.json)

The frontend talks to a mock backend (`json-server`) that reads and writes data from `db.json`.

---

# 🏗 2. Project Architecture

The project is organized clearly:

- `pages/` → Route-level pages (Products, Cart, Admin, etc.)
- `components/` → Reusable UI pieces
- `contexts/` → Global state (Cart, Auth, Wishlist)
- `Services/` → API calls
- `Admin/` → Isolated admin system

This separation keeps the app scalable and clean.

---

# 🧭 3. Routing (React Router)

Routes are defined in `App.jsx`.

Example:

- `/` → Home
- `/products` → Products page
- `/cart` → Cart page
- `/admin` → Admin panel (protected)

Admin routes use `ProtectedAdminRoute.jsx`.

It checks:
- Is user logged in?
- Is user an admin?

If not → redirect.

---

# 🌍 4. Global State (React Context)

The app uses **React Context API** instead of Redux.

There are three main contexts:

## 4.1 CartContext
Handles:
- Add to cart
- Remove from cart
- Update quantity
- Calculate totals
- Persist cart data

## 4.2 WishlistContext
Handles:
- Add to wishlist
- Remove from wishlist
- Store wishlist items

## 4.3 AuthContext
Handles:
- Login
- Signup
- Logout
- Current user
- Admin role check

AuthContext controls access to:
- Profile page
- Admin panel

---

# 🗄 5. Backend Simulation (json-server)

The project does not use a real backend.

Instead:

- `db.json` stores data
- `npm run server` starts json-server
- Runs on: http://localhost:3001

Example endpoints:
- `/products`
- `/users`
- `/orders`

This makes development easy without building a real backend.

---

# 🧩 6. API Service Layer

All API calls are inside:
src/Services/api.jsx


Why?

- Keeps components clean
- Makes backend replacement easy
- Centralizes fetch logic

Never call `fetch()` directly inside pages if possible.  
Always use the service layer.

---

# 🎨 7. Styling Strategy

The project uses:

- TailwindCSS → Layout & spacing
- MUI → Complex UI components
- Framer Motion → Animations
- Swiper → Carousels

Tailwind handles structure.  
MUI handles advanced UI components.

---

# 🛡 8. Admin System

Admin is isolated inside:
pages/Admin/


It includes:
- AdminDashboard
- AdminProducts
- AdminOrders
- AdminUsers
- AdminAddProducts
- AdminContext

Admin is protected using `ProtectedAdminRoute.jsx`.

This keeps user and admin logic separate.

---

# ⚡ 9. Performance Concepts Used

- Small reusable components
- Separate contexts (avoids global re-renders)
- Vite for fast builds
- Clean separation of concerns

---

# 🚀 10. How to Add a New Feature (Example)

If you want to add Reviews:

1. Add `"reviews"` to `db.json`
2. Add API functions in `api.jsx`
3. Create `ReviewContext.jsx`
4. Create review components
5. Inject into `ProductDetails.jsx`

Follow the same structure.  
Do not mix responsibilities.

---

# 📌 11. Rules to Follow When Editing

✔ Do not mix admin logic into user pages  
✔ Do not put API calls everywhere  
✔ Keep components small  
✔ Keep contexts focused  
✔ Follow folder structure  
✔ Think about scalability  

---

# 🏁 12. What You Should Learn From This Project

By understanding gamehub, you learn:

- How to structure a scalable React app
- How to manage global state
- How to simulate a backend
- How to build protected routes
- How to design e-commerce flows
- How to separate admin and user systems

---

# 🎯 Final Note

gamehub is not just a UI template.  
It is a blueprint for building real-world React storefronts.

Study the structure carefully.  
If you understand this architecture, you can build much larger applications confidently.
