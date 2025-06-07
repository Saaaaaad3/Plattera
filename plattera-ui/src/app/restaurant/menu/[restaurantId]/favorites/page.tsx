"use client";

import { useParams } from "next/navigation";

export default function FavoritesPage() {
  const params = useParams();
  const restaurantId = params?.restaurantId as string;

  return (
    <div className="py-8">
      <div className="container">
        <h1
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{ color: "var(--copy-primary)" }}
        >
          Favorites
        </h1>

        <div
          className="text-center py-12 rounded-lg"
          style={{
            color: "var(--copy-secondary)",
            backgroundColor: "var(--card)",
          }}
        >
          <p className="text-lg">Your favorite dishes will appear here</p>
        </div>
      </div>
    </div>
  );
}
