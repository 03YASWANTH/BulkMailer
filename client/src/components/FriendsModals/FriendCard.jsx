import React, { useState, useEffect } from 'react';
import { GlassCard } from "../ui/glassMorphic";
import { Edit, Trash2, X } from 'lucide-react';

const FriendCard = ({ friend, onEdit, onDelete }) => {
  const [swiped, setSwiped] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSwipe = (eventData) => {
    if (isMobile && eventData.dir === 'Left') {
      setSwiped(true);
    }
  };

  const handleClose = () => {
    setSwiped(false);
  };

  return (
    <div className="mb-4 relative">
      {/* Buttons for Mobile (Appear on Swipe) */}
      {isMobile && (
        <div 
          className="absolute top-0 right-0 h-full flex items-center bg-gray-100 rounded-r-xl z-10"
          style={{ width: swiped ? '120px' : '0px', transition: 'width 0.3s' }}
        >
          <div className="flex justify-around w-full">
            <button 
              onClick={() => onEdit(friend)}
              className="w-12 h-12 rounded-full bg-altpay-100 flex items-center justify-center text-altpay-600"
            >
              <Edit size={20} />
            </button>
            <button 
              onClick={() => onDelete(friend)}
              className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}

      <div 
        className="relative z-20"
        style={{ transform: swiped ? 'translateX(-120px)' : 'translateX(0)', transition: 'transform 0.3s' }}
      >
        <div className="w-full" onTouchEnd={handleClose}>
          <GlassCard className="p-4 relative">
            {/* Close Button on Swipe */}
            {swiped && isMobile && (
              <button 
                onClick={handleClose}
                className="absolute -right-4 -top-4 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center z-30"
              >
                <X size={16} />
              </button>
            )}

            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-altpay-500 to-altpay-600 flex items-center justify-center text-white mr-3">
                {friend.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{friend.name}</h3>
                <p className="text-sm text-gray-500">{friend.email}</p>
              </div>

              {/* Buttons for Desktop (Always Visible) */}
              {!isMobile && (
                <div className="ml-auto flex gap-2">
                  <button 
                    onClick={() => onEdit(friend)}
                    className="w-10 h-10 rounded-full bg-altpay-100 flex items-center justify-center text-altpay-600"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(friend)}
                    className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="text-xs">
                <span className="text-gray-500">Phone: </span>
                <span className="font-medium">{friend.phoneNumber}</span>
              </div>
              <div className="text-xs">
                <span className="text-gray-500">UPI ID: </span>
                <span className="font-medium">{friend.upiId}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
