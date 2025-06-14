"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronDown, Plus, Loader2 } from "lucide-react";
import { MenuCategory, MenuItem, createMenuItem } from "../types";
import { MenuItemCard } from "./MenuItemCard";
import { useMenu } from "../context/MenuContext";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { getPaginationSettings, getScreenSize } from "../config/pagination";

interface CategorySectionProps {
  category: MenuCategory;
  restaurantId: string;
  isEditable?: boolean;
  onAddItem?: (categoryId: string, item: MenuItem) => void;
  onUpdateItem?: (categoryId: string, item: MenuItem) => void;
  onDeleteItem?: (item: MenuItem) => void;
  initialLoadLimit?: number;
  loadMoreLimit?: number;
}

export const CategorySection = ({
  category,
  restaurantId,
  isEditable = false,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  initialLoadLimit,
  loadMoreLimit,
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const { categoryPagination, fetchCategoryItems, loadMoreCategoryItems } =
    useMenu();

  // Get responsive pagination settings
  const paginationSettings = getPaginationSettings(screenSize);
  const effectiveInitialLimit =
    initialLoadLimit || paginationSettings.INITIAL_LOAD_LIMIT;
  const effectiveLoadMoreLimit =
    loadMoreLimit || paginationSettings.LOAD_MORE_LIMIT;

  const categoryState = categoryPagination[category.id];

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    setScreenSize(getScreenSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize category data when component mounts
  useEffect(() => {
    if (isExpanded && !categoryState) {
      fetchCategoryItems(restaurantId, category.id, 1, effectiveInitialLimit);
    }
  }, [
    isExpanded,
    category.id,
    restaurantId,
    fetchCategoryItems,
    categoryState,
    effectiveInitialLimit,
  ]);

  const handleLoadMore = useCallback(() => {
    if (categoryState?.hasMore && !categoryState?.isLoading) {
      loadMoreCategoryItems(restaurantId, category.id, effectiveLoadMoreLimit);
    }
  }, [
    categoryState?.hasMore,
    categoryState?.isLoading,
    restaurantId,
    category.id,
    effectiveLoadMoreLimit,
    loadMoreCategoryItems,
  ]);

  // Use custom infinite scroll hook with responsive settings
  const { ref: loadMoreRef } = useInfiniteScroll(handleLoadMore, {
    enabled: categoryState?.hasMore && !categoryState?.isLoading,
    rootMargin: paginationSettings.INTERSECTION_OBSERVER.ROOT_MARGIN,
    threshold: paginationSettings.INTERSECTION_OBSERVER.THRESHOLD,
  });

  const displayItems = categoryState?.items || [];
  const hasMore = categoryState?.hasMore || false;
  const isLoading = categoryState?.isLoading || false;
  const totalItems = categoryState?.totalItems || 0;

  return (
    <div className="space-y-4" id={category.id}>
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
        <>
          <ul className="space-y-4">
            {displayItems.map((item) => (
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

          {/* Load More Section */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: "var(--copy-primary)" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Items
                    <span className="text-sm opacity-70">
                      ({totalItems - displayItems.length} remaining)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Loading indicator for initial load */}
          {!categoryState && (
            <div className="flex justify-center py-8">
              <Loader2
                className="w-6 h-6 animate-spin"
                style={{ color: "var(--copy-primary)" }}
              />
            </div>
          )}

          {/* No more items indicator */}
          {categoryState && !hasMore && displayItems.length > 0 && (
            <div
              className="text-center py-4 text-sm opacity-70"
              style={{ color: "var(--copy-secondary)" }}
            >
              All {totalItems} items in this category have been loaded
            </div>
          )}

          {/* Empty state */}
          {categoryState && displayItems.length === 0 && (
            <div
              className="text-center py-8 text-sm opacity-70"
              style={{ color: "var(--copy-secondary)" }}
            >
              No items found in this category
            </div>
          )}
        </>
      )}
    </div>
  );
};
