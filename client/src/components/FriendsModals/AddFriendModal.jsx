// components/FriendsModals/AddFriendModal.jsx
import React from 'react';
import { GlassPanel, GlassButton, GlassInput } from "../ui/glassMorphic";
import { X } from 'lucide-react';

const AddFriendModal = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pb-4 animate-fade-in">
      <GlassPanel className="w-full max-w-md p-6 mx-4 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add New Friend</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Name
              </label>
              <GlassInput
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                email
              </label>
              <GlassInput
                id="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="mt-8 flex space-x-3">
            <GlassButton
              type="button"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              className="flex-1 bg-gradient-to-r from-altpay-600 to-altpay-500 text-white border-0"
            >
              Add Friend
            </GlassButton>
          </div>
        </form>
      </GlassPanel>
    </div>
  );
};

export default AddFriendModal;