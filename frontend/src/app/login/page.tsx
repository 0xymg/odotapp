'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const loginSchema = z.object({
  user_email: z.string().email('Invalid email address'),
  user_pwd: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user_email: '',
      user_pwd: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);
      login(response.user, response.token);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="notion-page min-h-screen flex items-center justify-center bg-background">
      <div className="notion-card w-full max-w-md">
        <div className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="user_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                      <FormControl>
                        <input 
                          placeholder="Enter your email" 
                          type="email" 
                          className="notion-input"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_pwd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                      <FormControl>
                        <input 
                          placeholder="Enter your password" 
                          type="password" 
                          className="notion-input"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button 
                  type="submit" 
                  className="notion-button w-full h-11 justify-center bg-primary text-primary-foreground hover:bg-primary/90 border-primary hover:border-primary/90" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </Form>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-foreground hover:underline">
                Sign up
              </Link>
            </div>

            {/* Test Credentials */}
            <div className="space-y-3 p-4 rounded-md bg-muted/30 border border-dashed border-muted-foreground/20">
              <p className="text-xs text-muted-foreground font-medium">Test Accounts:</p>
              <div className="grid gap-2">
                <div 
                  className="p-2 rounded text-xs bg-card border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    form.setValue('user_email', 'test@example.com');
                    form.setValue('user_pwd', 'password123');
                  }}
                >
                  <div className="font-medium text-foreground">Regular User</div>
                  <div className="text-muted-foreground">test@example.com / password123</div>
                </div>
                <div 
                  className="p-2 rounded text-xs bg-card border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    form.setValue('user_email', 'admin@odotapp.com');
                    form.setValue('user_pwd', 'admin123');
                  }}
                >
                  <div className="font-medium text-foreground flex items-center">
                    <span>Admin User</span>
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary text-primary-foreground rounded">ADMIN</span>
                  </div>
                  <div className="text-muted-foreground">admin@odotapp.com / admin123</div>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">Click to auto-fill credentials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}