import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import type { User, Task, InsertUser, InsertTask } from '@shared/schema';

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hk6113367:e5MCNR4JtF9JZdfr@taskmanager.nstysiz.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Taskmanager";

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Task Schema
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);
const TaskModel = mongoose.model('Task', taskSchema);

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  
  // Task methods
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;
  toggleTaskCompletion(id: string): Promise<Task | null>;
}

export class MongoStorage implements IStorage {
  private isConnected = false;

  async connect() {
    if (this.isConnected) return;
    
    try {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB Connected');
      this.isConnected = true;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    await this.connect();
    const hashedPassword = await bcryptjs.hash(userData.password, 12);
    const user = new UserModel({
      email: userData.email,
      password: hashedPassword
    });
    const savedUser = await user.save();
    return savedUser.toObject();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.connect();
    const user = await UserModel.findOne({ email });
    return user ? user.toObject() : null;
  }

  async getUserById(id: string): Promise<User | null> {
    await this.connect();
    const user = await UserModel.findById(id);
    return user ? user.toObject() : null;
  }

  async getTasks(userId: string): Promise<Task[]> {
    await this.connect();
    const tasks = await TaskModel.find({ userId }).sort({ createdAt: -1 });
    return tasks.map(task => task.toObject());
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    await this.connect();
    const task = new TaskModel(taskData);
    const savedTask = await task.save();
    return savedTask.toObject();
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    await this.connect();
    const task = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
    return task ? task.toObject() : null;
  }

  async deleteTask(id: string): Promise<boolean> {
    await this.connect();
    const result = await TaskModel.findByIdAndDelete(id);
    return !!result;
  }

  async toggleTaskCompletion(id: string): Promise<Task | null> {
    await this.connect();
    const task = await TaskModel.findById(id);
    if (!task) return null;
    
    task.completed = !task.completed;
    const savedTask = await task.save();
    return savedTask.toObject();
  }
}

export const storage = new MongoStorage();
