# 🚑 Community Health Emergency App

An AI-powered emergency response system for community health, featuring real-time dashboards, reporting, AI health assistant, maps, and emergency contacts.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/aleen42/PersonalWiki/master/images/animated/ambulance.gif" alt="Ambulance Animation" width="120"/>
</p>

---

## ✨ Features

- **Emergency Dashboard:** View active emergencies, responders, and resources.
- **AI Health Assistant:** Chatbot for emergency guidance and health information.
- **Emergency Reporting:** Submit emergency reports with location and details.
- **Community Health Map:** Visualize emergencies and health resources.
- **Emergency Contacts:** Quick access to emergency numbers and support lines.
- **Health Resources:** First aid guides and health facility info.
- **Real-time Updates:** Socket.io for live emergency alerts.

## 🏗️ Architecture

```
+-------------------+      +-------------------+      +-------------------+
|   React Frontend  |<---->|   Express Backend |<---->|   MongoDB Atlas   |
| (Vite, Tailwind)  |      | (Node.js, Socket) |      |                   |
+-------------------+      +-------------------+      +-------------------+
         |                        |                           |
         |                        |                           |
         v                        v                           v
+-------------------+   +-------------------+   +-------------------+
|   OpenAI API      |   |   Twilio API      |   |   Mapbox API      |
| (AI Assistant)    |   | (SMS/Calls)       |   | (Maps)            |
+-------------------+   +-------------------+   +-------------------+
```

- **Frontend** communicates with **Backend** via REST API and WebSockets.
- **Backend** handles business logic, authentication, and real-time updates.
- **MongoDB Atlas** stores user, emergency, and health data.
- **OpenAI**, **Twilio**, and **Mapbox** are integrated for AI, messaging, and mapping features.

## 📁 Project Structure

```
AI_DEMO/
│
├── server/                # Backend (Express, MongoDB, APIs)
│   ├── .env               # Environment variables
│   ├── index.js           # Entry point
│   ├── routes/            # API route handlers
│   ├── models/            # Mongoose models
│   ├── controllers/       # Business logic
│   └── utils/             # Utility functions
│
├── client/                # Frontend (React, Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page views
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   └── public/            # Static assets
│
├── README.md              # Project documentation
└── package.json           # Project metadata
```

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Express, MongoDB, Socket.io, OpenAI API (optional)
- **Other:** Twilio (optional), Mapbox (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- MongoDB Atlas account (or local MongoDB)
- (Optional) OpenAI, Twilio, Mapbox accounts for integrations

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/ai-emergency-health.git
   cd ai-emergency-health
   ```

2. **Install frontend dependencies:**
   ```sh
   npm install
   ```

3. **Install backend dependencies:**
   ```sh
   cd server
   npm install
   cd ..
   ```

4. **Configure environment variables:**
   - Edit [`server/.env`](server/.env) with your credentials.

### Running Locally

#### Start Backend

```sh
cd server
npm run dev
```

#### Start Frontend

```sh
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

### API Endpoints

See [`server/routes`](server/routes) for available endpoints:
- `/api/emergencies`
- `/api/auth`
- `/api/users`
- `/api/ai`
- `/api/health`

### Environment Variables

See [`server/.env`](server/.env) for required variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY` (optional)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (optional)
- `MAPBOX_ACCESS_TOKEN` (optional)
- `FRONTEND_URL`

## 🌐 Deployment

- Deploy backend to Railway, Heroku, or similar.
- Deploy frontend to Vercel, Netlify, or similar.

## 📜 License

MIT

## ⚠️ Disclaimer

This app is for demonstration purposes only. Always call 911 for emergencies and consult healthcare professionals.
