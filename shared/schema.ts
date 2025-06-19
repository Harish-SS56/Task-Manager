// MongoDB schema types for Task Manager
export interface User {
  _id?: string;
  email: string;
  password: string;
  createdAt?: Date;
}

export interface Task {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InsertUser {
  email: string;
  password: string;
}

export interface InsertTask {
  userId: string;
  title: string;
  description: string;
  completed?: boolean;
}
