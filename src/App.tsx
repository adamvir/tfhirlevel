import React, { useState, useEffect } from 'react';
import { GeometricHeader } from './components/GeometricHeader';
import { ConferencePage } from './components/ConferencePage';
import { NewsletterPage } from './components/NewsletterPage';
import { SubscribeModal } from './components/SubscribeModal';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('konferenciak');
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const handleSubscribeOpen = () => {
    setIsSubscribeModalOpen(true);
  };

  const handleSubscribeClose = () => {
    setIsSubscribeModalOpen(false);
  };

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  const renderContent = () => {
    if (currentPage === "konferenciak") {
      return <ConferencePage />;
    }
    
    if (currentPage === "hirlevel") {
      return <NewsletterPage />;
    }
    
    // Default to conferences
    return <ConferencePage />;
  };

  return (
    <div className="min-h-screen bg-background">
      <GeometricHeader 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        onSubscribeOpen={handleSubscribeOpen}
      />
      
      {renderContent()}
      
      <SubscribeModal 
        isOpen={isSubscribeModalOpen}
        onClose={handleSubscribeClose}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}