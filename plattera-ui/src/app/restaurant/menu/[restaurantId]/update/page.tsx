"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "../../context/MenuContext";
import { MenuItemCard } from "../../components/MenuItemCard";
import { DeleteConfirmationDialog } from "../../components/DeleteConfirmationDialog";
import { AddMenuItemModal } from "../../components/AddMenuItemModal";
import { MenuItem } from "../../types";
import { useAuth } from "@/app/context/AuthContext";
import { LoginModal } from "@/app/components/LoginModal";
import { CategorySection } from "../../components/CategorySection";
import { MenuCategory } from "../../types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BurgerMenu } from "@/app/components/BurgerMenu";

export default function UpdateMenuPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();
  const restaurantId = params.restaurantId;
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
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (userRole !== "RestOwner") {
      router.push("/");
      return;
    }

    // Fetch menu items when component mounts
    fetchMenuItems(restaurantId);
  }, [isAuthenticated, userRole, router, restaurantId, fetchMenuItems]);

  const handleDeleteClick = (item: MenuItem) => {
    setDeleteItemId(item.itemId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteItemId) {
      await deleteMenuItem(restaurantId, deleteItemId);
      setDeleteItemId(null);
    }
  };

  const handleAddItem = async (item: MenuItem) => {
    try {
      await addMenuItem(restaurantId, item);
      // Refresh menu items to show the new item
      await fetchMenuItems(restaurantId);
    } catch (error) {
      console.error("Error adding menu item:", error);
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

  // Get unique categories from menu items
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).sort();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--copy-primary)" }}
          >
            Update Menu
          </h1>
          <BurgerMenu />
        </div>

        <div className="mb-8">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
              onDeleteItem={(item) => handleDeleteClick(item)}
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        restaurantId={restaurantId}
        existingCategories={categories}
      />
    </div>
  );
}
