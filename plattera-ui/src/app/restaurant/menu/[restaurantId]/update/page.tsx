"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMenu } from "../../context/MenuContext";
import { DeleteConfirmationDialog } from "../../components/DeleteConfirmationDialog";
import { AddMenuItemModal } from "../../components/AddMenuItemModal";
import { CategorySection } from "../../components/CategorySection";
import { MenuItem } from "../../types";
import { useAuth } from "@/app/context/AuthContext";

export default function UpdateMenuPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, userRole, showLoginModal } = useAuth();
  const restaurantId = params?.restaurantId as string;
  const {
    menuItems,
    isLoading,
    error,
    fetchMenuItems,
    updateMenuItem,
    deleteMenuItem,
    addMenuItem,
  } = useMenu();
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleDeleteClick = useCallback((item: MenuItem) => {
    setDeleteItemId(item.itemId);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteItemId) {
      await deleteMenuItem(restaurantId, deleteItemId);
      setDeleteItemId(null);
    }
  }, [deleteItemId, deleteMenuItem, restaurantId]);

  const handleAddItem = useCallback(
    async (newItem: Omit<MenuItem, "itemId">) => {
      const itemWithId: MenuItem = {
        ...newItem,
        itemId: Date.now(), // Temporary ID, will be replaced by backend
      };
      await addMenuItem(restaurantId, itemWithId);
      setIsAddModalOpen(false);
    },
    [addMenuItem, restaurantId]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }

    if (userRole !== "RestOwner") {
      router.replace(`/restaurant/menu/${restaurantId}`);
      return;
    }

    fetchMenuItems(restaurantId);
  }, [
    isAuthenticated,
    userRole,
    restaurantId,
    fetchMenuItems,
    router,
    showLoginModal,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Group menu items by category
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
  }, {} as Record<string, { id: string; name: string; items: MenuItem[] }>);

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--copy-primary)" }}
          >
            Update Menu
          </h1>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <span className="text-lg">+</span>
            <span>Add New Dish</span>
          </button>
        </div>

        <div className="space-y-8">
          {Object.values(menuByCategory).map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              restaurantId={restaurantId}
              isEditable={true}
              onUpdateItem={updateMenuItem}
              onDeleteItem={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        itemName={
          menuItems.find((item) => item.itemId === deleteItemId)?.itemName || ""
        }
      />

      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        restaurantId={restaurantId}
        existingCategories={Object.keys(menuByCategory)}
      />
    </div>
  );
}
