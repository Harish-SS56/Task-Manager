// server/storage.js

import dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env variables before anything else

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// ✅ Load MONGO_URI from environment
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("Missing MONGO_URI in environment variables.");

// 🔐 User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// ✅ Task Schema
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

// Models
const UserModel = mongoose.model('User', userSchema);
const TaskModel = mongoose.model('Task', taskSchema);

// 📦 Storage Class
export class MongoStorage {
  isConnected = false;

  async connect() {
    if (this.isConnected) return;
    try {
      await mongoose.connect(MONGO_URI, { dbName: "taskmanager" }); // optional: force db name
      console.log('✅ MongoDB Connected');
      this.isConnected = true;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async createUser(userData) {
    await this.connect();
    const hashedPassword = await bcryptjs.hash(userData.password, 12);
    const user = new UserModel({
      email: userData.email,
      password: hashedPassword
    });
    const savedUser = await user.save();
    return { ...savedUser.toObject(), _id: savedUser._id.toString() };
  }

  async getUserByEmail(email) {
    await this.connect();
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return { ...user.toObject(), _id: user._id.toString() };
  }

  async getUserById(id) {
    await this.connect();
    const user = await UserModel.findById(id);
    if (!user) return null;
    return { ...user.toObject(), _id: user._id.toString() };
  }

  async getTasks(userId) {
    await this.connect();
    const tasks = await TaskModel.find({ userId }).sort({ createdAt: -1 });
    return tasks.map(task => ({
      ...task.toObject(),
      _id: task._id.toString(),
      userId: task.userId.toString()
    }));
  }

  async createTask(taskData) {
    await this.connect();
    const task = new TaskModel(taskData);
    const savedTask = await task.save();
    return {
      ...savedTask.toObject(),
      _id: savedTask._id.toString(),
      userId: savedTask.userId.toString()
    };
  }

  async updateTask(id, updates) {
    await this.connect();
    const task = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return null;
    return {
      ...task.toObject(),
      _id: task._id.toString(),
      userId: task.userId.toString()
    };
  }

  async deleteTask(id) {
    await this.connect();
    const result = await TaskModel.findByIdAndDelete(id);
    return !!result;
  }

  async toggleTaskCompletion(id) {
    await this.connect();
    const task = await TaskModel.findById(id);
    if (!task) return null;

    task.completed = !task.completed;
    const savedTask = await task.save();
    return {
      ...savedTask.toObject(),
      _id: savedTask._id.toString(),
      userId: savedTask.userId.toString()
    };
  }
}

export const storage = new MongoStorage();
