import React from 'react';
import { GlassPanel,GlassButton,GlassCard,GlassInput } from "../components/ui/glassMorphic";
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-altpay-50 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
      
      <div className="max-w-7xl mx-auto">
        <GlassPanel className="p-8 relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br from-altpay-100/30 to-blue-100/30 blur-md"></div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-altpay-500 to-altpay-700 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-altpay-700 to-altpay-500">AltPay</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Never worry about payment failures again. AltPay makes backup requests simple and secure.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-altpay-600 transition-colors">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-altpay-600 transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-altpay-600 transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-altpay-600 transition-colors">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-altpay-600 text-sm transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-altpay-600 text-sm transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-altpay-600 text-sm transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-altpay-600 text-sm transition-colors">Press</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-altpay-600 text-sm transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-altpay-600 text-sm transition-colors">Support</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-altpay-600 text-sm transition-colors">Partners</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-altpay-600 text-sm transition-colors">Developers</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Stay Updated</h4>
                <p className="text-gray-600 text-sm mb-4">Subscribe to our newsletter for the latest updates.</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-altpay-500 focus:border-altpay-500 text-sm flex-grow"
                  />
                  <button className="px-3 py-2 rounded-r-md bg-altpay-600 text-white">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} AltPay. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-altpay-600 text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-altpay-600 text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-altpay-600 text-sm transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </footer>
  );
};

export default Footer;