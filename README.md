# 🎬 Cinion - Movie Ticket Booking App

<img width="1919" height="871" alt="Screenshot 2025-12-04 135908" src="https://github.com/user-attachments/assets/a34ca985-1008-40af-b7ea-84af76488524" />



**Cinion** is a full-stack MERN movie ticket booking application. It provides a seamless experience for users to browse movies, watch trailers, select seats in real-time, and book tickets using secure payments. It features a robust admin dashboard, automated email notifications, and background job processing for managing booking timeouts.

## 🚀 Live Demo
[Live Demo](https://cineon.vercel.app/)



---

## ✨ Key Features

### 👤 User Experience
* **Authentication:** Secure login and registration via **Clerk**.
* **Movie Discovery:** Browse upcoming movies and popular TV shows powered by **Trakt API**, **Fanart API**, and **TMDB**.
* **Detailed Info:** View cast, ratings, runtimes, and watch official trailers via **React Player**.
* **Interactive Seat Layout:** Dynamic seat selection with real-time availability.
* **Payments:** Secure checkout process using **Stripe**.
* **My Bookings:** View booking history and ticket status.

### 🛠 Admin Dashboard
* **Manage Shows:** Add new movie screenings, set dates, times, and ticket prices.
* **Analytics:** View total bookings, revenue, and active shows.
* **Admin Protection:** Secure routes accessible only to authorized personnel.

### ⚙️ Backend & Automation
* **Smart Booking System:** Seats are temporarily held for 10 minutes.
* **Background Jobs (Inngest):** Automatically releases seats and cancels bookings if payment is not completed within the timeframe.
* **Email Notifications:** Automated emails via **Nodemailer** & **Brevo** for:
    * Booking Pending
    * Booking Confirmed
    * Booking Cancelled (Timeout)

---

## 🛠️ Tech Stack

### Frontend
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React.js** - UI Library
* ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Styling
* **React Router DOM** - Navigation & Dynamic Routing (`useParams`)
* **Clerk** - User Authentication
* **Sonner** - Toast Notifications
* **React Player** - Video/Trailer Embeds

### Backend
* ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Node.js** & **Express** - Server Framework
* ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB** (Mongoose) - Database
* **Inngest** - Event-driven queues & background jobs
* **Nodemailer** - Email Service

### Services & APIs
* **Stripe** - Payment Gateway
* **Trakt API / Fanart API / TMDB** - Movie Metadata & Images
* **Brevo (formerly Sendinblue)** - SMTP Provider

---

## 🏗️ Architecture & Workflow

1.  **Movie Data:** Fetched from Trakt/TMDB and cached in MongoDB to reduce API calls.
2.  **Booking Flow:**
    * User selects seats -> Booking created (Status: Pending).
    * **Inngest** starts a 10-minute timer.
    * User redirected to Stripe.
3.  **Payment Handling:**
    * **Success:** Stripe Webhook triggers -> Updates DB -> Inngest sends "Confirmed" email.
    * **Timeout/Failure:** Inngest timer ends -> Checks status -> Releases seats -> Sends "Cancelled" email.

---
