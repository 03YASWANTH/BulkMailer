import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { GlassPanel, GlassButton, GlassInput } from '../components/ui/GlassMorphic';
import { 
  Check, QrCode, Send, Smartphone, ArrowLeft, X, Camera, 
  User as UserIcon, 
  CreditCard, 
  History, 
  Settings 
} from 'lucide-react';
import { useUser } from "../context/UserContext.jsx";
import toast, { Toaster } from 'react-hot-toast';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Initial check
      checkMobile();
      
      // Add event listener
      window.addEventListener('resize', checkMobile);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    return isMobile;
  };

const ScanPayment = () => {
    const BaseUrl = 'http://localhost:3000';
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [upid, setUpid] = useState('');
    const [scanMode, setScanMode] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraInitializing, setCameraInitializing] = useState(false);
    const [showCameraPrompt, setShowCameraPrompt] = useState(false);
    const html5QrCodeRef = useRef(null);
    const qrContainerRef = useRef(null);
    const { user,setUser } = useUser();
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Cleanup scanner on unmount
        return () => {
          stopScanner();
        };
      }, []);
      
      useEffect(() => {
        // Initialize scanner when entering scan mode
        if (scanMode) {
          initializeScanner();
        } else {
          stopScanner();
        }
      }, [scanMode]);
    
      useEffect(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const tokenParam = urlParams.get('token');
          if (tokenParam) {
            localStorage.setItem('accessToken', tokenParam);
            navigate('/Scan', { replace: true });
          }
          if (localStorage.getItem('accessToken')) {
            console.log(localStorage.getItem('accessToken'))
            fetchMe();
          } else 
          {
            navigate('/');
          }
        }, [navigate]);
        const fetchMe = async () => {
          setIsLoading(true);
          try {
            const response = await fetch(`${BaseUrl}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              }
            });
            
            if (!response.ok) throw new Error('Failed to fetch data');
            
            const data = await response.json();

            setUser(data.data.user);
          } catch (error) {
            console.error('Error fetching data:', error);
            // If unauthorized, clear token and redirect to login
            if (error.response && error.response.status === 401) {
              localStorage.removeItem('accessToken');
              navigate('/');
            }
          } finally {
            setIsLoading(false);
          }
        };
    
      const stopScanner = () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(error => {
            console.error("Failed to stop scanner:", error);
          });
        }
      };
    
      const checkCameraPermission = async () => {
        setCameraInitializing(true);
      
        try {
          // Check if mediaDevices is supported
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Camera access is not supported in this browser.");
          }
      
          // Request camera access with back camera preference
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } // Use the back camera
          });
      
          // Stop the stream immediately (we just needed permission)
          stream.getTracks().forEach(track => track.stop());
      
          setCameraPermission(true);
          setScanMode(true); // Start scanning once permission is granted
          setShowCameraPrompt(false);
        } catch (error) {
          console.error("Camera permission error:", error);
          setCameraPermission(false);
      
          // Show user-friendly error messages
          if (error.name === 'NotAllowedError') {
            toast.error("Camera access denied. Please enable camera permissions in your browser settings.");
          } else if (error.name === 'NotFoundError') {
            toast.error("No camera detected on your device.");
          } else {
            toast.error("Camera error: " + error.message);
          }
        } finally {
          setCameraInitializing(false);
        }
      };
      
      const initializeScanner = () => {
        if (!qrContainerRef.current) return;
        
        const qrScanner = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = qrScanner;
        
        const qrboxFunction = (viewfinderWidth, viewfinderHeight) => {
          const minEdgePercentage = 0.7;
          const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
          return {
            width: qrboxSize,
            height: qrboxSize
          };
        };
        
        qrScanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: qrboxFunction,
            aspectRatio: 1.0
          },
          handleScan,
          handleError
        ).catch(err => {
          console.error("QR Scanner start error:", err);
          toast.error("Could not start the QR code scanner.");
          setScanMode(false);
        });
      };
    
      const handleScan = (decodedText) => {
        if (decodedText) {
          setUpid(decodedText);
          setScanMode(false);
          toast.success("UPID has been successfully captured.");
        }
      };
    
      const handleError = (err) => {
        // Only log errors, don't show to user for normal scanning issues
        console.error("QR Scanner error:", err);
      };
    
      const handleOpenCamera = () => {
        if (cameraPermission === true) {
          // If we already have permission, just start scanning
          setScanMode(true);
        } else if (cameraPermission === false) {
          // If permission was denied, show instructions to enable
          setShowCameraPrompt(true);
        } else {
          // First time or permission reset, request access
          checkCameraPermission();
        }
      };
    
      const handleSend = async () => {
        if (!upid.trim()) {
          toast.error("UPID field cannot be empty.");
          return;
        }
    
        setIsLoading(true);
        try {
          // Simulating API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.success("Payment request has been sent successfully!");
          // Navigate or reset form here
          setUpid('');
        } catch (error) {
          toast.error("Failed to process payment request.");
        } finally {
          setIsLoading(false);
        }
      };

  // Modify the existing render to include user profile section
  return (
    <>
      <div className={`min-h-screen ${isMobile ? 'pb-20' : 'pb-10'} transition-colors duration-300`}>
        {/* User Profile Header */}
        <div className="container mx-auto px-4 pt-4 flex justify-between items-center">
          <div className="flex items-end ml-auto justify-around space-x-3">
            {/* User Avatar/Profile Picture */}
            <div 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-altpay-500/20 flex items-center justify-center cursor-pointer"
            >
                <UserIcon className="h-5 w-5 text-altpay-500" />
            </div>
          </div>
        </div>

        {/* User Menu Dropdown (when showUserMenu is true) */}
        {showUserMenu && (
          <div className="absolute top-16 right-4 z-50 w-64 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div>
                <p className="font-semibold">{user?.name || 'User Name'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                className="w-full py-2 px-4 text-left hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {
                  navigate('/Dashboard');
                  setShowUserMenu(false);
                }}
              >
                <UserIcon className="mr-2 h-4 w-4 inline-block" />
                My Profile
              </button>
              <button 
                className="w-full py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors mt-6"
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Rest of the existing component remains the same */}
        <div className="container max-w-md mx-auto px-4">
          <div className="container max-w-md mx-auto px-4 pt-8">
                    {/* Header */}
                    <div className="flex items-center justify-center mb-6">
                      <h1 className="text-2xl font-bold">Request with UPID</h1>
                      <div className="w-8" /> {/* Spacer for symmetry */}
                    </div>
          
                    {/* Main content */}
                    <GlassPanel className="p-6 mb-6">
                      {scanMode ? (
                        <div className="relative">
                          <div className="absolute top-2 right-2 z-10">
                            <button
                              className="rounded-full bg-black/50 hover:bg-black/70 p-2"
                              onClick={() => setScanMode(false)}
                            >
                              <X className="h-5 w-5 text-white" />
                            </button>
                          </div>
                          <div className="relative overflow-hidden rounded-lg">
                            <div className="absolute inset-0 pointer-events-none z-10 border-[3px] border-altpay-500 rounded-lg shadow-lg"></div>
                            <div 
                              id="qr-reader"
                              ref={qrContainerRef}
                              className="w-full h-64 rounded-lg overflow-hidden"
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-48 h-48 border-2 border-altpay-500 rounded-lg"></div>
                            </div>
                          </div>
                          <p className="text-center mt-4 text-sm text-muted-foreground">
                            Position the QR code within the frame to scan
                          </p>
                        </div>
                      ) : showCameraPrompt ? (
                        <div className="flex flex-col items-center justify-center py-6">
                          <Camera className="h-16 w-16 mb-4 text-altpay-500" />
                          <h3 className="text-lg font-medium mb-2">Camera Access Required</h3>
                          <p className="text-center text-sm text-muted-foreground mb-6">
                            To scan QR codes, you need to allow camera access in your browser settings.
                          </p>
                          <div className="flex gap-3">
                            <button
                              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              onClick={() => setShowCameraPrompt(false)}
                            >
                              Cancel
                            </button>
                            <GlassButton
                              onClick={checkCameraPermission}
                            >
                              Try Again
                            </GlassButton>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-6">
                            <label htmlFor="upid" className="block text-sm font-medium mb-2">
                              Enter UPID
                            </label>
                            <div className="relative">
                              <GlassInput
                                id="upid"
                                value={upid}
                                onChange={(e) => setUpid(e.target.value)}
                                placeholder="Enter receiver's UPID"
                                className="pr-10"
                              />
                              {isMobile && (
                                <button
                                  onClick={handleOpenCamera}
                                  disabled={cameraInitializing}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {cameraInitializing ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <QrCode className="h-5 w-5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
          
                          <button
                            onClick={handleSend}
                            className="w-full py-3 bg-altpay-500 text-white rounded-lg hover:bg-altpay-600 transition-colors flex items-center justify-center"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <Send className="mr-2 h-5 w-5" />
                                Send Payment
                              </span>
                            )}
                          </button>
                        </>
                      )}
                    </GlassPanel>
          
                    {/* Helper Text */}
                    {!scanMode && !showCameraPrompt && (
                      <div className="text-center text-sm text-muted-foreground">
                        {isMobile ? (
                          <p className="flex items-center justify-center">
                            <Smartphone className="mr-2 h-4 w-4" />
                            {cameraPermission === false ? 
                              "Tap the QR icon to enable camera access" : 
                              "You can scan a QR code by tapping the icon"}
                          </p>
                        ) : (
                          <p className="flex items-center justify-center">
                            <QrCode className="mr-2 h-4 w-4" />
                            On desktop, simply enter the UPID manually
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Features */}
                    {!scanMode && !showCameraPrompt && (
                      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-altpay-500/20 flex items-center justify-center mr-3">
                              <Check className="h-4 w-4 text-altpay-500" />
                            </div>
                            <h3 className="font-medium">Fast & Secure</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Payments are processed instantly with enterprise-grade security
                          </p>
                        </div>
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-altpay-500/20 flex items-center justify-center mr-3">
                              <Check className="h-4 w-4 text-altpay-500" />
                            </div>
                            <h3 className="font-medium">QR Compatible</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Scan QR codes on mobile or enter UPID on desktop devices
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
        </div>
      </div>
      
      <Toaster 
        position="top-center"
        toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#333',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '12px 16px',
              maxWidth: '350px'
            },
            success: {
              iconTheme: {
                primary: '#3CB371',
                secondary: '#FFFFFF',
              },
              style: {
                border: '1px solid rgba(60, 179, 113, 0.3)'
              }
            },
            error: {
              iconTheme: {
                primary: '#E53E3E',
                secondary: '#FFFFFF',
              },
              style: {
                border: '1px solid rgba(229, 62, 62, 0.3)'
              }
            }
          }}
      />
    </>
  );
};

export default ScanPayment;