"use client";

import { memo } from "react";
import { MenuCategory } from "./types";
import { CategorySection } from "./components/CategorySection";
import { FloatingMenuButton } from "./components/FloatingMenuButton";

interface MenuClientProps {
  categories: MenuCategory[];
  restaurantId: string;
}

export const MenuClient = memo(function MenuClient({
  categories,
  restaurantId,
}: MenuClientProps) {
  return (
    <div className="py-8">
      <div className="container">
        <h1
          className="text-2xl md:text-3xl font-bold mb-8"
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
            />
          ))}
        </div>
      </div>
      <FloatingMenuButton categories={categories} />
    </div>
  );
});
