"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "../types";
import { demoMenuItems } from "../demoData";

interface MenuContextType {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  fetchMenuItems: (restaurantId: string) => Promise<void>;
  updateMenuItem: (
    restaurantId: string,
    updatedItem: MenuItem
  ) => Promise<void>;
  deleteMenuItem: (restaurantId: string, itemId: number) => Promise<void>;
  addMenuItem: (restaurantId: string, newItem: MenuItem) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async (restaurantId: string) => {
    // Only fetch if we don't have the data or if it's for a different restaurant
    if (
      menuItems.length === 0 ||
      menuItems[0].restId.toString() !== restaurantId
    ) {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const data = demoMenuItems.filter(
          (item) => item.restId.toString() === restaurantId
        );
        if (data.length === 0) {
          throw new Error("Restaurant not found");
        }
        setMenuItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateMenuItem = async (
    restaurantId: string,
    updatedItem: MenuItem
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Simulate API validation
      if (!updatedItem.itemName || !updatedItem.itemPrice) {
        throw new Error("Invalid menu item data");
      }

      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === updatedItem.itemId ? updatedItem : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
      throw err; // Re-throw to let the component handle the error
    }
  };

  const deleteMenuItem = async (restaurantId: string, itemId: number) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
      throw err; // Re-throw to let the component handle the error
    }
  };

  const addMenuItem = async (restaurantId: string, newItem: MenuItem) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Simulate API validation
      if (!newItem.itemName || !newItem.itemPrice || !newItem.category) {
        throw new Error("Invalid menu item data");
      }

      // Ensure the item has a unique ID
      const maxId = Math.max(...menuItems.map((item) => item.itemId), 0);
      const itemWithId = {
        ...newItem,
        itemId: maxId + 1,
        restId: parseInt(restaurantId),
      };

      setMenuItems((prevItems) => [...prevItems, itemWithId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
      throw err; // Re-throw to let the component handle the error
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        isLoading,
        error,
        fetchMenuItems,
        updateMenuItem,
        deleteMenuItem,
        addMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
