import React from "react";
import { MenuItem, MenuCategory } from "./types";
import { demoMenuItems } from "@/app/restaurant/menu/demoData";
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

// This is a Server Component and receives props, including params
export const MenuContainer = async ({
  restaurantId,
}: {
  restaurantId: string;
}) => {
  // In the future, replace this with actual API call based on restaurantId
  // For now, filter demo data by restId (assuming restId in demoData corresponds to restaurantId)
  const menuItems = demoMenuItems.filter(
    (item: MenuItem) => item.restId.toString() === restaurantId
  );

  // Group items by category
  const menuCategories = groupItemsByCategory(menuItems);

  return <MenuClient categories={menuCategories} restaurantId={restaurantId} />;
};
