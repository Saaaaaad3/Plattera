"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MenuCategory } from "../types";
import { MenuItemCard } from "./MenuItemCard";

interface CategorySectionProps {
  category: MenuCategory;
}

export const CategorySection = ({ category }: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-5 transition-colors"
        style={{ color: "var(--copy-primary)" }}
      >
        <h2 className="text-xl font-semibold">{category.name}</h2>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4">
          <ul className="space-y-4">
            {category.items.map((item) => (
              <MenuItemCard key={item.itemId} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
