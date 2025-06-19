import { createServer } from "http";
import { storage } from "./storage.js";
import { authMiddleware, generateToken } from "./middleware/auth.js";
import bcryptjs from 'bcryptjs';
import cors from 'cors';

export async function registerRoutes(app) {
  // Enable CORS
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Auth Routes
  app.post('/api/register', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await storage.createUser({ email, password });
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { _id: user._id, email: user.email }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: { _id: user._id, email: user.email }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Protected Task Routes
  app.get('/api/tasks', authMiddleware, async (req, res) => {
    try {
      const tasks = await storage.getTasks(req.userId);
      res.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/tasks', authMiddleware, async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }

      const task = await storage.createTask({
        userId: req.userId,
        title,
        description,
        completed: false
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const task = await storage.updateTask(id, { title, description });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTask(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.patch('/api/tasks/:id/toggle', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.toggleTaskCompletion(id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Toggle task error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get current user
  app.get('/api/me', authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUserById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ _id: user._id, email: user.email });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
