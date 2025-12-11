# 🌍 GeoTrace - IP Geolocation Tracker

A full-stack IP Geolocation and Search History tracking application with beautiful UI, interactive maps, and persistent storage.

![GeoTrace](https://img.shields.io/badge/Status-Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🔐 **User Authentication** - Secure login with JWT tokens
- 🗺️ **Interactive Maps** - Real-time IP location tracking with Leaflet
- 📊 **Search History** - Persistent storage of IP lookups with Supabase
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS
- 🔄 **Auto-fill Credentials** - Quick testing with one-click login
- 🗑️ **Bulk Operations** - Select and delete multiple history items
- 🔄 **Reset Functionality** - Quickly return to your own IP location
- 📱 **Responsive Design** - Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works!)

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Set Up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com)
2. Navigate to SQL Editor
3. Copy and paste contents from `supabase_setup.sql`
4. Click **Run**

This creates the database schema and seeds test data.

### 3. Configure Environment Variables

**Backend** (`server/.env`):
```env
SUPABASE_URL=https://ykbdznyjlzezyonlktyb.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_secret_key
PORT=8000
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open http://localhost:5173 and login with:
- **Email**: test@example.com
- **Password**: password123

## 📁 Project Structure

```
GeoTrace/
├── components/              # React components
│   ├── Dashboard.tsx       # Main dashboard with map
│   ├── LoginForm.tsx       # Authentication UI
│   └── MapComponent.tsx    # Interactive Leaflet map
├── services/
│   └── api.ts             # API client for backend
├── server/                # Backend API
│   ├── src/
│   │   ├── index.ts       # Express server
│   │   ├── supabase.ts    # Database config
│   │   ├── middleware/    # Auth middleware
│   │   └── routes/        # API endpoints
│   └── .env               # Backend environment
├── supabase_setup.sql     # Database schema
├── DEPLOYMENT.md          # Deployment guide
└── SETUP_SUMMARY.md       # Complete setup guide
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Search History (Protected)
- `GET /api/history` - Fetch all searches
- `POST /api/history` - Save new search
- `DELETE /api/history` - Delete searches

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Supabase** - PostgreSQL database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🌐 Deployment

### Deploy to Vercel

**Backend:**
```bash
cd server
vercel
```

**Frontend:**
```bash
vercel
```

See `DEPLOYMENT.md` for detailed instructions.

## 📝 Environment Variables

See `.env.example` files for all required variables.

## 🔐 Security

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Row Level Security (RLS) in Supabase
- ✅ CORS protection
- ✅ Environment variable protection

## 🧪 Testing

```bash
# Test backend health
curl http://localhost:8000/health

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📚 Documentation

- [Setup Summary](SETUP_SUMMARY.md) - Complete setup guide
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Server README](server/README.md) - Backend documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🙏 Acknowledgments

- [ipinfo.io](https://ipinfo.io) - IP geolocation API
- [OpenStreetMap](https://www.openstreetmap.org) - Map tiles
- [Supabase](https://supabase.com) - Database and auth

---

**Made with ❤️ for JLabs Internship Application**
