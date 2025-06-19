import { formatDistanceToNow } from 'date-fns';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const getRelativeTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <div className="p-6 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button 
            onClick={() => onToggle(task._id)}
            className="mt-1"
          >
            {task.completed ? (
              <i className="fas fa-check-circle text-emerald-500 text-xl hover:text-emerald-600 transition-colors"></i>
            ) : (
              <i className="far fa-circle text-slate-400 text-xl hover:text-blue-500 transition-colors"></i>
            )}
          </button>
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${
              task.completed 
                ? 'text-slate-900 line-through opacity-60' 
                : 'text-slate-900'
            }`}>
              {task.title}
            </h3>
            <p className="text-slate-600 mt-1">{task.description}</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.completed 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                <i className={`fas ${task.completed ? 'fa-check' : 'fa-clock'} mr-1`}></i>
                {task.completed ? 'Completed' : 'Pending'}
              </span>
              <span className="text-xs text-slate-500">
                {getRelativeTime(task.updatedAt || task.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
