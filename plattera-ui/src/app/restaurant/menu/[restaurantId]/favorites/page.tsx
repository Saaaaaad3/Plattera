"use client";

import React from "react";
import { useParams } from "next/navigation";
import { BurgerMenu } from "@/app/components/BurgerMenu";

export default function FavoritesPage() {
  const params = useParams();
  const restaurantId = params?.restaurantId as string;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--copy-primary)" }}
          >
            Favorites
          </h1>
          <BurgerMenu />
        </div>

        <div
          className="text-center py-12"
          style={{ color: "var(--copy-secondary)" }}
        >
          <p>Your favorite dishes will appear here</p>
        </div>
      </div>
    </div>
  );
}
