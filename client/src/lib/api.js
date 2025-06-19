const API_BASE = '';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
};

// Task API functions
export const taskApi = {
  getTasks: () => apiRequest('/api/tasks'),
  
  createTask: (taskData) => apiRequest('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  }),
  
  updateTask: (id, taskData) => apiRequest(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  }),
  
  deleteTask: (id) => apiRequest(`/api/tasks/${id}`, {
    method: 'DELETE'
  }),
  
  toggleTask: (id) => apiRequest(`/api/tasks/${id}/toggle`, {
    method: 'PATCH'
  })
};
