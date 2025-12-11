# GeoTrace Backend & Database Setup Guide

## Part 2: Database Setup (Supabase)

### Step 1: Set up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: https://ykbdznyjlzezyonlktyb.supabase.co
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase_setup.sql`
5. Click **Run** to execute the SQL

This will create:
- `users` table with authentication
- `search_history` table for storing IP searches
- Row Level Security (RLS) policies
- Test user: `test@example.com` / `password123`
- Sample search history data

### Step 2: Get Supabase Credentials

1. In your Supabase project, go to **Settings** > **API**
2. Copy the following:
   - Project URL: `https://ykbdznyjlzezyonlktyb.supabase.co`
   - `anon` public key (for client-side)
   - `service_role` key (for server-side - keep secret!)

---

## Part 3: Backend API Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your values:
```env
SUPABASE_URL=https://ykbdznyjlzezyonlktyb.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_random_secret_key_here
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Run the Development Server

```bash
npm run dev
```

The API will start at `http://localhost:8000`

### Step 4: Test the API

Health check:
```bash
curl http://localhost:8000/health
```

Login:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Part 4: Frontend Setup

### Step 1: Configure Frontend Environment

1. In the root directory (not server), create `.env`:
```bash
cp .env.example .env
```

2. Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Step 2: Install and Run Frontend

```bash
# In root directory
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`

---

## API Endpoints

### Authentication

**POST** `/api/auth/login`
- Body: `{ "email": "string", "password": "string" }`
- Returns: `{ "token": "string", "user": { "id": "string", "email": "string" } }`

**POST** `/api/auth/register`
- Body: `{ "email": "string", "password": "string" }`
- Returns: `{ "token": "string", "user": { "id": "string", "email": "string" } }`

### Search History (Requires Authentication)

**GET** `/api/history`
- Headers: `Authorization: Bearer <token>`
- Returns: Array of search history items

**POST** `/api/history`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "searched_ip": "string", "geo_data": {} }`
- Returns: Created history item

**DELETE** `/api/history`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "ids": ["string"] }`
- Returns: Success message

---

## Part 5: Deployment to Vercel

### Deploy Backend API

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy the backend:
```bash
cd server
vercel
```

3. Set environment variables in Vercel Dashboard:
   - Go to your project settings
   - Add all variables from `.env`

4. Your API URL will be something like: `https://your-project.vercel.app`

### Deploy Frontend

1. Update frontend `.env` with production API URL:
```env
VITE_API_URL=https://your-api.vercel.app
```

2. Deploy frontend:
```bash
# In root directory
vercel
```

3. Your frontend will be at: `https://your-frontend.vercel.app`

### Update CORS

After deployment, update the backend `.env`:
```env
FRONTEND_URL=https://your-frontend.vercel.app
```

Redeploy the backend for changes to take effect.

---

## Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend domain
- Check that `credentials: true` is set in CORS config

### Authentication Issues
- Verify JWT_SECRET is set and consistent
- Check token is being sent in `Authorization: Bearer <token>` header
- Ensure token hasn't expired (7-day expiry)

### Database Issues
- Verify RLS policies are enabled
- Check that user_id matches authenticated user
- Ensure Supabase credentials are correct

### Connection Issues
- Verify API_BASE_URL is correct in frontend
- Check that backend server is running
- Test with `curl` to isolate frontend/backend issues

---

## Security Notes

1. **Never commit `.env` files** - they contain secrets
2. **Use strong JWT_SECRET** - generate with `openssl rand -base64 32`
3. **HTTPS in production** - Vercel provides this automatically
4. **Keep service_role key secret** - only use server-side
5. **Validate all inputs** - prevent SQL injection and XSS

---

## Test Credentials

- Email: `test@example.com`
- Password: `password123`

---

For questions or issues, refer to:
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Docs](https://expressjs.com/)
- [Vercel Docs](https://vercel.com/docs)
