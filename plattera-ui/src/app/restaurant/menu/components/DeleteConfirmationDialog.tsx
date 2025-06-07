"use client";

import React from "react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--copy-primary)" }}
        >
          Confirm Deletion
        </h3>
        <p className="mb-6" style={{ color: "var(--copy-secondary)" }}>
          Are you sure you want to delete "{itemName}"? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            style={{ color: "var(--copy-primary)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
