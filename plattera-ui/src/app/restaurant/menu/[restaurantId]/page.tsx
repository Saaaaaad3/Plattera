"use client";

import React, { useEffect, useState } from "react";
import { useMenu } from "../context/MenuContext";
import { CategorySection } from "../components/CategorySection";
import { useParams } from "next/navigation";
import { FloatingMenuButton } from "../components/FloatingMenuButton";
import { demoMenuItems } from "../demoData";

// This is a Server Component by default in the App Router
// It receives route parameters in the `params` prop
export default function MenuPage() {
  const params = useParams();
  const restaurantId = params?.restaurantId as string;
  const { isLoading, error, fetchCategoryItems } = useMenu();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Ensure we're in a client context and params is available
    if (typeof window === "undefined" || !restaurantId) return;

    // Get unique categories for this restaurant
    const restaurantItems = demoMenuItems.filter(
      (item) => item.restId.toString() === restaurantId
    );
    const uniqueCategories = Array.from(
      new Set(restaurantItems.map((item) => item.category))
    );
    setCategories(uniqueCategories);
  }, [restaurantId]);

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

  // Create category objects for the floating menu
  const categoryObjects = categories.map((categoryId) => ({
    id: categoryId,
    name:
      categoryId.charAt(0).toUpperCase() +
      categoryId.slice(1).replace("-", " "),
    items: [], // We don't need the actual items for the floating menu
  }));

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
          {categories.map((categoryId) => (
            <CategorySection
              key={categoryId}
              category={{
                id: categoryId,
                name:
                  categoryId.charAt(0).toUpperCase() +
                  categoryId.slice(1).replace("-", " "),
                items: [], // Items will be loaded by the CategorySection component
              }}
              restaurantId={restaurantId}
              isEditable={false}
              initialLoadLimit={10}
              loadMoreLimit={10}
            />
          ))}
        </div>
      </div>
      <FloatingMenuButton categories={categoryObjects} />
    </div>
  );
}
