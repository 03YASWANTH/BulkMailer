import React from "react";
import { Trash2 } from "lucide-react";
import { GlassPanel, GlassButton } from "../ui/glassMorphic";

const DeleteConfirmModal = ({ isOpen, friend, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pb-4 animate-fade-in">
      <GlassPanel className="w-full max-w-md p-6 mx-4 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Friend</h2>
          <p className="text-gray-600">
            Are you sure you want to delete {friend?.name}? This action cannot be undone.
          </p>
        </div>

        <div className="flex space-x-3">
          <GlassButton className="flex-1" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton
            className="flex-1 bg-red-500 text-white border-0 hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  );
};

export default DeleteConfirmModal;
