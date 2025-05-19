import React, { memo, Suspense } from "react";
import Image from "next/image";

// Move to types/menu.ts in a real application
interface MenuItem {
  itemId: number;
  itemName: string;
  restId: number;
  itemPrice: string;
  itemDescription: string;
  itemSweet: boolean;
  itemSpicy: boolean;
  itemSweetLevel: number;
  itemSpiceLevel: number;
  itemAvailable: boolean;
  itemBestSeller: boolean;
  itemIsVeg: boolean;
  itemIsJain: boolean;
  itemImage?: string; // Optional image URL
}

// Loading skeleton for menu items
const MenuItemSkeleton = () => (
  <li className="flex justify-between items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 border rounded-lg animate-pulse">
    <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
      <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-1 sm:space-y-2">
        <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="flex-shrink-0 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] bg-gray-200 rounded-lg"></div>
  </li>
);

// Optimized image component with fallback
const MenuItemImage = memo(
  ({ name, imageUrl }: { name: string; imageUrl?: string }) => {
    return (
      <div className="flex-shrink-0 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] rounded-lg overflow-hidden relative bg-gray-100">
        <Image
          src={imageUrl || "/DummyDishImage.jpg"}
          alt={name}
          fill
          sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
          className="object-cover"
          loading="lazy"
          priority={false}
        />
      </div>
    );
  }
);

MenuItemImage.displayName = "MenuItemImage";

// Memoized MenuItem component with error boundary
const MenuItemCard = memo(({ item }: { item: MenuItem }) => {
  const isAvailable = item.itemAvailable;

  return (
    <li
      className={`flex justify-between items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        !isAvailable ? "opacity-60" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <span
            className="font-semibold text-base sm:text-lg block mb-0.5 sm:mb-1"
            title={item.itemName}
          >
            {item.itemName}
          </span>
          {item.itemBestSeller && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
              Best Seller
            </span>
          )}
        </div>
        <p
          className="text-gray-600 line-clamp-2 text-xs sm:text-sm mb-1 sm:mb-2"
          title={item.itemDescription}
        >
          {item.itemDescription}
        </p>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <span className="font-medium text-green-600 text-sm sm:text-base block">
            ${item.itemPrice}
          </span>
          {!isAvailable && (
            <span className="text-xs sm:text-sm text-red-600">
              (Not Available)
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
          {item.itemIsVeg && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
              Veg
            </span>
          )}
          {item.itemIsJain && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-800 rounded-full whitespace-nowrap">
              Jain
            </span>
          )}
        </div>
      </div>
      <MenuItemImage name={item.itemName} imageUrl={item.itemImage} />
    </li>
  );
});

MenuItemCard.displayName = "MenuItemCard";

// Menu list component with loading state
const MenuList = memo(({ items }: { items: MenuItem[] }) => (
  <ul className="grid gap-2 sm:gap-3 md:gap-4">
    {items.map((item) => (
      <Suspense key={item.itemId} fallback={<MenuItemSkeleton />}>
        <MenuItemCard item={item} />
      </Suspense>
    ))}
  </ul>
));

MenuList.displayName = "MenuList";

const Menu = async () => {
  const menuItems: MenuItem[] = [
    {
      itemId: 1,
      itemName: "Butter Chicken",
      restId: 0,
      itemPrice: "12.99",
      itemDescription:
        "Tender chicken pieces in a rich, creamy tomato-based curry sauce",
      itemSweet: false,
      itemSpicy: true,
      itemSweetLevel: 2,
      itemSpiceLevel: 4,
      itemAvailable: true,
      itemBestSeller: true,
      itemIsVeg: false,
      itemIsJain: false,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 2,
      itemName: "Paneer Tikka",
      restId: 0,
      itemPrice: "9.99",
      itemDescription:
        "Grilled cottage cheese cubes marinated in spices and yogurt",
      itemSweet: false,
      itemSpicy: true,
      itemSweetLevel: 1,
      itemSpiceLevel: 3,
      itemAvailable: true,
      itemBestSeller: true,
      itemIsVeg: true,
      itemIsJain: false,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 3,
      itemName: "Gulab Jamun",
      restId: 0,
      itemPrice: "5.99",
      itemDescription:
        "Sweet milk-solid balls soaked in rose-flavored sugar syrup",
      itemSweet: true,
      itemSpicy: false,
      itemSweetLevel: 5,
      itemSpiceLevel: 0,
      itemAvailable: true,
      itemBestSeller: false,
      itemIsVeg: true,
      itemIsJain: true,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 4,
      itemName: "Veg Biryani",
      restId: 0,
      itemPrice: "11.99",
      itemDescription:
        "Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
      itemSweet: false,
      itemSpicy: true,
      itemSweetLevel: 1,
      itemSpiceLevel: 3,
      itemAvailable: false,
      itemBestSeller: true,
      itemIsVeg: true,
      itemIsJain: false,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 5,
      itemName: "Chicken Tikka Masala",
      restId: 0,
      itemPrice: "13.99",
      itemDescription: "Grilled chicken in a creamy, spiced tomato-based curry",
      itemSweet: false,
      itemSpicy: true,
      itemSweetLevel: 2,
      itemSpiceLevel: 4,
      itemAvailable: true,
      itemBestSeller: true,
      itemIsVeg: false,
      itemIsJain: false,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 6,
      itemName: "Jain Thali",
      restId: 0,
      itemPrice: "14.99",
      itemDescription:
        "Complete meal with rotis, dal, sabzi, rice, and salad (Jain preparation)",
      itemSweet: false,
      itemSpicy: false,
      itemSweetLevel: 1,
      itemSpiceLevel: 1,
      itemAvailable: true,
      itemBestSeller: false,
      itemIsVeg: true,
      itemIsJain: true,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 7,
      itemName: "Mango Lassi",
      restId: 0,
      itemPrice: "4.99",
      itemDescription: "Sweet yogurt drink with fresh mango pulp",
      itemSweet: true,
      itemSpicy: false,
      itemSweetLevel: 4,
      itemSpiceLevel: 0,
      itemAvailable: true,
      itemBestSeller: false,
      itemIsVeg: true,
      itemIsJain: true,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 8,
      itemName: "Chicken Vindaloo",
      restId: 0,
      itemPrice: "13.99",
      itemDescription: "Spicy curry dish with chicken, potatoes, and vinegar",
      itemSweet: false,
      itemSpicy: true,
      itemSweetLevel: 1,
      itemSpiceLevel: 5,
      itemAvailable: true,
      itemBestSeller: false,
      itemIsVeg: false,
      itemIsJain: false,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 9,
      itemName: "Samosa",
      restId: 0,
      itemPrice: "3.99",
      itemDescription: "Crispy pastry filled with spiced potatoes and peas",
      itemSweet: false,
      itemSpicy: true,
      itemSweetLevel: 1,
      itemSpiceLevel: 3,
      itemAvailable: true,
      itemBestSeller: true,
      itemIsVeg: true,
      itemIsJain: false,
      itemImage: "/DummyDishImage.jpg",
    },
    {
      itemId: 10,
      itemName: "Kheer",
      restId: 0,
      itemPrice: "5.99",
      itemDescription:
        "Traditional rice pudding with milk, sugar, and cardamom",
      itemSweet: true,
      itemSpicy: false,
      itemSweetLevel: 4,
      itemSpiceLevel: 0,
      itemAvailable: true,
      itemBestSeller: false,
      itemIsVeg: true,
      itemIsJain: true,
      itemImage: "/DummyDishImage.jpg",
    },
  ];
  // const res = await fetch("http://localhost:3001/menu-items/0");
  // const menuItems: MenuItem = await res.json();
  return (
    <div className="grid w-full min-h-screen p-2 sm:p-3 md:p-4">
      <header className="w-full text-center mb-4 sm:mb-5 md:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Restaurant_name</h1>
      </header>
      <Suspense
        fallback={
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {[...Array(3)].map((_, i) => (
              <MenuItemSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MenuList items={menuItems} />
      </Suspense>
    </div>
  );
};

export default Menu;
