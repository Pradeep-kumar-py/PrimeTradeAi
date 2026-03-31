'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TodoCard from '@/components/TodoCard';
import TodoForm from '@/components/TodoForm';
import api from '@/lib/api';
import type { Todo } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/todos');
      setTodos(response.data.todos);
    } catch {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTodos();
  }, [router, fetchTodos]);

  const handleCreateOrUpdate = async (data: { title: string; description: string; priority: Todo['priority']; status: Todo['status'] }) => {
    try {
      if (editingTodo) {
        const response = await api.put(`/api/v1/todos/${editingTodo._id}`, data);
        setTodos(todos.map(t => t._id === editingTodo._id ? response.data.todo : t));
      } else {
        const response = await api.post('/api/v1/todos', data);
        setTodos([response.data.todo, ...todos]);
      }
      setShowForm(false);
      setEditingTodo(null);
    } catch {
      setError('Failed to save todo');
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/api/v1/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch {
      setError('Failed to delete todo');
    }
  };

  const handleStatusChange = async (id: string, status: Todo['status']) => {
    try {
      const response = await api.put(`/api/v1/todos/${id}`, { status });
      setTodos(todos.map(t => t._id === id ? response.data.todo : t));
    } catch {
      setError('Failed to update status');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-[#94A3B8]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-[#3B82F6] text-white rounded font-medium hover:bg-[#2563EB] transition-colors flex items-center gap-2"
            >
              <span>+</span> New Task
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
              <button onClick={() => setError('')} className="ml-4 underline">Dismiss</button>
            </div>
          )}

          {todos.length === 0 ? (
            <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-12 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-white mb-2">No tasks yet</h3>
              <p className="text-[#94A3B8] mb-6">Create your first task to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-[#3B82F6] text-white rounded font-medium hover:bg-[#2563EB] transition-colors"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {todos.map(todo => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
