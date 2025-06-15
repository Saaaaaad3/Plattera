"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "../types";
import { demoMenuItems } from "../demoData";

interface CategoryPaginationState {
  [categoryId: string]: {
    items: MenuItem[];
    hasMore: boolean;
    isLoading: boolean;
    page: number;
    totalItems: number;
  };
}

interface MenuContextType {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  categoryPagination: CategoryPaginationState;
  fetchMenuItems: (restaurantId: string) => Promise<void>;
  fetchCategoryItems: (
    restaurantId: string,
    categoryId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  loadMoreCategoryItems: (
    restaurantId: string,
    categoryId: string,
    limit?: number
  ) => Promise<void>;
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
  const [categoryPagination, setCategoryPagination] =
    useState<CategoryPaginationState>({});

  // Get unique categories for a restaurant
  const getRestaurantCategories = (restaurantId: string): string[] => {
    const restaurantItems = demoMenuItems.filter(
      (item) => item.restId.toString() === restaurantId
    );
    return Array.from(new Set(restaurantItems.map((item) => item.category)));
  };

  // Get items for a specific category with pagination
  const getCategoryItems = (
    restaurantId: string,
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): { items: MenuItem[]; totalItems: number; hasMore: boolean } => {
    const allCategoryItems = demoMenuItems.filter(
      (item) =>
        item.restId.toString() === restaurantId && item.category === categoryId
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = allCategoryItems.slice(startIndex, endIndex);
    const totalItems = allCategoryItems.length;
    const hasMore = endIndex < totalItems;

    return { items, totalItems, hasMore };
  };

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

  const fetchCategoryItems = async (
    restaurantId: string,
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const { items, totalItems, hasMore } = getCategoryItems(
        restaurantId,
        categoryId,
        page,
        limit
      );

      setCategoryPagination((prev) => ({
        ...prev,
        [categoryId]: {
          items:
            page === 1 ? items : [...(prev[categoryId]?.items || []), ...items],
          hasMore,
          isLoading: false,
          page,
          totalItems,
        },
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch category items"
      );
    }
  };

  const loadMoreCategoryItems = async (
    restaurantId: string,
    categoryId: string,
    limit: number = 10
  ) => {
    const currentState = categoryPagination[categoryId];
    if (!currentState || currentState.isLoading || !currentState.hasMore) {
      return;
    }

    // Set loading state for this category
    setCategoryPagination((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        isLoading: true,
      },
    }));

    await fetchCategoryItems(
      restaurantId,
      categoryId,
      currentState.page + 1,
      limit
    );
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

      // Update item in category pagination if it exists
      setCategoryPagination((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((categoryId) => {
          if (categoryId === updatedItem.category) {
            newState[categoryId] = {
              ...newState[categoryId],
              items: newState[categoryId].items.map((item) =>
                item.itemId === updatedItem.itemId ? updatedItem : item
              ),
            };
          }
        });
        return newState;
      });
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

      // Remove item from category pagination if it exists
      setCategoryPagination((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((categoryId) => {
          newState[categoryId] = {
            ...newState[categoryId],
            items: newState[categoryId].items.filter(
              (item) => item.itemId !== itemId
            ),
            totalItems: newState[categoryId].totalItems - 1,
          };
        });
        return newState;
      });
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

      // Add item to category pagination if the category exists
      setCategoryPagination((prev) => {
        const newState = { ...prev };
        if (newState[newItem.category]) {
          newState[newItem.category] = {
            ...newState[newItem.category],
            items: [itemWithId, ...newState[newItem.category].items],
            totalItems: newState[newItem.category].totalItems + 1,
          };
        }
        return newState;
      });
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
        categoryPagination,
        fetchMenuItems,
        fetchCategoryItems,
        loadMoreCategoryItems,
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
