# ⚡ EDSA Electricity Management System

A comprehensive multi-role electricity distribution management system built for the **Electricity Distribution and Supply Authority (EDSA)** of Sierra Leone.

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Python](https://img.shields.io/badge/python-3.11-blue)
![React](https://img.shields.io/badge/react-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)

---

## 🎯 Overview

EDSA Management System is a full-stack, production-grade application providing **6 role-based dashboards** with real-time notifications, fraud detection, and comprehensive operational tools.

**47 REST API endpoints** | **6 user roles** | **60+ pages** | **Real-time WebSocket**

---

## 👥 Six Role-Based Portals

| Role | Description | Demo Credentials |
|------|-------------|------------------|
| 🔧 **Administrator** | Full system control, users, audit logs | `admin` / `admin123` |
| 💻 **IT Manager** | System health, security, fraud intelligence | `it_manager` / `it123` |
| 📋 **Operations Manager** | Approvals, complaints, work orders | `ops_manager` / `ops123` |
| 🏆 **Executive** | Revenue, strategic reports, approvals | `executive_peter` / `executive123` |
| 👤 **Staff** | Client search, meters, payments | `staff_billing` / `staff123` |
| 🏠 **Client** | Tokens, bills, complaints, outages | `client_john` / `client123` |

---

## ✨ Key Features

- 🛡️ **Revenue Protection** — AI-based fraud risk scoring & anomaly detection
- 🔔 **Real-time Notifications** — WebSocket-powered via Socket.io
- 🗺️ **Interactive Outage Map** — Leaflet-based visualization
- 💰 **Billing & Payments** — Multi-currency (SLL/USD), token generation
- 📋 **Complaint Management** — Full lifecycle tracking
- 🔧 **Work Order System** — Assignment & escalation
- 📊 **Analytics Dashboard** — Chart.js visualizations
- 🔍 **Audit Logging** — Complete action trail
- 💚 **System Health** — Real-time monitoring
- 📱 **Responsive Design** — Works on all devices

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — Modern UI
- **Ant Design** — Enterprise components
- **Tailwind CSS** — Utility styling
- **Zustand** — State management
- **Chart.js** — Data visualization
- **Leaflet** — Interactive maps
- **Socket.io Client** — Real-time updates

### Backend
- **FastAPI** — Modern Python framework
- **Socket.io** — Real-time communication
- **Uvicorn** — ASGI server
- **Pydantic** — Data validation

### Infrastructure
- **Docker** — Containerization
- **Nginx** — Reverse proxy
- **GitHub** — Version control
- **Vercel** — Frontend hosting (planned)
- **Railway** — Backend hosting (planned)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate           # Windows
# source venv/bin/activate      # Mac/Linux
pip install -r requirements.txt
python -m uvicorn app.main:socket_app --reload --port 8000