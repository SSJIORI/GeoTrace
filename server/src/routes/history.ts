import { Router, Response } from 'express';
import { supabase } from '../supabase.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/history - Fetch user's search history
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const { data: history, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        message: 'Failed to fetch search history' 
      });
    }

    res.json(history || []);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'An error occurred while fetching history' 
    });
  }
});

// POST /api/history - Save a new search
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { searched_ip, geo_data } = req.body;

    if (!searched_ip || !geo_data) {
      return res.status(400).json({ 
        error: 'Missing data', 
        message: 'searched_ip and geo_data are required' 
      });
    }

    const { data: newEntry, error } = await supabase
      .from('search_history')
      .insert([
        {
          user_id: userId,
          searched_ip,
          geo_data
        }
      ])
      .select()
      .single();

    if (error || !newEntry) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        message: 'Failed to save search history' 
      });
    }

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Save history error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'An error occurred while saving history' 
    });
  }
});

// DELETE /api/history - Delete search history entries
router.delete('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { ids } = req.body; // Array of IDs to delete

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        error: 'Missing data', 
        message: 'ids array is required' 
      });
    }

    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId)
      .in('id', ids);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        message: 'Failed to delete search history' 
      });
    }

    res.json({ 
      success: true, 
      message: `Deleted ${ids.length} entries` 
    });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'An error occurred while deleting history' 
    });
  }
});

export default router;
