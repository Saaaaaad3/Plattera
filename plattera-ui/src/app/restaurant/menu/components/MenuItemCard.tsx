"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "../types";
import { Edit2, Trash2, X } from "lucide-react";
import { formatPrice } from "@/utils/currency";

// Tag Input Component
const TagInput = ({
  tags,
  onTagsChange,
  placeholder,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div
      className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px]"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--card-shadow)",
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:text-blue-600"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : "Add another..."}
        className="flex-1 min-w-[120px] bg-transparent outline-none"
        style={{ color: "var(--copy-primary)" }}
      />
    </div>
  );
};

// Optimized image component with fallback
const MenuItemImage = ({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string;
}) => {
  return (
    <div className="flex-shrink-0 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-lg overflow-hidden relative bg-gray-100">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 140px"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}
    </div>
  );
};

MenuItemImage.displayName = "MenuItemImage";

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  isEditable?: boolean;
  onUpdate?: (item: MenuItem) => void;
  onDelete?: () => void;
}

export const MenuItemCard = ({
  item,
  restaurantId,
  isEditable = false,
  onUpdate,
  onDelete,
}: MenuItemCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<MenuItem>(item);
  const [newIngredient, setNewIngredient] = useState("");
  const isAvailable = item.itemAvailable;

  // Load existing ingredients when editing starts
  useEffect(() => {
    if (isEditing) {
      // Convert demo data ingredients array to comma-separated string if needed
      if (item.ingredients && !item.itemIngredients) {
        setEditedItem({
          ...editedItem,
          itemIngredients: item.ingredients.join(", "),
        });
      }
    }
  }, [isEditing, item]);

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      const currentIngredients = editedItem.itemIngredients
        ? editedItem.itemIngredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean)
        : [];

      // Check if ingredient already exists
      if (!currentIngredients.includes(newIngredient.trim())) {
        // Add new ingredient to the comma-separated string
        const updatedIngredients =
          currentIngredients.length > 0
            ? `${editedItem.itemIngredients}, ${newIngredient.trim()}`
            : newIngredient.trim();

        setEditedItem({
          ...editedItem,
          itemIngredients: updatedIngredients,
        });
      }
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    const currentIngredients = editedItem.itemIngredients
      ? editedItem.itemIngredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    // Remove the ingredient and join back with commas
    const updatedIngredients = currentIngredients
      .filter((i) => i !== ingredientToRemove)
      .join(", ");

    setEditedItem({
      ...editedItem,
      itemIngredients: updatedIngredients,
    });
  };

  const handleSave = () => {
    if (onUpdate) {
      // Ensure itemIngredients is a comma-separated string
      const itemToSave = {
        ...editedItem,
        itemIngredients: editedItem.itemIngredients.trim(),
      };
      onUpdate(itemToSave);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  if (isEditing) {
    // Split ingredients only for display purposes
    const ingredients = editedItem.itemIngredients
      ? editedItem.itemIngredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    return (
      <div
        className="p-4 rounded-lg shadow-md"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--copy-primary)" }}
            >
              Name
            </label>
            <input
              type="text"
              value={editedItem.itemName}
              onChange={(e) =>
                setEditedItem({ ...editedItem, itemName: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--copy-primary)",
                borderColor: "var(--card-shadow)",
              }}
              minLength={3}
              maxLength={100}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--copy-primary)" }}
            >
              Description
            </label>
            <textarea
              value={editedItem.itemDescription}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  itemDescription: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--copy-primary)",
                borderColor: "var(--card-shadow)",
              }}
              minLength={10}
              maxLength={500}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--copy-primary)" }}
            >
              Ingredients
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddIngredient();
                    }
                  }}
                  className="flex-1 px-3 py-2 border rounded-md"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--copy-primary)",
                    borderColor: "var(--card-shadow)",
                  }}
                  placeholder="Add an ingredient"
                />
                <button
                  onClick={handleAddIngredient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              <div
                className="mt-2 p-3 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--card-shadow)",
                }}
              >
                <div
                  className="text-sm font-medium mb-2"
                  style={{ color: "var(--copy-primary)" }}
                >
                  {ingredients.length > 0
                    ? "Current Ingredients:"
                    : "No ingredients added yet"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      {ingredient}
                      <button
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--copy-primary)" }}
            >
              Price
            </label>
            <input
              type="number"
              value={editedItem.itemPrice}
              onChange={(e) =>
                setEditedItem({ ...editedItem, itemPrice: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--copy-primary)",
                borderColor: "var(--card-shadow)",
              }}
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedItem.itemSweet}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      itemSweet: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>Sweet</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedItem.itemSpicy}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      itemSpicy: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>Spicy</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedItem.itemIsVeg}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      itemIsVeg: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>Vegetarian</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedItem.itemAvailable}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      itemAvailable: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>Available</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedItem.itemBestSeller}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      itemBestSeller: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>
                  Best Seller
                </span>
              </label>
            </div>
          </div>

          {editedItem.itemSpicy && (
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--copy-primary)" }}
              >
                Spice Level (0-5)
              </label>
              <input
                type="number"
                value={editedItem.itemSpiceLevel}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    itemSpiceLevel: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--copy-primary)",
                  borderColor: "var(--card-shadow)",
                }}
                min="0"
                max="5"
                step="1"
              />
            </div>
          )}

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--copy-primary)" }}
            >
              Thumbnail Image URL
            </label>
            <input
              type="text"
              value={editedItem.itemImages[0] || ""}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  itemImages: [e.target.value],
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--copy-primary)",
                borderColor: "var(--card-shadow)",
              }}
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              style={{ backgroundColor: "var(--card-shadow)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cardContent = (
    <li
      className={`flex justify-between items-start gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 rounded-2xl shadow-md transition-all hover:shadow-lg ${
        !isAvailable ? "opacity-60" : ""
      }`}
      style={{
        backgroundColor: "var(--card)",
        color: "var(--copy-primary)",
        borderColor: "var(--card-shadow)",
      }}
    >
      <MenuItemImage name={item.itemName} imageUrl={item.itemImages[0]} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <span
            className="font-semibold text-base sm:text-lg block mb-0.5 sm:mb-1"
            style={{ color: "var(--copy-primary)" }}
            title={item.itemName}
          >
            {item.itemName}
          </span>
          {item.itemBestSeller && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
              Best Seller
            </span>
          )}
        </div>
        <p
          className="line-clamp-2 text-xs sm:text-sm mb-1 sm:mb-2"
          style={{ color: "var(--copy-secondary)" }}
          title={item.itemDescription}
        >
          {item.itemDescription}
        </p>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <span
            className="font-medium text-sm sm:text-base block"
            style={{ color: "var(--price-text)" }}
          >
            {formatPrice(item.itemPrice)}
          </span>
          {!isAvailable && (
            <span className="text-xs sm:text-sm text-red-600">
              (Not Available)
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
          {item.itemIsVeg && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
              Veg
            </span>
          )}
          {item.itemIsJain && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-800 rounded-full whitespace-nowrap">
              Jain
            </span>
          )}
          {item.itemSpicy && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-red-100 text-red-800 rounded-full whitespace-nowrap">
              Spicy
            </span>
          )}
        </div>
      </div>
      {/* Edit and Delete buttons container */}
      {isEditable && (
        <div className="flex flex-col gap-2">
          {onUpdate && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Edit item"
            >
              <Edit2
                className="w-4 h-4"
                style={{ color: "var(--copy-primary)" }}
              />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              title="Delete item"
            >
              <Trash2
                className="w-4 h-4"
                style={{ color: "rgb(239, 68, 68)" }}
              />
            </button>
          )}
        </div>
      )}
    </li>
  );

  if (isEditable) {
    return cardContent;
  }

  return (
    <Link
      href={`/restaurant/menu/${restaurantId}/${item.itemId}`}
      className={`block ${!isAvailable ? "pointer-events-none" : ""}`}
    >
      {cardContent}
    </Link>
  );
};

MenuItemCard.displayName = "MenuItemCard";
