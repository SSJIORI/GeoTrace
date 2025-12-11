# GeoTrace API Server

Backend API for GeoTrace application with Supabase integration.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Environment Variables

Required variables in `.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_secret_key
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/history` - Get search history (auth required)
- `POST /api/history` - Save search (auth required)
- `DELETE /api/history` - Delete searches (auth required)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **Dev Tools**: tsx for hot reload

## Project Structure

```
server/
├── src/
│   ├── index.ts           # Main server file
│   ├── supabase.ts        # Supabase client config
│   ├── middleware/
│   │   └── auth.ts        # JWT authentication middleware
│   └── routes/
│       ├── auth.ts        # Auth endpoints
│       └── history.ts     # History endpoints
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── vercel.json           # Vercel deployment config
```

## Development

The server uses `tsx` for development with hot reload:

```bash
npm run dev
```

Any changes to TypeScript files will automatically restart the server.

## Production Build

```bash
npm run build
npm start
```

## Deployment

See `DEPLOYMENT.md` in the root directory for detailed deployment instructions.
