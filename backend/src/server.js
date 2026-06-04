import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] API running on port ${PORT}`);
  });
} catch (error) {
  console.error('[startup] Failed to start server:', error.message);
  process.exit(1);
}
