"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { demoMenuItems } from "@/app/restaurants/menu/demoData"; // Import your demo data
import { MenuItem } from "@/app/restaurants/menu/types"; // Import MenuItem type
import { ArrowLeft } from "lucide-react"; // Import the ArrowLeft icon

export default function FoodItemPage() {
  const params = useParams();
  const router = useRouter(); // Get router instance
  const foodItemId = params.id; // This will be a string

  // Find the food item in your data based on the id
  const foodItem = demoMenuItems.find(
    (item) => item.itemId === parseInt(foodItemId as string, 10)
  );

  // Handle case where food item is not found
  if (!foodItem) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <p
          className="text-xl font-semibold"
          style={{ color: "var(--copy-primary)" }}
        >
          Food item not found.
        </p>
      </div>
    );
  }

  // --- Generate Random Recommended Sides ---
  // Filter out the current item and unavailable items
  const availableItems = demoMenuItems.filter(
    (item) => item.itemId !== foodItem.itemId && item.itemAvailable
  );

  // Shuffle the available items and take the first few (e.g., 3)
  const shuffledItems = availableItems.sort(() => 0.5 - Math.random());
  const recommendedSides = shuffledItems.slice(0, 3);
  // ----------------------------------------

  // Now using the ingredients array from the foodItem data
  const ingredientsList = foodItem.ingredients || [];

  // Placeholder for nutritional data (replace later if needed, using dummy values for now)
  const dummyNutrition = {
    kcal: "N/A",
    grams: "N/A",
    proteins: "N/A",
    carbs: "N/A",
    fats: "N/A",
  };

  // If you want to use the hardcoded nutrition structure from the image, you'd need to parse it from the description or add it to your MenuItem type.
  // For now, let's just show the dummy values or hide the section if no real data exists.
  const displayNutrition = false; // Set to true if you add nutrition data to MenuItem type

  return (
    <div
      className="min-h-screen pb-16"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Food Image */}
      <div className="relative w-full h-80">
        <Image
          src={foodItem.itemImage || "/DummyDishImage.jpg"} // Use itemImage from data
          alt={foodItem.itemName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        {/* Rating is not in your MenuItem type, adding placeholder logic if you add it later */}
        {/* {foodItem.rating && (
          <div className="absolute top-4 right-4 bg-white text-yellow-500 px-3 py-1 rounded-full flex items-center text-sm font-semibold">
            <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21L12 17.27z" />
            </svg>
            {foodItem.rating.toFixed(1)}
          </div>
        )}*/}
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          style={{ color: "var(--copy-primary)" }}
        >
          <ArrowLeft className="w-5 h-5" />
          {/* Optional: Add text like 'Back to Menu' */}
        </button>

        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--copy-primary)" }}
            >
              {foodItem.itemName}
            </h1>
            {/* Best Seller, Veg, Jain tags */}
            <div className="flex flex-wrap gap-2 mt-1">
              {foodItem.itemBestSeller && (
                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                  Best Seller
                </span>
              )}
              {foodItem.itemIsVeg && (
                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                  Veg
                </span>
              )}
              {foodItem.itemIsJain && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full whitespace-nowrap">
                  Jain
                </span>
              )}
            </div>
          </div>
          <span
            className="text-2xl font-semibold"
            style={{ color: "var(--price-text)" }}
          >
            ${foodItem.itemPrice}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-base mb-6"
          style={{ color: "var(--copy-secondary)" }}
        >
          {foodItem.itemDescription}
        </p>

        {/* Nutritional Info (Conditionally display if you have real data) */}
        {displayNutrition && (
          <div
            className="bg-gray-800 rounded-lg p-4 grid grid-cols-5 text-center gap-4 mb-6"
            style={{ backgroundColor: "var(--card)" }}
          >
            {Object.entries(dummyNutrition).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center">
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--copy-primary)" }}
                >
                  {value}
                </span>
                <span
                  className="text-sm capitalize"
                  style={{ color: "var(--copy-secondary)" }}
                >
                  {key}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Ingredients - Display as horizontal blocks */}
        {ingredientsList.length > 0 && (
          <>
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: "var(--copy-primary)" }}
            >
              Ingredients
            </h2>
            <div className="flex space-x-3 overflow-x-auto pb-4">
              {ingredientsList.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-4 py-3 rounded-lg text-center whitespace-nowrap"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--copy-primary)",
                  }}
                >
                  <span className="text-sm font-medium">{ingredient}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recommended Sides */}
        {recommendedSides.length > 0 && (
          <>
            {" "}
            {/* Use a fragment to group without adding extra DOM node */}
            <h2
              className="text-xl font-semibold mb-3 mt-6"
              style={{ color: "var(--copy-primary)" }}
            >
              Recommended sides
            </h2>
            <div className="space-y-4">
              {recommendedSides.map((side) => (
                <div
                  key={side.itemId}
                  className="flex items-center bg-gray-700 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: "var(--card)" }}
                  // Add onClick to navigate to the side item's page
                  onClick={() => router.push(`/food-items/${side.itemId}`)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 relative">
                    <Image
                      src={side.itemImage || "/DummyDishImage.jpg"} // Use itemImage from data
                      alt={side.itemName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-semibold"
                      style={{ color: "var(--copy-primary)" }}
                    >
                      {side.itemName}
                    </h3>{" "}
                    {/* Use itemName */}
                    {/* Rating is not in your MenuItem type */}
                    {/* <div className="flex items-center text-sm" style={{ color: "var(--copy-secondary)" }}>
                      <svg className="w-4 h-4 mr-1 fill-current text-yellow-500" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21L12 17.27z" />
                      </svg>
                      <span>{side.rating.toFixed(1)}</span>
                    </div> */}
                    <span
                      className="font-medium"
                      style={{ color: "var(--price-text)" }}
                    >
                      ${side.itemPrice}
                    </span>{" "}
                    {/* Use itemPrice */}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
