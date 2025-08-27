import React from "react";
import { Button } from "../ui";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const handleConfirm = React.useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const handleCancel = React.useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-background border border-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {message}
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="min-w-[100px]"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className="min-w-[100px]"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
