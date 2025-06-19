import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { taskApi } from "../lib/api";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
    queryFn: () => taskApi.getTasks(),
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, ...data }) => taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setShowEditModal(false);
      setEditingTask(null);
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: taskApi.toggleTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle task",
        variant: "destructive",
      });
    },
  });

  const handleCreateTask = (taskData) => {
    createTaskMutation.mutate(taskData);
  };

  const handleUpdateTask = (taskData) => {
    updateTaskMutation.mutate({ id: editingTask._id, ...taskData });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleToggleTask = (taskId) => {
    toggleTaskMutation.mutate(taskId);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTask(null);
  };

  // Task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleLogout = () => {
    logout();
  };

  // Quick actions
  const handleMarkAllComplete = async () => {
    const pendingTaskIds = tasks.filter(task => !task.completed).map(task => task._id);
    
    for (const taskId of pendingTaskIds) {
      try {
        await taskApi.toggleTask(taskId);
      } catch (error) {
        console.error('Failed to toggle task:', error);
      }
    }
    
    queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    toast({
      title: "Success",
      description: "All tasks marked as complete!",
    });
  };

  const handleClearCompleted = async () => {
    if (!window.confirm('Are you sure you want to delete all completed tasks?')) {
      return;
    }

    const completedTaskIds = tasks.filter(task => task.completed).map(task => task._id);
    
    for (const taskId of completedTaskIds) {
      try {
        await taskApi.deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
    
    queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    toast({
      title: "Success",
      description: "Completed tasks cleared!",
    });
  };

  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tasks.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Success",
      description: "Tasks exported successfully!",
    });
  };

  if (tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <i className="fas fa-tasks text-blue-500 text-2xl mr-3"></i>
              <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-1"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Tasks</h1>
          <p className="text-slate-600">Organize and track your daily tasks</p>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <i className="fas fa-list text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <i className="fas fa-check text-emerald-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{completedTasks}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-lg">
                <i className="fas fa-clock text-amber-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{pendingTasks}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <i className="fas fa-percentage text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Progress</p>
                <p className="text-2xl font-bold text-slate-900">{progressPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Task List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-900">Tasks</h2>
                </div>
              </div>
              <div className="divide-y divide-slate-200">
                {tasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <i className="fas fa-clipboard-list text-4xl text-slate-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks yet</h3>
                    <p className="text-slate-600">Create your first task to get started!</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Add Task Form Section */}
          <div className="lg:col-span-1">
            <TaskForm
              onSubmit={handleCreateTask}
              loading={createTaskMutation.isPending}
            />

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleMarkAllComplete}
                  disabled={pendingTasks === 0}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-check-double text-emerald-500 mr-3"></i>
                  <span className="text-slate-700">Mark all as complete</span>
                </button>
                <button
                  onClick={handleClearCompleted}
                  disabled={completedTasks === 0}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-broom text-amber-500 mr-3"></i>
                  <span className="text-slate-700">Clear completed</span>
                </button>
                <button
                  onClick={handleExportTasks}
                  disabled={totalTasks === 0}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-download text-blue-500 mr-3"></i>
                  <span className="text-slate-700">Export tasks</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-900">Edit Task</h3>
                <button
                  onClick={handleCloseEditModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              <TaskForm
                onSubmit={handleUpdateTask}
                onCancel={handleCloseEditModal}
                initialData={editingTask}
                loading={updateTaskMutation.isPending}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
