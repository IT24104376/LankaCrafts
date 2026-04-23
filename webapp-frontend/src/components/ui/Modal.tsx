import React from 'react';

type ModalProps = {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
};

export function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmDisabled = false
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
        <div className="text-sm text-gray-600 mb-5">{children}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={confirmDisabled}
              className="px-4 py-2 rounded-lg bg-forest text-white hover:bg-forest-dark disabled:opacity-50"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
