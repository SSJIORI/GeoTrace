-- GeoTrace Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search History Table
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    searched_ip VARCHAR(45) NOT NULL,
    geo_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for search_history table
CREATE POLICY "Users can view their own search history" ON search_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history" ON search_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history" ON search_history
    FOR DELETE USING (auth.uid() = user_id);

-- Seed default test user
-- Password is 'password123' hashed with bcrypt (work factor 10)
INSERT INTO users (email, password_hash, created_at)
VALUES (
    'test@example.com',
    '$2b$10$AISO8Ky0K52Ir4YIon4VveBv3PGrApGYHNoVbe/Ep3jkLRDv20ZhS',
    NOW()
)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Insert some sample search history for test user
INSERT INTO search_history (user_id, searched_ip, geo_data, created_at)
SELECT 
    u.id,
    '8.8.8.8',
    '{"ip":"8.8.8.8","city":"Mountain View","region":"California","country":"US","loc":"37.4056,-122.0775","org":"Google LLC","timezone":"America/Los_Angeles"}'::jsonb,
    NOW() - INTERVAL '2 hours'
FROM users u
WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO search_history (user_id, searched_ip, geo_data, created_at)
SELECT 
    u.id,
    '1.1.1.1',
    '{"ip":"1.1.1.1","city":"Los Angeles","region":"California","country":"US","loc":"34.0522,-118.2437","org":"Cloudflare Inc","timezone":"America/Los_Angeles"}'::jsonb,
    NOW() - INTERVAL '1 hour'
FROM users u
WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON search_history TO authenticated;