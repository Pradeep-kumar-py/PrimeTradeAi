'use client';

import type { Todo } from '@/lib/types';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Todo['status']) => void;
}

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const priorityColors = {
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function TodoCard({ todo, onEdit, onDelete, onStatusChange }: TodoCardProps) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded p-4 hover:border-[#3B82F6]/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{todo.title}</h3>
          {todo.description && (
            <p className="text-[#94A3B8] text-sm mt-1 line-clamp-2">{todo.description}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <span className={`px-2 py-1 text-xs font-medium rounded border ${statusColors[todo.status]}`}>
              {todo.status}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded border ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={todo.status}
            onChange={(e) => onStatusChange(todo._id, e.target.value as Todo['status'])}
            className="bg-[#0F172A] border border-[#334155] text-[#94A3B8] text-xs rounded px-2 py-1 focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#334155] rounded transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-[#334155] rounded transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
