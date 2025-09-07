# Siddhi Divine - Spiritual E-Commerce Store

This is a complete full-stack application for a spiritual products e-commerce store, built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Features

- **Hierarchical Categories:** Browse products in main categories and unlimited sub-categories.
- **Intelligent Seeding:** A single `seed-content.json` file manages all categories and products.
- **Professional Theming:** Consistent branding based on the company logo, powered by Tailwind CSS.
- **Modern Frontend:** Built with React, Vite, and React Query for a fast, modern user experience.
- **Robust Backend:** Node.js, Express, and Prisma ORM for a reliable and scalable API.

## Setup and Installation

1.  **Install All Dependencies:**
    ```bash
    npm run install:all
    ```
2.  **Set Up Environment Variables:**
    -   Copy `.env.example` to `server/.env`.
    -   Copy `.env.example` to `client/.env.local`.
3.  **Run Database Migration:**
    ```bash
    npm run db:migrate
    ```
4.  **Seed the Database:**
    ```bash
    npm run db:seed
    ```
5.  **Start Development Servers:**
    ```bash
    npm run dev
    ```