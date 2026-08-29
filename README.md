# SDC ISP — Billing Management System

A complete, self-contained **Internet Service Provider (ISP) customer billing management** web application, rebuilt to match the **Hash Cnet HMS** reference design (AdminPro Bootstrap 4 admin theme).

## 🎨 Design

- **Login screen**: split layout — login card on the left, branded welcome panel ("Welcome To Hash Cnet HMS / Let's Get Started") on the right with a blue/dark gradient background.
- **Dashboard shell:** dark navy sidebar (`#000444` → `#0b1a4d`) with icon navigation, white topbar with border, light content area.
- **Color palette:** primary `#0b51b7`, dark `#000444`/`#303e67`, light `#eceff5`/`#f1f5fa`, success `#22b783`, warning `#ff9f43`, danger `#ef4d56`.
- **Components:** Bootstrap 4 cards, tables, badges, forms, modals — matching the reference theme.

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
├── styles.css   # Hash Cnet HMS (AdminPro) styling
└── app.js       # All application logic (data, rendering, actions)
```

## 🛠 Tech Stack

- **HTML5** — semantic structure
- **CSS3** — modern responsive design (sidebar, cards, tables, modals, badges)
- **Bootstrap 4** — grid, forms, buttons, tables
- **Vanilla JavaScript** — no frameworks, no dependencies
- **localStorage** — persistent data storage

## 📄 License

MIT