"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "../types";
import { Edit2, Trash2 } from "lucide-react";

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
  const isAvailable = item.itemAvailable;

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedItem);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  if (isEditing) {
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
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--copy-primary)" }}
            >
              Price
            </label>
            <input
              type="text"
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
            ₹{item.itemPrice}
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
