"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, Plus } from "lucide-react";
import { MenuCategory, MenuItem, createMenuItem } from "../types";
import { MenuItemCard } from "./MenuItemCard";

interface CategorySectionProps {
  category: MenuCategory;
  restaurantId: string;
  isEditable?: boolean;
  onAddItem?: (categoryId: string, item: MenuItem) => void;
  onUpdateItem?: (categoryId: string, item: MenuItem) => void;
  onDeleteItem?: (item: MenuItem) => void;
}

export const CategorySection = ({
  category,
  restaurantId,
  isEditable = false,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-lg font-semibold"
          style={{ color: "var(--copy-primary)" }}
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          {category.name}
        </button>
        {isEditable && onAddItem && (
          <button
            onClick={() =>
              onAddItem(
                category.id,
                createMenuItem("New Item", parseInt(restaurantId), category.id)
              )
            }
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: "var(--copy-primary)" }}
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        )}
      </div>

      {isExpanded && (
        <ul className="space-y-4">
          {category.items.map((item) => (
            <MenuItemCard
              key={item.itemId}
              item={item}
              restaurantId={restaurantId}
              isEditable={isEditable}
              onUpdate={
                onUpdateItem
                  ? (item) => onUpdateItem(category.id, item)
                  : undefined
              }
              onDelete={onDeleteItem ? () => onDeleteItem(item) : undefined}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
