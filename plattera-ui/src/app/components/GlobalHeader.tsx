"use client";

import { useState, useEffect } from "react";
import { BurgerMenu } from "./BurgerMenu";
import { useRestaurant } from "../hooks/useRestaurant";

export function GlobalHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { restaurant, isLoading } = useRestaurant();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at the top of the page
      // Hide header when scrolling down
      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        backgroundColor: "var(--background)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="container h-16 flex items-center justify-between">
        {/* Left side - empty for balance */}
        <div className="w-12 md:w-16" />

        {/* Center - Restaurant Name/Logo */}
        <div className="flex-1 flex justify-center items-center">
          {isLoading ? (
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          ) : (
            <h1
              className="text-xl md:text-2xl font-bold"
              style={{ color: "var(--copy-primary)" }}
            >
              {restaurant?.name || "Plattera"}
            </h1>
          )}
        </div>

        {/* Right side - Burger Menu */}
        <div className="w-12 md:w-16 flex justify-end">
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
}
