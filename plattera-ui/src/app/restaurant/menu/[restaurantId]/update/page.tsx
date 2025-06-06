"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { CategorySection } from "../../components/CategorySection";
import { MenuCategory } from "../../types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMenu } from "../../context/MenuContext";
import { BurgerMenu } from "@/app/components/BurgerMenu";
import { MenuItem } from "../../types";

// Confirmation Dialog Component
const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
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

export default function UpdateMenuPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();
  const {
    menuItems,
    isLoading,
    error,
    fetchMenuItems,
    updateMenuItem,
    deleteMenuItem,
  } = useMenu();

  // State for delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: MenuItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (userRole !== "RestOwner") {
      router.push("/");
      return;
    }

    fetchMenuItems(params.restaurantId);
  }, [isAuthenticated, userRole, router, params.restaurantId, fetchMenuItems]);

  const handleDeleteClick = (item: MenuItem) => {
    setDeleteDialog({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      await deleteMenuItem(params.restaurantId, deleteDialog.item.itemId);
      setDeleteDialog({ isOpen: false, item: null });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Group menu items by category and create MenuCategory objects
  const menuByCategory = menuItems.reduce((acc, item) => {
    const categoryId = item.category;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        id: categoryId,
        name:
          categoryId.charAt(0).toUpperCase() +
          categoryId.slice(1).replace("-", " "),
        items: [],
      };
    }
    acc[categoryId].items.push(item);
    return acc;
  }, {} as Record<string, MenuCategory>);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--copy-primary)" }}
          >
            Update Menu
          </h1>
          <BurgerMenu />
        </div>

        <div className="space-y-8">
          {Object.values(menuByCategory).map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              restaurantId={params.restaurantId}
              isEditable={true}
              onUpdateItem={updateMenuItem}
              onDeleteItem={(item) => handleDeleteClick(item)}
            />
          ))}
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.item?.itemName || ""}
      />
    </div>
  );
}
