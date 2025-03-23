import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Process from '../components/Process';
import SignIn from '../components/SignIn';
import Footer from '../components/Footer';
import { Sun, Moon } from 'lucide-react';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check user preference
    const darkModePreference = window.localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);
    
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          section.classList.add('animate-fade-in');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    window.localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-white to-gray-50'}`}>
      {/* Theme toggle button */}
      <button 
        onClick={toggleDarkMode}
        className="fixed right-4 top-4 z-50 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-md hover:shadow-lg transition-all"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-700" size={20} />}
      </button>
      
      <NavBar />
      <Hero />
      <Features />
      <Process />
      <SignIn />
      <Footer />
    </div>
  );
};

export default Index;