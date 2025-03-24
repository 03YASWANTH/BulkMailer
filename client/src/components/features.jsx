import React from 'react';
import { GlassPanel,GlassButton,GlassCard,GlassInput } from "../components/ui/glassMorphic";
import { CreditCard, Shield, Clock, RefreshCw, Smartphone, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <GlassCard 
      className={`p-6 transition-all duration-300 hover:shadow-xl hover:bg-white/30 animate-slide-up`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-altpay-50 to-altpay-100 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="text-altpay-600" size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </GlassCard>
  );
};

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Instant Backup Payments",
      description: "When your payment fails, request a backup payment from a friend in seconds."
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "End-to-end encrypted payment sharing with bank-level security."
    },
    {
      icon: Clock,
      title: "Quick Settlements",
      description: "Easily keep track and settle backup payments with your friends."
    },
    {
      icon: RefreshCw,
      title: "Multiple Backup Options",
      description: "Choose from QR scanning, direct UPI ID, or payment links."
    },
    {
      icon: Smartphone,
      title: "Works with All UPI Apps",
      description: "Compatible with Google Pay, PhonePe, Paytm and all major UPI apps."
    },
    {
      icon: Users,
      title: "Trusted Friends Circle",
      description: "Create a circle of trusted friends for quick backup requests."
    }
  ];

  return (
    <section id="features" className="py-16 px-4 relative">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-altpay-100 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-100 rounded-full filter blur-3xl opacity-20 animate-pulse-soft animate-delay-200"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need For Backup Payments</h2>
          <p className="text-gray-600">AltPay provides a seamless way to handle payment failures without the hassle of trying multiple apps or canceling transactions.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;