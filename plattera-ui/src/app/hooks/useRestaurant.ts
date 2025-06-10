"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../utils/apiClient";

interface Restaurant {
  restId: number;
  userId: number;
  name: string;
  description: string | null;
  address: string;
  createdAt: string;
  updatedAt: string;
  user: {
    userName: string;
  };
  categories: any[];
}

export function useRestaurant() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure we're in a client context and params is available
    if (typeof window === "undefined") return;

    const restaurantId = params?.restaurantId as string | undefined;

    if (!restaurantId) {
      setRestaurant(null);
      setIsLoading(false);
      return;
    }

    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiFetch(
          `/restaurant/GetRestInfoByRestId/${restaurantId}`
        );
        setRestaurant(data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch restaurant details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [params?.restaurantId]);

  return { restaurant, isLoading, error };
}
