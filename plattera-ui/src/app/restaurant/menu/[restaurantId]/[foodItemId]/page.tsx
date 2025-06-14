"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { demoMenuItems } from "@/app/restaurant/menu/demoData"; // Import your demo data
import { MenuItem } from "@/app/restaurant/menu/types"; // Import MenuItem type
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react"; // Import the ArrowLeft, Chevron, and X icons
import { useState, useRef, useEffect, TouchEvent, useMemo } from "react";
import { formatPrice } from "@/utils/currency";

export default function FoodItemPage() {
  const params = useParams();
  // Access both restaurantId and foodItemId from params
  const { restaurantId, foodItemId } = params;

  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null); // Ref for the modal content div

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Effect to determine if desktop for showing/hiding buttons
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Find the food item in your data based on the foodItemId
  // Note: For a multi-restaurant app, you'd filter by restaurantId first
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
  // Use useMemo to prevent re-generation on every render
  const recommendedSides = useMemo(() => {
    // Filter out the current item and unavailable items
    const availableItems = demoMenuItems.filter(
      (item) => item.itemId !== foodItem.itemId && item.itemAvailable
    );

    // Shuffle the available items and take the first few (e.g., 3)
    const shuffledItems = availableItems.sort(() => 0.5 - Math.random());
    return shuffledItems.slice(0, 3);
  }, [foodItem.itemId]); // Only regenerate when the food item changes
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

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? foodItem.itemImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === foodItem.itemImages.length - 1 ? 0 : prev + 1
    );
  };

  // Touch handlers - used for both main image and modal content
  const onTouchStart = (e: TouchEvent) => {
    touchEndX.current = null; // Reset the end X position
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Apply swipe logic only if not on desktop (for main image) or if in modal
    if ((!isDesktop && !isModalOpen) || isModalOpen) {
      if (isLeftSwipe) {
        handleNextImage();
      }
      if (isRightSwipe) {
        handlePreviousImage();
      }
    }

    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally reset image index when closing modal
    // setCurrentImageIndex(0);
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  return (
    <div
      className="min-h-screen pb-16"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Food Image Section (Main View) */}
      <div
        className="relative w-full h-80 cursor-pointer"
        onClick={openModal} // Open modal on click
        onTouchStart={onTouchStart} // Re-attached touch handlers
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={foodItem.itemImages[currentImageIndex]}
          alt={`${foodItem.itemName} - Image ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover select-none" // Keep object-cover for main view
        />

        {/* Navigation Buttons (Desktop only) - Only show on main view for desktop when modal is closed */}
        {foodItem.itemImages.length > 1 && !isModalOpen && isDesktop && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePreviousImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter (Main View) - Only show on main view when modal is closed */}
        {foodItem.itemImages.length > 1 && !isModalOpen && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {foodItem.itemImages.length}
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeModal} // Close modal when clicking outside image content
        >
          {/* Modal Content - Prevent modal closing when clicking inside and attach touch handlers */}
          <div
            ref={modalContentRef}
            className="relative w-full max-w-screen-lg h-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside content
            onTouchStart={onTouchStart} // Attached touch handlers here
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={foodItem.itemImages[currentImageIndex]}
              alt={`${foodItem.itemName} - Image ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-contain select-none"
            />

            {/* Modal Navigation Buttons (Desktop only within modal, touch handled by swipe) */}
            {foodItem.itemImages.length > 1 && isDesktop && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Modal Image Counter */}
            {foodItem.itemImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                {currentImageIndex + 1} / {foodItem.itemImages.length}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

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
            className="text-2xl font-semibold text-center"
            style={{ color: "var(--price-text)" }}
          >
            {formatPrice(foodItem.itemPrice)}
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
                  onClick={() =>
                    router.push(
                      `/restaurant/menu/${restaurantId}/${side.itemId}`
                    )
                  }
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 relative flex-shrink-0">
                    <Image
                      src={side.itemImages[0] || "/DummyDishImage.jpg"}
                      alt={side.itemName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1">
                      <span
                        className="font-semibold text-base"
                        style={{ color: "var(--copy-primary)" }}
                      >
                        {side.itemName}
                      </span>
                      {side.itemBestSeller && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                          Best Seller
                        </span>
                      )}
                      {side.itemIsVeg && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                          Veg
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm line-clamp-2 mt-1"
                      style={{ color: "var(--copy-secondary)" }}
                    >
                      {side.itemDescription}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--price-text)" }}
                      >
                        {formatPrice(side.itemPrice)}
                      </span>
                    </div>
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
