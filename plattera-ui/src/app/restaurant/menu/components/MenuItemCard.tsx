"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "../types";

// Optimized image component with fallback
const MenuItemImage = memo(
  ({ name, imageUrl }: { name: string; imageUrl?: string }) => {
    return (
      <div className="flex-shrink-0 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-lg overflow-hidden relative bg-gray-100">
        <Image
          src={imageUrl || "/DummyDishImage.jpg"}
          alt={name}
          fill
          sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 140px"
          className="object-cover"
          loading="lazy"
          priority={false}
        />
      </div>
    );
  }
);

MenuItemImage.displayName = "MenuItemImage";

// Memoized MenuItem component
export const MenuItemCard = memo(
  ({ item, restaurantId }: { item: MenuItem; restaurantId: string }) => {
    const isAvailable = item.itemAvailable;

    return (
      <Link
        href={`/restaurant/menu/${restaurantId}/${item.itemId}`}
        className={`block ${!isAvailable ? "pointer-events-none" : ""}`}
      >
        <li
          className={`flex justify-between items-center gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 rounded-2xl shadow-md transition-all hover:shadow-lg ${
            !isAvailable ? "opacity-60" : ""
          }`}
          style={{
            backgroundColor: "var(--card)",
            color: "var(--copy-primary)",
            borderColor: "var(--card-shadow)",
          }}
        >
          <MenuItemImage name={item.itemName} imageUrl={item.itemImage} />
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
                ${item.itemPrice}
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
            </div>
          </div>
        </li>
      </Link>
    );
  }
);

MenuItemCard.displayName = "MenuItemCard";
