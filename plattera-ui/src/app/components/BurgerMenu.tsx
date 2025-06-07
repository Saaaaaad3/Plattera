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

  // Check if we're on the update page
  const isUpdatePage = pathname.includes("/update");

  const handleLoginClick = () => {
    setIsOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleMenuActionClick = () => {
    setIsOpen(false);
    const restaurantId = getRestaurantId();
    if (restaurantId) {
      if (isUpdatePage) {
        // If on update page, go back to menu view
        router.push(`/restaurant/menu/${restaurantId}`);
      } else {
        // If on menu view, go to update page
        router.push(`/restaurant/menu/${restaurantId}/update`);
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
