# 🎓 Campus Events Platform

A role-based campus event management platform that enables **college clubs to create and manage events** and allows **students to discover and register for events**, enhanced with **AI-powered event description improvement using Google Gemini**.

Built as part of **TechSprint 2025 – GDG On Campus**.

---

## 🚀 Problem Statement

In many colleges, event information is scattered across WhatsApp groups, posters, and social media, leading to:
- Missed events
- Lack of centralized information
- Manual and unorganized registrations
- No clear separation between clubs and students

---

## 💡 Our Solution

**Campus Connect** provides a **single centralized web platform** where:

- Clubs can create, edit, and manage events
- Students can easily browse, filter, and register for events
- Event descriptions can be enhanced using **AI (Google Gemini)** for clarity and engagement
- Registrations are tracked securely and uniquely

---

## 🎯 Key Features

### 👥 Role-Based Access
- **Club Accounts**
  - Create events
  - Edit & delete own events
  - Set optional registration limits
  - View event registrations
- **Student Accounts**
  - Browse events
  - Register for events
  - Prevent duplicate registrations

---

### 📅 Smart Event Listing
- Events grouped into:
  - **Today**
  - **Tomorrow**
  - **Upcoming**
- Completed events excluded from active listings

---

### 🔍 Advanced Search & Filters
- Search events by title
- Filter by club name
- Filter by date

---

### 🤖 AI-Powered Description Enhancement (Google Gemini)
- Clubs can write a basic event description
- Click **“Improve Description with AI”**
- Google Gemini enhances clarity, tone, and engagement
- Improves event reach and readability

---

### 🔐 Secure Authentication
- Email & password authentication
- Role stored securely in database
- Protected routes based on role

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **React Router**
- **React Hot Toast**

### Backend & Database
- **Supabase**
  - Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)

### AI Integration
- **Google Gemini API**
  - Model: `gemini-2.5-flash-lite`
  - Used for AI-based event description enhancement

---

## 🧠 Google Technologies Used

- **Google Gemini AI**
  - AI-assisted content generation
  - Improves event descriptions dynamically

---

## 🔄 Process Flow

1. User visits platform
2. Registers / Logs in as **Student** or **Club**
3. **Club**
   - Creates event
   - Uses AI to enhance description
4. **Student**
   - Browses events
   - Registers for events
5. Platform manages registrations securely

---

## 🧩 Architecture Overview

Frontend (React + Tailwind)
|
v
Supabase Auth ----> Supabase Database
|
v
Google Gemini API (AI Description Enhancement)


---

## 📸 MVP Snapshots

> Screenshots to be added:
- Landing Page
- Login & Register
- Event Dashboard
- Create Event (AI Feature)
- Event Registration Modal

---

## 🌱 Future Enhancements

- Past events rating & feedback system
- Admin dashboard
- Event analytics for clubs
- Email / notification reminders
- QR-based event check-in
- Calendar integration

---

## 🔗 MVP Link

👉 **Deployed Website:** _(Add your deployed URL here)_

---

## 📂 Repository

This repository contains the complete source code for the project.

---

## 👩‍💻 Developed By

**Harshitha Bolisetty**  
B.Tech CSE (AI & ML)  
VIT-AP University  

---

## 🏁 Conclusion

Campus Events Platform simplifies campus event management by combining:
- Clean UI
- Secure backend
- Role-based access
- AI-powered enhancements

Making campus events **organized, discoverable, and engaging**.

---

⭐ *Built with passion for TechSprint 2025*
