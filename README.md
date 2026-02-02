# 🏥 AI-Powered Health Care & Appointment Management System

A full-stack healthcare management platform that streamlines doctor–patient interactions, appointment scheduling, secure video consultations, and medical data handling with role-based access.

---

## 📌 Overview

This system provides a centralized platform for patients, doctors, and administrators to manage healthcare workflows efficiently. It supports real-time communication, appointment management, dashboards, and secure data access.

---

## 🚀 Features

### Patient Module
- User registration and authentication
- Book, view, and manage appointments
- Upload and view medical reports
- Join real-time video consultations
- View appointment history

### Doctor Module
- Profile and availability management
- Manage time slots and appointments
- Conduct secure video consultations
- Access patient medical reports
- Filter appointments (today / upcoming)

### Admin Module
- Admin dashboard with analytics
- Approve or reject doctor applications
- Manage users, doctors, and appointments
- Monitor system activity

### Real-Time Video Consultation
- Room-based one-to-one video calls
- WebRTC for media communication
- Socket.io for real-time signaling

---

## 🧠 AI Health Assistant
- Basic AI chatbot for health guidance
- Designed for future ML model integration
- Non-diagnostic assistance only

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Chart.js
- Socket.io Client

### Backend
- Node.js
- Express.js
- Socket.io
- WebRTC

### Database
- MongoDB (Mongoose)

### Security
- JWT Authentication
- Role-based Access Control

---

## 🧱 System Architecture

Frontend → REST API / WebSocket → Backend → MongoDB  
                                → WebRTC + Socket.io

---

## 👥 User Roles

| Role     | Permissions |
|---------|-------------|
| Patient | Appointments, Reports, Video Calls |
| Doctor  | Availability, Consultations, Patient Data |
| Admin   | Full System Management |

---

## 👥 Folder Structure

frontend/
├── components
├── pages
├── context
└── assets

backend/
├── controllers
├── routes
├── models
├── middleware
└── socket

---

## ⚙️ Installation

### Prerequisites
- Node.js
- MongoDB
- Git

### Backend Setup
cd backend
npm install
npm run dev

### Frontend Setup
cd client
npm install
npm run dev

## 📂 Project Structure

