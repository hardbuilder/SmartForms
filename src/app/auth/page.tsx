
"use client";

import React, { useState, useEffect } from 'react';
import './auth.css';
import { User, Lock, Mail as MailIcon, PencilRuler } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the sign-up logic
    // For now, we'll just switch back to sign-in mode
    setIsSignUpMode(false);
  };


  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className={cn("auth-container", isSignUpMode ? "sign-up-mode" : "", mounted && theme === 'dark' ? 'dark' : '')}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form action="#" className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <User className="icon" />
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <Lock className="icon" />
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>

          {/* Sign Up Form */}
          <form action="#" className="sign-up-form" onSubmit={handleSignUp}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <User className="icon" />
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <MailIcon className="icon" />
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-field">
              <Lock className="icon" />
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" value="Sign up" className="btn" />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Join us today! Create your account to start building beautiful, intelligent forms with ease.
            </p>
            <button className="btn transparent" id="sign-up-btn" onClick={() => setIsSignUpMode(true)}>
              Sign up
            </button>
          </div>
          <div className="flex items-center justify-center mt-4 text-white image-logo">
            <PencilRuler className="h-12 w-12" />
            <span className="ml-4 text-3xl font-bold">SmartForms</span>
          </div>
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>
             Welcome back! Sign in to access your dashboard and manage your forms.
            </p>
            <button className="btn transparent" id="sign-in-btn" onClick={() => setIsSignUpMode(false)}>
              Sign in
            </button>
          </div>
          <div className="flex items-center justify-center mt-4 text-white image-logo">
            <PencilRuler className="h-12 w-12" />
            <span className="ml-4 text-3xl font-bold">SmartForms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
