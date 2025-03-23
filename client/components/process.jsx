import React from 'react';
import { GlassPanel,GlassButton,GlassCard,GlassInput } from "../components/ui/glassMorphic";
import { Check, RefreshCw, Users, Smartphone, ArrowRight } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Payment Fails",
      description: "Your UPI payment fails due to bank server issues, insufficient balance, or network problems.",
      icon: <RefreshCw className="text-white" size={28} />,
      color: "from-red-400 to-red-500",
    },
    {
      number: "02",
      title: "Request Backup",
      description: "Select a friend from your trusted circle and share the merchant's UPI details with them.",
      icon: <Users className="text-white" size={28} />,
      color: "from-amber-400 to-amber-500",
    },
    {
      number: "03",
      title: "Friend Approves",
      description: "Your friend receives the notification and approves the payment request with one click.",
      icon: <Check className="text-white" size={28} />,
      color: "from-green-400 to-green-500",
    },
    {
      number: "04",
      title: "Payment Completed",
      description: "Your friend pays the merchant directly. Both of you receive confirmations instantly.",
      icon: <Smartphone className="text-white" size={28} />,
      color: "from-altpay-400 to-altpay-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 relative">
      {/* Background elements - reduced opacity */}
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-altpay-100 rounded-full filter blur-3xl opacity-10 animate-pulse-soft"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <GlassPanel className="py-1 px-3 inline-block mb-4 border border-altpay-200 text-sm font-medium text-altpay-700">
            Simple 4-step process
          </GlassPanel>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How AltPay Works</h2>
          <p className="text-gray-600">AltPay makes backup payments simple, secure, and stress-free in just four steps.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="animate-slide-up phone-3d" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <GlassPanel className="h-full p-6 transition-all duration-300 hover:shadow-xl phone-3d-inner">
                <div className="flex justify-center mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                </div>
                <div className="relative p-2">
                  <div className="absolute -top-7 -left-2 text-5xl font-bold text-gray-200 opacity-50">{step.number}</div>
                  <h3 className="text-lg font-semibold mb-3 relative z-10">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="text-altpay-300" size={20} />
                  </div>
                )}
              </GlassPanel>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center animate-slide-up animate-delay-500">
          <GlassPanel className="max-w-3xl mx-auto p-8 bg-white/30">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Ready to Say Goodbye to Failed Payments?</h3>
            <p className="text-gray-600 mb-6">Join thousands of users who never worry about payment failures again.</p>
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-altpay-600 to-altpay-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Download AltPay Now
            </button>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
};

export default Process;