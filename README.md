# SwiftCart 🚀 — The Amazon-Inspired E-Commerce Ecosystem

SwiftCart is a production-grade, full-stack e-commerce platform designed to provide a seamless, high-performance shopping experience modeled after industry leaders like Amazon. It features a robust **Storefront** for customers and a data-driven **Seller Central (Admin)** for business operations.

---

## 🌟 Key Features

### 🛒 The Storefront (Customer Experience)
- **Advanced Navigation**: Real-time search, category-specific experiences, and a persistent Amazon-style sidebar.
- **Intuitive Shopping Cart**: Premium Plus/Minus quantity controls with real-time subtotal calculations and safety limits.
- **One-Click "Buy Now"**: Accelerated checkout flow for immediate purchasing.
- **Post-Purchase Management**: 
    - **Live Order Tracking**: Multi-stage visual timeline tracking (`PLACED` → `SHIPPED` → `DELIVERED`).
    - **Smart Cancellations**: Pre-delivery cancellation with **Automatic stock restoration** (atomic updates).
    - **Engagement Hub**: Return processing, star-rating product reviews, and seller feedback modals.
- **Prime Membership**: Integrated Prime simulation for exclusive benefits and experience.

### 📊 Seller Central (Admin Mission Control)
- **Business Intelligence**: A premium overview dashboard featuring real-time revenue cards and growth projections.
- **Product Lifecycle Management**: Granular control over the product catalog (Add/Edit/Delete) with inventory tracking.
- **Order Command Center**: Manage fulfillment states and view detailed transaction histories.
- **Customer Insights**: Real-time access to the user database, identifying top spenders and the latest acquisitions.
- **Intelligent Analytics**: Visual data modeling for revenue streams, traffic sources, and category-level performance.
- **Operational Settings**: Fine-tune store profile, currency, and maintenance modes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router, Tailwind CSS, Lucide Icons, Date-fns |
| **Backend** | Node.js, Express.js (TypeScript) |
| **Database** | MongoDB with Prisma ORM |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js, HttpOnly Cookies |
| **Dev Tools** | Vite, Postman, Prisma Studio |

---

## 🏗️ Architectural Excellence

- **Atomic Inventory Updates**: When an order is placed or canceled, the system ensures database consistency through transactional updates (e.g., restoring stock counts automatically on cancellation).
- **Glassmorphism UI**: A custom design system focusing on depth, subtle gradients, and modern micro-animations for a premium feel.
- **Protected Routing**: Role-based access control (RBAC) ensuring only authorized Sellers can access the Admin Hub.
- **Responsive Engineering**: Fully optimized for mobile, tablet, and desktop viewports.

---

## 🚀 Quick Start

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/your-username/swiftcart.git
   cd swiftcart
   ```

2. **Backend Configuration**:
   - Install dependencies: `npm install`
   - Create a `.env` file with `DATABASE_URL`, `JWT_SECRET`, and `PORT`.
   - Setup Prisma: `npx prisma generate` && `npx prisma db push`
   - Seed data: `npm run seed`

3. **Launch the Engine**:
   - Start Backend: `npm run dev`
   - Start Frontend: `cd frontend && npm install && npm run dev`

---

## 👤 Admin Demo Access
- **Email**: `admin@swiftcart.demo`
- **Password**: `admin1234`

---

### Developed with 🧡 by [Your Name]
> SwiftCart is not just a demo; it's a blueprint for scalable e-commerce logic.
