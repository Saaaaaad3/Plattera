"use client";

import React, { useState, useEffect } from "react";
import { BookOpenIcon } from "lucide-react";
import { MenuCategory } from "../types";

interface FloatingMenuButtonProps {
  categories: MenuCategory[];
}

export const FloatingMenuButton = ({ categories }: FloatingMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Prevent background scroll when interacting with the dropdown
  const stopScrollPropagation = (e: React.UIEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="bg-black text-white p-4 rounded-full shadow-lg focus:outline-none"
        onClick={toggleMenu}
      >
        <BookOpenIcon size={24} />
      </button>

      {isOpen && (
        <div
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-48 max-h-64 overflow-y-auto"
          onWheel={stopScrollPropagation}
          onTouchMove={stopScrollPropagation}
        >
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex justify-between items-center py-2"
              >
                <a
                  href={`#${category.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(category.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setIsOpen(false);
                  }}
                  className="hover:underline cursor-pointer"
                >
                  <span>{category.name}</span>
                </a>
                <span className="text-gray-500 text-sm">
                  {category.items.length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
