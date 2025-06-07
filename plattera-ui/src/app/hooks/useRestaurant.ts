"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../utils/apiClient";

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

export function useRestaurant() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restaurantId = params?.restaurantId as string;

    if (!restaurantId) {
      setRestaurant(null);
      setIsLoading(false);
      return;
    }

    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiFetch(`/restaurants/${restaurantId}`);
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
