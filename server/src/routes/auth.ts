import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabase.js';

const router = Router();

interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/login
router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials', 
        message: 'Email and password are required' 
      });
    }

    // Fetch user from database
    const { data: users, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        error: 'Database error', 
        message: 'Failed to query user' 
      });
    }

    const user = users && users.length > 0 ? users[0] : null;

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials', 
        message: 'User not found or incorrect password' 
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials', 
        message: 'User not found or incorrect password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'fallback_secret_change_in_production',
      { expiresIn: '7d' }
    );

    // Return success response
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'An error occurred during login' 
    });
  }
});

// POST /api/auth/register (optional - for future use)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing fields', 
        message: 'Email and password are required' 
      });
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({ 
        error: 'User exists', 
        message: 'An account with this email already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { 
          email: email.toLowerCase(), 
          password_hash: passwordHash 
        }
      ])
      .select()
      .single();

    if (insertError || !newUser) {
      console.error('Insert error:', insertError);
      return res.status(500).json({ 
        error: 'Registration failed', 
        message: 'Could not create user account' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback_secret_change_in_production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'An error occurred during registration' 
    });
  }
});

export default router;
