"use client";

import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="relative">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50"
          style={{
            backgroundColor: "var(--card)",
          }}
        >
          {/* Login Button */}
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: "var(--copy-primary)" }}
            onClick={() => {
              // TODO: Implement login functionality
              console.log("Login clicked");
            }}
          >
            Login
          </button>

          {/* Theme Toggle */}
          <div className="px-4 py-2 flex items-center justify-between">
            <span style={{ color: "var(--copy-primary)" }}>Toggle</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
