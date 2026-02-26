import React from 'react';
import { Outlet } from '@tanstack/react-router';
import Navigation from './Navigation';
import { Toaster } from '@/components/ui/sonner';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Desktop: offset for sidebar; mobile: padding for bottom tab bar */}
      <main className="md:ml-56 pb-20 md:pb-6 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
