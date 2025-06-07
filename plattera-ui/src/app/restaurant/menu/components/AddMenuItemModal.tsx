"use client";

import React, { useState, useEffect } from "react";
import { MenuItem } from "../types";
import { X } from "lucide-react";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
  restaurantId: string;
  existingCategories: string[];
}

export const AddMenuItemModal = ({
  isOpen,
  onClose,
  onAdd,
  restaurantId,
  existingCategories,
}: AddMenuItemModalProps) => {
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    itemName: "",
    itemPrice: "",
    itemDescription: "",
    itemIngredients: "",
    itemSweet: false,
    itemSpicy: false,
    itemSpiceLevel: 0,
    itemAvailable: true,
    itemBestSeller: false,
    itemIsVeg: true,
    itemIsJain: false,
    itemImages: ["/DummyDishImage.jpg"],
    category: "",
  });

  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewItem({
        itemName: "",
        itemPrice: "",
        itemDescription: "",
        itemIngredients: "",
        itemSweet: false,
        itemSpicy: false,
        itemSpiceLevel: 0,
        itemAvailable: true,
        itemBestSeller: false,
        itemIsVeg: true,
        itemIsJain: false,
        itemImages: ["/DummyDishImage.jpg"],
        category: "",
      });
      setNewCategory("");
      setShowNewCategoryInput(false);
      setNewIngredient("");
    }
  }, [isOpen]);

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      const currentIngredients = newItem.itemIngredients
        ? newItem.itemIngredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean)
        : [];

      if (!currentIngredients.includes(newIngredient.trim())) {
        const updatedIngredients =
          currentIngredients.length > 0
            ? `${newItem.itemIngredients}, ${newIngredient.trim()}`
            : newIngredient.trim();

        setNewItem({
          ...newItem,
          itemIngredients: updatedIngredients,
        });
      }
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    const currentIngredients = newItem.itemIngredients
      ? newItem.itemIngredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    const updatedIngredients = currentIngredients
      .filter((i) => i !== ingredientToRemove)
      .join(", ");

    setNewItem({
      ...newItem,
      itemIngredients: updatedIngredients,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.itemName || !newItem.itemPrice || !newItem.category) {
      return;
    }

    const category = showNewCategoryInput ? newCategory : newItem.category;
    const itemToAdd: MenuItem = {
      ...(newItem as MenuItem),
      itemId: Date.now(), // Temporary ID, will be replaced by context
      restId: parseInt(restaurantId),
      category,
      itemIngredients: newItem.itemIngredients?.trim() || "",
    };

    onAdd(itemToAdd);
    onClose();
  };

  if (!isOpen) return null;

  const ingredients = newItem.itemIngredients
    ? newItem.itemIngredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--copy-primary)" }}
          >
            Add New Menu Item
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" style={{ color: "var(--copy-primary)" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--copy-primary)" }}
            >
              Name
            </label>
            <input
              type="text"
              value={newItem.itemName}
              onChange={(e) =>
                setNewItem({ ...newItem, itemName: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--copy-primary)",
                borderColor: "var(--card-shadow)",
              }}
              required
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
              value={newItem.itemDescription}
              onChange={(e) =>
                setNewItem({ ...newItem, itemDescription: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--copy-primary)",
                borderColor: "var(--card-shadow)",
              }}
              required
              minLength={10}
              maxLength={500}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--copy-primary)" }}
            >
              Category
            </label>
            {!showNewCategoryInput ? (
              <div className="space-y-2">
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--copy-primary)",
                    borderColor: "var(--card-shadow)",
                  }}
                  required
                >
                  <option value="">Select a category</option>
                  {existingCategories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() +
                        category.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add New Category
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--copy-primary)",
                    borderColor: "var(--card-shadow)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(false)}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
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
              value={newItem.itemPrice}
              onChange={(e) =>
                setNewItem({ ...newItem, itemPrice: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--copy-primary)",
                borderColor: "var(--card-shadow)",
              }}
              required
              min="0"
              step="0.01"
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
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newItem.itemSweet}
                  onChange={(e) =>
                    setNewItem({ ...newItem, itemSweet: e.target.checked })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>Sweet</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newItem.itemSpicy}
                  onChange={(e) =>
                    setNewItem({ ...newItem, itemSpicy: e.target.checked })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>Spicy</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newItem.itemIsVeg}
                  onChange={(e) =>
                    setNewItem({ ...newItem, itemIsVeg: e.target.checked })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>Vegetarian</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newItem.itemIsJain}
                  onChange={(e) =>
                    setNewItem({ ...newItem, itemIsJain: e.target.checked })
                  }
                  className="rounded"
                />
                <span style={{ color: "var(--copy-primary)" }}>Jain</span>
              </label>
            </div>
          </div>

          {newItem.itemSpicy && (
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--copy-primary)" }}
              >
                Spice Level (0-5)
              </label>
              <input
                type="number"
                value={newItem.itemSpiceLevel}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
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

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: "var(--copy-primary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
