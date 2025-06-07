"use client";

import React, { useEffect, useState } from "react";
import { useMenu } from "../context/MenuContext";
import { CategorySection } from "../components/CategorySection";
import { MenuCategory } from "../types";
import { useParams } from "next/navigation";
import { FloatingMenuButton } from "../components/FloatingMenuButton";

// This is a Server Component by default in the App Router
// It receives route parameters in the `params` prop
export default function MenuPage() {
  const params = useParams();
  const restaurantId = params?.restaurantId as string;
  const { menuItems, isLoading, error, fetchMenuItems } = useMenu();

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems(restaurantId);
    }
  }, [fetchMenuItems, restaurantId]);

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

  const categories = Object.values(menuByCategory);

  return (
    <div className="py-8">
      <div className="container">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: "var(--copy-primary)" }}
        >
          Menu
        </h1>

        <div className="space-y-8">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              restaurantId={restaurantId}
              isEditable={false}
            />
          ))}
        </div>
      </div>
      <FloatingMenuButton categories={categories} />
    </div>
  );
}
