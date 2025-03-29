import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { Mail, Users, ArrowRight, User, Send, FilePlus, CheckCircle, List, BarChart } from 'lucide-react';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const popIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20,
      duration: 0.5 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Email preview animation
const emailAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: (custom) => ({
    opacity: 1,
    x: 0,
    transition: { delay: custom * 0.2, duration: 0.4 }
  })
};

// Gradient blur spots component
const GradientSpots = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute left-1/4 top-1/4 w-72 h-72 bg-purple-700 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-purple-700 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute left-1/4 bottom-1/4 w-80 h-80 bg-indigo-700 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute right-1/4 bottom-1/4 w-72 h-72 bg-indigo-700 rounded-full opacity-20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
    </div>
  );
};

// Email composer preview component
const EmailComposerPreview = () => {
  return (
    <motion.div 
      variants={popIn}
      className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl overflow-hidden max-w-sm w-full mx-auto"
    >
      {/* Email header */}
      <div className="bg-slate-800/80 border-b border-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <Mail className="text-white" size={18} />
          </div>
          <div>
            <h3 className="text-white font-medium">New Campaign</h3>
            <div className="text-xs text-green-400">Ready to send</div>
          </div>
        </div>
      </div>
      
      {/* Email composer body */}
      <div className="p-4 space-y-3">
        <motion.div 
          custom={0}
          variants={emailAnimation}
          className="space-y-2"
        >
          <label className="text-xs text-slate-400 block">To:</label>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-700/60 text-xs text-white px-2 py-1 rounded-full flex items-center">
              sales@example.com <CheckCircle size={12} className="ml-1 text-green-400" />
            </span>
            <span className="bg-slate-700/60 text-xs text-white px-2 py-1 rounded-full flex items-center">
              marketing@example.com <CheckCircle size={12} className="ml-1 text-green-400" />
            </span>
            <span className="bg-slate-700/60 text-xs text-white px-2 py-1 rounded-full flex items-center">
              support@example.com <CheckCircle size={12} className="ml-1 text-green-400" />
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          custom={1}
          variants={emailAnimation}
          className="space-y-2"
        >
          <label className="text-xs text-slate-400 block">Subject:</label>
          <div className="bg-slate-700/40 border border-slate-600/50 rounded-lg py-2 px-3 text-sm text-white">
            March Newsletter: New Product Announcement
          </div>
        </motion.div>
        
        <motion.div 
          custom={2}
          variants={emailAnimation}
          className="space-y-2"
        >
          <label className="text-xs text-slate-400 block">Content:</label>
          <div className="bg-slate-700/40 border border-slate-600/50 rounded-lg p-3 text-sm text-white h-20">
            <div className="text-slate-300">
              Hello team, we're excited to announce our new product launch next week! Please review the details and...
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Email actions */}
      <div className="p-3 border-t border-slate-700/50">
        <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <Send size={16} /> Send to All Recipients
        </button>
      </div>
    </motion.div>
  );
};

// Main App component
const BulkMailerApp = () => {
  const [scrolled, setScrolled] = useState(false);
  const BASE_URL = "http://localhost:3000/api";
  const SignIn = () => {
    window.open(`${BASE_URL}/auth/google`, "_self");
  }
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-950 opacity-90 text-white relative">
      {/* Background gradient spots */}
      <GradientSpots />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-slate-950/80 shadow-lg border-b border-slate-800/50' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">BM</div>
              <span className="text-lg font-semibold">BulkMailer</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</a>
              <button className="text-sm text-slate-300 hover:text-white transition-colors" onClick={SignIn}>Sign In</button>
            </motion.div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="h-screen flex justify-center items-center relative overflow-hidden bg-black-900/90 px-6">
        {/* Hero section additional gradient spots */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-800 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-700 rounded-full opacity-20 blur-3xl"></div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeIn} className="mb-6 inline-block">
              <span className="bg-slate-800/50 backdrop-blur-sm text-purple-400 text-sm font-medium px-4 py-1.5 rounded-full border border-slate-700/50">
                Bulk Email Service
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeIn} 
              className="text-5xl md:text-6xl font-semibold bg-clip-text text-neutral-400 bg-gradient-to-r from-white to-gray-300"
            >
              Send Emails to Multiple Recipients With Ease
            </motion.h1>

            <motion.p 
              variants={fadeIn} 
              className="text-gray-400 text-lg mt-4 mb-8 max-w-2xl mx-auto"
            >
              BulkMailer helps you reach your audience with personalized emails, campaign tracking, and powerful analytics - all in one platform.
            </motion.p>

            <motion.div 
              variants={fadeIn} 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-base font-medium shadow-lg shadow-purple-700/20 transition-all duration-300">
                Start Sending <ArrowRight size={16} />
              </button>
              
              <button className="backdrop-blur-md bg-slate-800/40 hover:bg-slate-800/60 text-white px-6 py-3 rounded-lg border border-slate-700/50 text-base font-medium shadow-md transition-all duration-300 flex items-center gap-3">
                <Users />
                Import Contacts
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/30 backdrop-blur-lg border-y border-slate-800/50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Powerful Email Features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need for efficient bulk emailing and campaign management in one platform.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="backdrop-blur-lg bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 shadow-xl hover:shadow-purple-900/5 transition-all duration-300"
            >
              <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                <Send className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mass Email Campaigns</h3>
              <p className="text-slate-400">Send personalized emails to thousands of recipients with custom fields and dynamic content.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="backdrop-blur-lg bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 shadow-xl hover:shadow-purple-900/5 transition-all duration-300"
            >
              <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                <FilePlus className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">List Management</h3>
              <p className="text-slate-400">Easily organize contacts into segmented lists with import/export capabilities and automatic cleaning.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="backdrop-blur-lg bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 shadow-xl hover:shadow-purple-900/5 transition-all duration-300"
            >
              <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                <BarChart className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Reporting</h3>
              <p className="text-slate-400">Track open rates, clicks, and conversions with detailed reports and real-time campaign performance.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Additional Feature Section with Animation */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex-1 order-2 md:order-1"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Send Smarter, Not Harder</h2>
              <p className="text-slate-400 mb-6">Automate your email outreach with intelligent scheduling, personalization, and delivery optimization tools.</p>
              
              <ul className="space-y-4">
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="text-slate-300">Advanced email personalization with dynamic content blocks</p>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="text-slate-300">Optimized delivery times based on recipient engagement patterns</p>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="text-slate-300">Automated follow-ups based on recipient actions and engagement</p>
                </motion.li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex-1 order-1 md:order-2"
            >
              <EmailComposerPreview />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute -z-10 inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="backdrop-blur-lg bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Ready to Simplify Your Email Marketing?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">Join thousands of businesses who are reaching their audience more effectively with BulkMailer. Get started in less than 2 minutes.</p>
            
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg text-base font-medium shadow-lg shadow-purple-700/20 transition-all duration-300">
              Create Your BulkMailer Account
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="border-t border-slate-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">© 2025 BulkMailer. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BulkMailerApp;