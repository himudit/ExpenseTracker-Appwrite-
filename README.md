# 💸 ExpenseMate – Your Personal Expense Tracker

ExpenseMate is a web application built with **React**, **Tailwind CSS**, **Appwrite**, and **Redux Toolkit** to help users seamlessly track their personal incomes and expenses. Designed with simplicity, responsiveness, and performance in mind, this app helps users visualize and control their finances better.

---

## 🚀 Features

- 🔐 **User Authentication**: Secure login and registration with **Appwrite Authentication**
- 🧾 **Expense & Income Tracking**: Add incomes and expenses with categories and descriptions
- 📊 **Data Visualization**: View financial insights using charts with **Recharts**
- 📱 **Responsive UI**: Mobile-first, clean interface built using **Tailwind CSS**
- 🗂️ **Category-Based Sorting**: Organize expenses and incomes by categories for easy analysis

---

## 🛠️ Tech Stack

| Area | Tech |
|------|------|
| Frontend | React, Tailwind CSS |
| Backend | Appwrite |
| State Management | Redux Toolkit, React Hooks (useState, useEffect) |
| Data Visualization | Recharts |
| Deployment | Vercel |

---

## 📁 Environment Setup

To run this project locally, clone the repository and set up the required environment variables in a `.env` file.

### 🧪 .env Configuration:
```env
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id

# Collections
VITE_APPWRITE_COLLECTION1_ID=  # Main
VITE_APPWRITE_COLLECTION2_ID=  # NewExpense
VITE_APPWRITE_COLLECTION3_ID=  # Profile
VITE_APPWRITE_COLLECTION4_ID=  # CategoryExpense
VITE_APPWRITE_COLLECTION5_ID=  # NewIncome
VITE_APPWRITE_COLLECTION6_ID=  # CategoryIncome

# Buckets
VITE_APPWRITE_BUCKET_ID=       # Profile Bucket
VITE_APPWRITE_BUCKET2_ID=      # Expense Bucket
VITE_APPWRITE_BUCKET3_ID=      # Income Bucket
```

> 📝 Replace the placeholder values with your actual Appwrite project credentials.

---

## 🧑‍💻 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/ExpenseTracker.git
cd ExpenseTracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
Follow the structure above and add your Appwrite config values.

### 4. Run the app locally
```bash
npm run dev
```

### 5. Visit in browser
Open your browser at `http://localhost:5173`

---

## 🌐 Deployment
This project is deployed using [Vercel](https://expensemate-nu.vercel.app/). You can fork this repo and deploy it directly with your own Appwrite credentials.

---

## 🙌 Contributions
Pull requests are welcome. Feel free to open issues or suggest features!

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).

---

Made with ❤️ using React and Appwrite.

