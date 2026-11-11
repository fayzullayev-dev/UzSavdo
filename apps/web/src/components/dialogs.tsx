"use client";

import React from "react";
import { AlertTriangle, Info, CheckCircle2, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Ha",
  cancelText = "Bekor qilish",
  variant = "danger",
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[4px] animate-in fade-in duration-200">
      <div
        className="bg-surface border border-border w-full max-w-[420px] rounded-[20px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-180"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text rounded-full hover:bg-surface-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              variant === "danger"
                ? "bg-danger/10 text-danger"
                : "bg-primary/10 text-primary"
            }`}
          >
            {variant === "danger" ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Info className="w-6 h-6" />
            )}
          </div>

          <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11 px-4 border border-border rounded-btn text-text-secondary hover:bg-surface-muted font-semibold text-sm transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 h-11 px-4 rounded-btn text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                variant === "danger"
                  ? "bg-danger hover:bg-danger/90"
                  : "bg-primary hover:bg-primary-hover"
              }`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-[480px]"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[4px] animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`bg-surface border border-border w-full ${maxWidth} rounded-[20px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-180 my-8`}
        role="dialog"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <h3 className="text-lg font-bold text-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text rounded-full hover:bg-surface-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
