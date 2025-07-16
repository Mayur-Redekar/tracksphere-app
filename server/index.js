import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/someRoute.js';
import userRoutes from './routes/users.js';
import profileRoutes from './routes/profile.js';
import certificationRoutes from './routes/certifications.js';
import adminRoutes from './routes/adminRoutes.js';
import path from 'path';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Log requests
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// SSE clients array
const sseClients = [];

// SSE endpoint for user events
app.get('/api/users/events', (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Send initial comment to keep connection alive
  res.write(':ok\n\n');

  // Add this client to sseClients array
  sseClients.push(res);

  // Remove client on connection close
  req.on('close', () => {
    const index = sseClients.indexOf(res);
    if (index !== -1) sseClients.splice(index, 1);
  });
});

// Store clients in app for access in controllers
app.set('sseClients', sseClients);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/admin-stats', adminRoutes);

// Static files
app.use('/uploads', express.static(path.resolve('uploads')));

// JSON error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ msg: 'Invalid JSON body' });
  }
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('TrackSphere Backend Running ');
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
