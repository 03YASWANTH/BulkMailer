import React from 'react';
import { GlassPanel,GlassButton,GlassCard,GlassInput} from "./ui/glassMorphic";
import { Check, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
const BASE_URL = "http://localhost:3000/api";
import { useNavigate,useSearchParams } from 'react-router-dom';
const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = () => {
    window.open(`${BASE_URL}/auth/google`, "_self");
  };

  // useEffect(() => {
  //   // If there's a token in the URL, store it and navigate
  //   const token = searchParams.get("token");

  //   if (token) {
  //     localStorage.setItem("authToken", token);
  //     navigate("/dashboard", { replace: true }); // Clean URL
  //   }
  // }, [searchParams, navigate]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/user`, { withCredentials: true });
  //       console.log("User data:", response.data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  return (
    <section id="sign-in" className="py-16 px-4 relative">
      {/* Background elements - reduced opacity */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-altpay-100 rounded-full filter blur-3xl opacity-10 animate-pulse-soft"></div>
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-10 animate-pulse-soft animate-delay-300"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 lg:mb-6">Join AltPay</h2>
            <p className="text-gray-600 mb-6 lg:mb-8 max-w-md">
              Sign in with Google to start using AltPay and never worry about payment failures again.
            </p>
            
            <GlassPanel className="p-6 md:p-8 max-w-md bg-white/30">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6">Sign in with Google</h3>
                
                <GlassButton
                  className="w-full bg-white text-gray-700 border border-gray-200 flex items-center justify-center gap-3 hover:bg-gray-50" onClick={handleLogin}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                    </g>
                  </svg>
                  Continue with Google
                </GlassButton>
                
                <div className="mt-6 flex items-center justify-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-altpay-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-altpay-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Dark Mode</span>
                  </label>
                </div>
              </div>
            </GlassPanel>
          </div>
          
          <div className="w-full lg:w-1/2 animate-slide-up animate-delay-200">
            <GlassPanel className="p-6 md:p-8 bg-white/40">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-altpay-100 flex items-center justify-center mb-4">
                  <Check className="text-altpay-600" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2">Join the AltPay Community</h3>
                <p className="text-gray-600 max-w-md">
                  Experience seamless backup payments and never worry about transaction failures again.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="text-altpay-500" size={16} />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Request backup payments instantly</h4>
                    <p className="text-sm text-gray-500">Share UPI details with friends in just a few taps.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="text-altpay-500" size={16} />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Build a trusted friends circle</h4>
                    <p className="text-sm text-gray-500">Create a network of friends you can rely on for backup payments.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="text-altpay-500" size={16} />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Track payment history</h4>
                    <p className="text-sm text-gray-500">Keep a record of all the backup payments between you and your friends.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="text-altpay-500" size={16} />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Secure QR code sharing</h4>
                    <p className="text-sm text-gray-500">Share payment QR codes securely with end-to-end encryption.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="AltPay users" 
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;