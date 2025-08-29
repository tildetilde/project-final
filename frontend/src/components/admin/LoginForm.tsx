import React, { useState } from 'react';
import { Heading, Button, Card, Input, Label, ErrorMessage } from '../../ui';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onLogin(formData.username, formData.password);
    if (result.success) {
      setFormData({ username: '', password: '' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
        <div className="relative z-10">
          <div className="pt-10 sm:pt-16 pb-8 sm:pb-12">
            <div className="text-xs sm:text-sm tracking-wider uppercase text-muted-foreground">
              Admin Access
            </div>
            <Heading
              level={1}
              className="leading-[0.95] text-foreground"
              style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
            >
              Admin Login
            </Heading>
            <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorMessage message={error} />}
                
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginForm;
