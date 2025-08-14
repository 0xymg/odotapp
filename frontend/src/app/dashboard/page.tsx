'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { todosApi } from '@/lib/api';
import { Todo, TodoStats, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  CheckCircle, 
  Circle, 
  BarChart3,
  User,
  ListTodo,
  Shield,
  Users
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTodos();
      fetchStats();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const response = await todosApi.getTodos();
      setTodos(response.todos);
    } catch (error: any) {
      toast.error('Failed to fetch todos');
      console.error('Fetch todos error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await todosApi.getStats();
      setStats(response.stats);
    } catch (error: any) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleCreateTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      setCreating(true);
      const request: CreateTodoRequest = { content: newTodo.trim() };
      await todosApi.createTodo(request);
      setNewTodo('');
      fetchTodos();
      fetchStats();
      toast.success('Todo created successfully!');
      // Keep focus on input after creating todo
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create todo');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const request: UpdateTodoRequest = { completed: !todo.completed };
      await todosApi.updateTodo(todo.uuid, request);
      fetchTodos();
      fetchStats();
      toast.success(todo.completed ? 'Todo marked as incomplete' : 'Todo completed!');
    } catch (error: any) {
      toast.error('Failed to update todo');
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo.uuid);
    setEditingContent(todo.content);
  };

  const handleSaveEdit = async (todoId: string) => {
    if (!editingContent.trim()) return;
    
    try {
      const request: UpdateTodoRequest = { content: editingContent.trim() };
      await todosApi.updateTodo(todoId, request);
      setEditingTodo(null);
      setEditingContent('');
      fetchTodos();
      toast.success('Todo updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update todo');
    }
  };

  const handleDeleteTodo = async () => {
    if (!todoToDelete) return;
    
    try {
      await todosApi.deleteTodo(todoToDelete);
      fetchTodos();
      fetchStats();
      toast.success('Todo deleted successfully!');
    } catch (error: any) {
      toast.error('Failed to delete todo');
    }
  };

  const openDeleteDialog = (todoId: string) => {
    setTodoToDelete(todoId);
    setDeleteDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner h-8 w-8 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="notion-page min-h-screen bg-background">
      {/* Notion-style top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">ODOT</span>
            </div>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-1">
            {user?.role === 'admin' && (
              <button 
                onClick={() => router.push('/admin')}
                className="notion-button text-xs px-2 py-1"
              >
                <Users className="h-3 w-3 mr-1" />
                Users
              </button>
            )}
            <ThemeToggle />
            <button onClick={handleLogout} className="notion-button text-xs px-2 py-1">
              <LogOut className="h-3 w-3 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notion-style content area */}
      <div className="notion-content pt-16 pb-8 space-y-8">
        {/* Notion-style page header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <User className="h-4 w-4" />
            <span>{user.user_email}</span>
          </div>
          <h1 className="notion-title">Dashboard</h1>
          <p className="text-muted-foreground">Your personal productivity space</p>
        </div>

        {/* Stats overview */}
        {stats && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="notion-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
                    <p className="text-xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <ListTodo className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="notion-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
                    <p className="text-xl font-bold text-foreground">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="notion-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
                    <p className="text-xl font-bold text-foreground">{stats.pending}</p>
                  </div>
                  <Circle className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="notion-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Rate</p>
                    <p className="text-xl font-bold text-foreground">{stats.completion_rate}%</p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Add */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Quick Add</h2>
          <div className="notion-card p-4">
            <div className="flex space-x-3">
              <Plus className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <input
                ref={inputRef}
                placeholder="Add a todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo()}
                className="notion-input flex-1 border-0 p-0 focus:ring-0"
                disabled={creating}
              />
              {(creating || newTodo.trim()) && (
                <button 
                  onClick={handleCreateTodo} 
                  disabled={creating || !newTodo.trim()}
                  className="notion-button px-3 py-1 text-xs"
                >
                  {creating ? (
                    <div className="loading-spinner h-3 w-3"></div>
                  ) : (
                    'Add'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Todos</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {todos.length > 0 ? `${todos.length}` : '0'}
            </span>
          </div>
          
          <div className="space-y-1">
            {todos.length === 0 ? (
              <div className="notion-card p-8 text-center">
                <div className="text-muted-foreground space-y-2">
                  <ListTodo className="h-8 w-8 mx-auto opacity-30" />
                  <p className="text-sm">No todos yet</p>
                  <p className="text-xs">Add your first todo above to get started</p>
                </div>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.uuid}
                  className={`group notion-block notion-hover flex items-start space-x-3 ${
                    todo.completed ? 'opacity-50' : ''
                  }`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo)}
                    className="mt-0.5 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {editingTodo === todo.uuid ? (
                      <input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(todo.uuid);
                          if (e.key === 'Escape') {
                            setEditingTodo(null);
                            setEditingContent('');
                          }
                        }}
                        onBlur={() => handleSaveEdit(todo.uuid)}
                        className="notion-input border-0 p-0 focus:ring-0 w-full"
                        autoFocus
                      />
                    ) : (
                      <div 
                        onClick={() => handleEditTodo(todo)}
                        className="cursor-text py-1"
                      >
                        <p className={`text-sm leading-relaxed ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {todo.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(todo.created_at).toLocaleDateString()}
                          {todo.updated_at !== todo.created_at && (
                            <span className="ml-1">• edited</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingTodo === todo.uuid ? (
                      <div className="flex space-x-0.5">
                        <button
                          onClick={() => handleSaveEdit(todo.uuid)}
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTodo(null);
                            setEditingContent('');
                          }}
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        >
                          <Circle className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-0.5">
                        <button
                          onClick={() => openDeleteDialog(todo.uuid)}
                          className="p-1 hover:bg-destructive/10 hover:text-destructive rounded text-muted-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteTodo}
        title="Delete Todo"
        description="Are you sure you want to delete this todo? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}