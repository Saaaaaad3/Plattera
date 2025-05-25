import React from "react";
import { MenuItem, MenuCategory } from "./types";
import { demoMenuItems } from "./demoData";
import { MenuClient } from "./MenuClient";

// Helper function to group items by category
const groupItemsByCategory = (items: MenuItem[]): MenuCategory[] => {
  // Get unique categories
  const categories = Array.from(new Set(items.map((item) => item.category)));

  // Create category objects with their items
  return categories.map((category) => ({
    id: category,
    name:
      category.charAt(0).toUpperCase() + category.slice(1).replace("-", " "),
    items: items.filter((item) => item.category === category),
  }));
};

// This is a Server Component
export const MenuContainer = async () => {
  // In the future, replace this with actual API call
  // const response = await fetch('your-api-endpoint');
  // const menuItems: MenuItem[] = await response.json();
  const menuItems = demoMenuItems;

  // Group items by category
  const menuCategories = groupItemsByCategory(menuItems);

  return <MenuClient categories={menuCategories} />;
};
