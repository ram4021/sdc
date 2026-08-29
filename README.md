# SDC ISP — Billing Management System

A complete, self-contained **Internet Service Provider (ISP) customer billing management** web application. Built with pure HTML, CSS, and JavaScript — no build step, no server required. All data is persisted in the browser's `localStorage`.

## ✨ Features

### 🔐 Authentication
- Login screen with username and password
- Default admin account: **admin** / **admin123**
- All pages (dashboard, customers, billing, plans, renewals) are protected behind login
- Change password from within the app (stored in localStorage)
- Logout button returns to the login screen
- Clear error message for wrong credentials

### 👥 Customer Management
- Add new customers (name, phone, address, email, connection type)
- View, edit, and delete customers
- Search customers by name, phone, or email
- Assign an internet plan to each customer

### 🧾 Billing Details
- Generate monthly bills for all customers in one click
- Track amount due, due date, and payment status (paid / pending / overdue)
- Mark bills as paid
- View full payment history per customer

### 📡 Plans
- Manage internet plans (name, speed, price, validity in days, description)
- Add, edit, and delete plans
- See how many subscribers each plan has

### 🔄 Renewals
- Renew customer plans / subscriptions
- Track renewal start and expiry dates
- See upcoming, active, and expired renewals
- Extend validity by any number of days

### 📊 Dashboard
- Overview stats: total customers, active plans, pending payments, revenue collected
- Recent bills and upcoming/expired renewals at a glance

## 🚀 Getting Started

Simply open `index.html` in any modern browser. The app comes pre-loaded with sample data so you can explore immediately. All changes are saved automatically to your browser's local storage.

## 🗂 Project Structure

```
├── index.html   # App shell, sidebar navigation, views, modal
├── styles.css   # Clean, professional UI styling
└── app.js       # All application logic (data, rendering, actions)
```

## 🛠 Tech Stack

- **HTML5** — semantic structure
- **CSS3** — modern responsive design (sidebar, cards, tables, modals, badges)
- **Vanilla JavaScript** — no frameworks, no dependencies
- **localStorage** — persistent data storage

## 📄 License

MIT