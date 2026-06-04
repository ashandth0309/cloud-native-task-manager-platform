import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it to your environment variables.');
  }

  mongoose.connection.on('connected', () => {
    console.log('[database] MongoDB connected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('[database] MongoDB connection error:', error.message);
  });

  await mongoose.connect(mongoUri);
}
