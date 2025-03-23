import React from 'react';
import { GlassPanel,GlassButton,GlassCard,GlassInput } from "../components/ui/glassMorphic";
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:py-32 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-altpay-200 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse-soft animate-delay-300"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-20 animate-pulse-soft animate-delay-500"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 lg:pr-8 animate-slide-up">
            <div className="flex items-center mb-5">
              <GlassPanel className="py-1 px-3 border border-altpay-200 text-sm font-medium text-altpay-700">
                Never miss a payment again
              </GlassPanel>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Backup Payment</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-altpay-600 to-altpay-500">Made Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              When your payment fails due to bank issues or insufficient funds, AltPay lets you instantly request a friend to pay on your behalf.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <GlassButton className="bg-gradient-to-r from-altpay-600 to-altpay-500 text-white border-0 flex items-center">
                Get Started <ArrowRight size={16} className="ml-2" />
              </GlassButton>
              <a href="#how-it-works" className="text-altpay-700 font-medium flex items-center hover:text-altpay-800 transition-colors">
                How it works <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-altpay-500 mr-2" />
                <span className="text-sm text-gray-600">No more failed payments</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={20} className="text-altpay-500 mr-2" />
                <span className="text-sm text-gray-600">Easy friend requests</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={20} className="text-altpay-500 mr-2" />
                <span className="text-sm text-gray-600">Secure QR sharing</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-slide-up animate-delay-200">
            <div className="phone-3d">
              <div className="phone-3d-inner relative">
                <div className="relative max-w-xs">
                  <GlassPanel className="absolute -top-10 -left-6 px-5 py-3 z-10 animate-float animate-delay-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Payment Successful</p>
                        <p className="text-xs text-gray-500">via Rahul's backup</p>
                      </div>
                    </div>
                  </GlassPanel>
                  
                  <GlassPanel className="absolute -bottom-8 -right-6 px-5 py-3 z-10 animate-float animate-delay-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-altpay-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-altpay-600">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Secure Transaction</p>
                        <p className="text-xs text-gray-500">End-to-end encrypted</p>
                      </div>
                    </div>
                  </GlassPanel>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-altpay-400/40 to-indigo-400/40 rounded-[40px] blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-altpay-50 to-blue-50 p-2 rounded-[40px] border-4 border-white shadow-xl">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-5 bg-black rounded-b-2xl"></div>
                      <div className="bg-white overflow-hidden rounded-[32px] h-[560px] w-64 relative">
                        <div className="h-16 bg-gradient-to-r from-altpay-500 to-altpay-600 flex items-center justify-center">
                          <h3 className="text-white font-semibold">AltPay</h3>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-semibold mb-2">Backup Request</h4>
                          <div className="bg-gray-100 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">To</span>
                              <span className="text-xs font-medium">Coffee House</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">Amount</span>
                              <span className="text-xs font-medium">₹250.00</span>
                            </div>
                          </div>
                          
                          <h4 className="text-sm font-semibold mt-4 mb-2">Select Backup Friend</h4>
                          <div className="space-y-2">
                            <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-200 mr-2 flex items-center justify-center">R</div>
                              <span className="text-xs font-medium">Rahul</span>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                              <div className="w-8 h-8 rounded-full bg-purple-200 mr-2 flex items-center justify-center">P</div>
                              <span className="text-xs font-medium">Priya</span>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                              <div className="w-8 h-8 rounded-full bg-green-200 mr-2 flex items-center justify-center">S</div>
                              <span className="text-xs font-medium">Suresh</span>
                            </div>
                          </div>
                          
                          <button className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-altpay-500 to-altpay-600 text-white text-sm font-medium">
                            Send Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;