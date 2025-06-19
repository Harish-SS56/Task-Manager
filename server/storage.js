import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

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

// Storage interface for type documentation
// Methods:
// createUser(user) -> User
// getUserByEmail(email) -> User | null  
// getUserById(id) -> User | null
// getTasks(userId) -> Task[]
// createTask(task) -> Task
// updateTask(id, updates) -> Task | null
// deleteTask(id) -> boolean
// toggleTaskCompletion(id) -> Task | null

export class MongoStorage {
  isConnected = false;

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

  async createUser(userData) {
    await this.connect();
    const hashedPassword = await bcryptjs.hash(userData.password, 12);
    const user = new UserModel({
      email: userData.email,
      password: hashedPassword
    });
    const savedUser = await user.save();
    const userObj = savedUser.toObject();
    userObj._id = userObj._id.toString();
    return userObj;
  }

  async getUserByEmail(email) {
    await this.connect();
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    const userObj = user.toObject();
    userObj._id = userObj._id.toString();
    return userObj;
  }

  async getUserById(id) {
    await this.connect();
    const user = await UserModel.findById(id);
    if (!user) return null;
    const userObj = user.toObject();
    userObj._id = userObj._id.toString();
    return userObj;
  }

  async getTasks(userId) {
    await this.connect();
    const tasks = await TaskModel.find({ userId }).sort({ createdAt: -1 });
    return tasks.map(task => {
      const taskObj = task.toObject();
      taskObj._id = taskObj._id.toString();
      taskObj.userId = taskObj.userId.toString();
      return taskObj;
    });
  }

  async createTask(taskData) {
    await this.connect();
    const task = new TaskModel(taskData);
    const savedTask = await task.save();
    const taskObj = savedTask.toObject();
    taskObj._id = taskObj._id.toString();
    taskObj.userId = taskObj.userId.toString();
    return taskObj;
  }

  async updateTask(id, updates) {
    await this.connect();
    const task = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return null;
    const taskObj = task.toObject();
    taskObj._id = taskObj._id.toString();
    taskObj.userId = taskObj.userId.toString();
    return taskObj;
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
    const taskObj = savedTask.toObject();
    taskObj._id = taskObj._id.toString();
    taskObj.userId = taskObj.userId.toString();
    return taskObj;
  }
}

export const storage = new MongoStorage();
