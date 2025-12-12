# GeoTrace - Vercel Deployment Guide

## Prerequisites

1. [Vercel CLI](https://vercel.com/docs/cli) installed: `npm i -g vercel`
2. Vercel account (free tier works)
3. Supabase database already set up with SQL script executed

---

## Step 1: Deploy Backend API

### 1.1 Navigate to server directory
```bash
cd server
```

### 1.2 Login to Vercel
```bash
vercel login
```

### 1.3 Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: geotrace-api (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

### 1.4 Set Environment Variables

Go to your Vercel dashboard → Your project → Settings → Environment Variables

Add these variables for **Production, Preview, and Development**:

```
SUPABASE_URL=https://ykbdznyjlzezyonlktyb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYmR6bnlqbHplenlvbmxrdHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTkxNTgsImV4cCI6MjA4MTAzNTE1OH0.OXbQLmG3S5S766yjvlWLb6lJ1vreDSbEwQu97WkuGFw
SUPABASE_SERVICE_KEY=sb_secret_m01M8oXyQ6roGY8FuGAAxQ_xtwVpX19
JWT_SECRET=geotrace_jwt_secret_key_change_in_production_2024
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Important**: Update `FRONTEND_URL` after deploying the frontend (Step 2)

### 1.5 Redeploy with environment variables
```bash
vercel --prod
```

Copy your API URL (e.g., `https://geotrace-api.vercel.app`)

---

## Step 2: Deploy Frontend

### 2.1 Navigate to root directory
```bash
cd ..
# (You should be in the GeoTrace root directory)
```

### 2.2 Update .env for production

Create `.env.production`:
```bash
VITE_API_URL=https://your-backend-api.vercel.app
```

Replace with your actual backend URL from Step 1.5

### 2.3 Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: geotrace (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

### 2.4 Set Environment Variables

Go to Vercel dashboard → GeoTrace project → Settings → Environment Variables

Add:
```
VITE_API_URL=https://your-backend-api.vercel.app
```

### 2.5 Deploy to production
```bash
vercel --prod
```

Copy your frontend URL (e.g., `https://geotrace.vercel.app`)

---

## Step 3: Update Backend CORS

### 3.1 Update backend environment variable

Go to Vercel dashboard → Backend API project → Settings → Environment Variables

Update `FRONTEND_URL` to your actual frontend URL:
```
FRONTEND_URL=https://geotrace.vercel.app
```

### 3.2 Redeploy backend
```bash
cd server
vercel --prod
```

---

## Step 4: Test Production Deployment

1. Visit your frontend URL: `https://geotrace.vercel.app`
2. Login with: `test@example.com` / `password123`
3. Test IP tracking functionality
4. Verify search history is saved

---

## Quick Deploy Commands

### Deploy both frontend and backend:

```bash
# Backend
cd server
vercel --prod

# Frontend
cd ..
vercel --prod
```

---

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your actual frontend domain
- Check Vercel logs for CORS-related errors
- Ensure all origins are listed in `server/src/index.ts`

### API Not Responding
- Check Vercel Functions logs in dashboard
- Verify all environment variables are set
- Test endpoint: `https://your-api.vercel.app/health`

### Database Connection Issues
- Verify Supabase credentials are correct
- Check Supabase logs for connection errors
- Ensure IP allowlist includes Vercel (or allow all for testing)

### Build Failures
- Check build logs in Vercel dashboard
- Verify `package.json` scripts are correct
- Ensure all dependencies are in `dependencies` not `devDependencies`

---

## Environment Variables Summary

### Backend (server/.env)
```env
SUPABASE_URL=https://ykbdznyjlzezyonlktyb.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## Post-Deployment

1. **Update DNS** (if using custom domain)
2. **Monitor Logs**: Check Vercel dashboard for errors
3. **Test All Features**: Login, search, history, delete
4. **Enable Analytics**: Optional Vercel Analytics
5. **Set up CI/CD**: Connect GitHub for auto-deploy

---

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel remove [deployment-url]
```

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- Check logs in Vercel dashboard for errors

---

🎉 **Your GeoTrace application is now live!**
