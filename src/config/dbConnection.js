import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected successfully to database');
  } catch (err) {
    console.error('Error connecting to the database: ', err);
  }
};

export default connectDB;
