"use client";

import React from "react";
import { ThemeToggleWrapper } from "@/app/components/ThemeToggleWrapper";
import { MenuCategory } from "./types";
import { CategorySection } from "./components/CategorySection";

interface MenuClientProps {
  categories: MenuCategory[];
}

export const MenuClient = ({ categories }: MenuClientProps) => {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--copy-primary)" }}
          >
            Menu
          </h1>
          <ThemeToggleWrapper />
        </div>
        <div className="space-y-6">
          {categories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};
