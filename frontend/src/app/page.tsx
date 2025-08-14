'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Zap, Sparkles, Shield, Rocket, ArrowRight, Github, Twitter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="loading-spinner h-8 w-8 text-muted-foreground"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background notion-page">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
        <div className="container-responsive py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-semibold text-foreground tracking-tight">ODOT</span>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm hover:bg-muted/60">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-sm shadow-sm hover:shadow-md transition-all duration-200">
                  Get Started
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none"></div>
        
        <div className="relative container-responsive py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="h-3 w-3 text-primary mr-2" />
              <span className="text-xs font-medium text-primary">New: Real-time sync</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 tracking-tight">
              Think better,
              <br />
              <span className="bg-gradient-to-r text to-primary/70 bg-clip-text ">
                Complete smarter
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              The only todo app that adapts to your thinking. Clean, fast, and distraction-free. 
              Built for people who care about their productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-200">
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-12 px-8 text-base notion-hover">
                  See how it works
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Free forever
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="container-responsive py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Everything you need, nothing you don't
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to enhance your productivity without overwhelming your workflow.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="notion-card border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 mb-4 w-fit">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Simple & Clean</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    A distraction-free interface that lets you focus on what matters. 
                    No unnecessary complexity, just pure productivity.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="notion-card border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 mb-4 w-fit">
                    <Rocket className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    Built for speed with modern technology. Instant sync, 
                    responsive design, and seamless performance across devices.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="notion-card border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 mb-4 w-fit">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    Your data stays private with end-to-end encryption 
                    and secure authentication. We never see your todos.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="border-t border-border/40">
        <div className="container-responsive py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                See ODOT in action
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the clean, intuitive interface that makes task management effortless.
              </p>
            </div>
            
            <div className="relative">
              <div className="notion-card p-1 bg-gradient-to-br from-border to-border/50">
                <div className="bg-card rounded-lg p-8 border border-border/50">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="notion-block p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-foreground">Complete project presentation</span>
                      </div>
                    </div>
                    <div className="notion-block p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-4 w-4 rounded border border-border"></div>
                        <span className="text-foreground">Review team feedback</span>
                      </div>
                    </div>
                    <div className="notion-block p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-4 w-4 rounded border border-border"></div>
                        <span className="text-foreground">Plan next quarter goals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container-responsive py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to transform your productivity?
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Join thousands of users who have already simplified their workflow with ODOT.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-200">
                  Get started for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/10">
        <div className="container-responsive py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-semibold text-foreground">ODOT</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  The simple, powerful todo app that adapts to your thinking. 
                  Built with love using Next.js and TypeScript.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Product</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                    <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                    <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Support</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                    <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                    <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2025 ODOT. All rights reserved.
              </p>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}