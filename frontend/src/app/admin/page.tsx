'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/api';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { toast } from 'sonner';
import { 
  Users, 
  Trash2, 
  LogOut, 
  Shield,
  User as UserIcon,
  ArrowLeft
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getAllUsers();
      setUsers(response.users);
    } catch (error: any) {
      toast.error('Failed to fetch users');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await adminApi.deleteUser(userToDelete.uuid);
      fetchUsers();
      toast.success(`User ${userToDelete.user_email} deleted successfully!`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const openDeleteDialog = (userItem: User) => {
    setUserToDelete(userItem);
    setDeleteDialogOpen(true);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === user?.uuid) {
      toast.error('Cannot change your own role');
      return;
    }

    try {
      setUpdatingRole(userId);
      await adminApi.updateUserRole(userId, newRole);
      fetchUsers();
      toast.success('User role updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="notion-page min-h-screen bg-background">
      {/* Notion-style top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Admin Panel</span>
            </div>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => router.push('/dashboard')}
              className="notion-button text-xs px-2 py-1 hover:bg-muted/60"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Dashboard
            </button>
            <ThemeToggle />
            <button onClick={handleLogout} className="notion-button text-xs px-2 py-1 hover:bg-muted/60">
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
            <Shield className="h-4 w-4" />
            <span>{user?.user_email}</span>
          </div>
          <h1 className="notion-title">Admin Panel</h1>
          <p className="text-muted-foreground">User management and system administration</p>
        </div>

        {/* Stats overview */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <div className="notion-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Users</p>
                <p className="text-xl font-bold text-foreground">{users.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {users.filter(u => u.role === 'admin').length} admin(s), {users.filter(u => u.role === 'user').length} user(s)
                </p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Users</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {users.length > 0 ? `${users.length}` : '0'}
            </span>
          </div>
          
          <div className="space-y-1">
            {users.length === 0 ? (
              <div className="notion-card p-8 text-center">
                <div className="text-muted-foreground space-y-2">
                  <Users className="h-8 w-8 mx-auto opacity-30" />
                  <p className="text-sm">No users found</p>
                </div>
              </div>
            ) : (
              users.map((userItem) => (
                <div
                  key={userItem.uuid}
                  className="group notion-block notion-hover flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-full bg-muted">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {userItem.user_email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {userItem.uuid}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Role Badge */}
                    <Badge variant={userItem.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                      {userItem.role === 'admin' ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        <>
                          <UserIcon className="h-3 w-3 mr-1" />
                          User
                        </>
                      )}
                    </Badge>
                    
                    {/* Role Selector */}
                    {userItem.uuid !== user?.uuid && (
                      <Select 
                        value={userItem.role} 
                        onValueChange={(value) => handleRoleChange(userItem.uuid, value)}
                        disabled={updatingRole === userItem.uuid}
                      >
                        <SelectTrigger className="w-20 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {/* Delete Button */}
                    {userItem.uuid !== user?.uuid && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDeleteDialog(userItem)}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.user_email}? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
      />
    </div>
  );
}