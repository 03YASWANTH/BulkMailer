import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { GlassPanel, GlassButton, GlassInput } from '../components/ui/GlassMorphic';
import { Check, QrCode, Send, Smartphone, ArrowLeft, X, Camera } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Inline implementation of useIsMobile hook
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

  return (
    <>
      <div className={`min-h-screen ${isMobile ? 'pb-20' : 'pb-10'} transition-colors duration-300`}>
        <div className="container max-w-md mx-auto px-4 pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Pay with UPID</h1>
            <div className="w-8" /> {/* Spacer for symmetry */}
          </div>

          {/* Main content */}
          <GlassPanel className="p-6 mb-6">
            {scanMode ? (
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full bg-black/50 hover:bg-black/70 p-2"
                    onClick={() => setScanMode(false)}
                  >
                    <X className="h-5 w-5 text-white" />
                  </Button>
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
                  <Button
                    variant="outline"
                    onClick={() => setShowCameraPrompt(false)}
                  >
                    Cancel
                  </Button>
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

                <GlassButton
                  onClick={handleSend}
                  className="w-full"
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
                </GlassButton>
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
      
      {/* React Hot Toast */}
      <Toaster 
        position="bottom-center"
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