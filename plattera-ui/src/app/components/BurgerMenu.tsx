"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { LoginModal } from "./LoginModal";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { theme } = useTheme();
  const { isAuthenticated, userRole, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Extract restaurant ID from the current path
  const getRestaurantId = () => {
    const match = pathname.match(/\/restaurant\/menu\/(\d+)/);
    return match ? match[1] : null;
  };

  // Check if we're on specific pages
  const isUpdatePage = pathname.includes("/update");
  const isFavoritesPage = pathname.includes("/favorites");

  const handleLoginClick = () => {
    setIsOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleMenuActionClick = () => {
    setIsOpen(false);
    const restaurantId = getRestaurantId();
    if (restaurantId) {
      if (userRole === "RestOwner") {
        if (isUpdatePage) {
          // If on update page, go back to menu view
          router.push(`/restaurant/menu/${restaurantId}`);
        } else {
          // If on menu view, go to update page
          router.push(`/restaurant/menu/${restaurantId}/update`);
        }
      } else if (userRole === "Customer") {
        if (isFavoritesPage) {
          // If on favorites page, go back to menu view
          router.push(`/restaurant/menu/${restaurantId}`);
        } else {
          // If on menu view, go to favorites page
          router.push(`/restaurant/menu/${restaurantId}/favorites`);
        }
      }
    }
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    const restaurantId = getRestaurantId();
    // Set a global flag to indicate we're logging out
    window.isLoggingOut = true;
    logout(restaurantId || undefined);
  };

  return (
    <>
      <div className="relative">
        {/* Burger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: "var(--copy-primary)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--card-shadow)",
            }}
          >
            {!isAuthenticated ? (
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                style={{ color: "var(--copy-primary)" }}
                onClick={handleLoginClick}
              >
                Login
              </button>
            ) : (
              <>
                {userRole === "RestOwner" && (
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    style={{ color: "var(--copy-primary)" }}
                    onClick={handleMenuActionClick}
                  >
                    {isUpdatePage ? "Menu View" : "Update Menu"}
                  </button>
                )}
                {userRole === "Customer" && (
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    style={{ color: "var(--copy-primary)" }}
                    onClick={handleMenuActionClick}
                  >
                    {isFavoritesPage ? "Menu View" : "Favorites"}
                  </button>
                )}
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ color: "var(--copy-primary)" }}
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </>
            )}

            {/* Theme Toggle */}
            <div className="px-4 py-2 flex items-center justify-between">
              <span style={{ color: "var(--copy-primary)" }}>Toggle</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
