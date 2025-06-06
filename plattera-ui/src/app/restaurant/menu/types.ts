export interface MenuItem {
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
  itemImages: string[];
  category: string;
  ingredients?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// Helper function to create a new menu item
export function createMenuItem(
  itemName: string,
  restId: number,
  category: string,
  itemPrice: string = "0",
  itemDescription: string = "",
  itemImages: string[] = []
): MenuItem {
  return {
    itemId: Date.now(), // Use timestamp as temporary ID
    itemName,
    restId,
    itemPrice,
    itemDescription,
    itemSweet: false,
    itemSpicy: false,
    itemSweetLevel: 0,
    itemSpiceLevel: 0,
    itemAvailable: true,
    itemBestSeller: false,
    itemIsVeg: true,
    itemIsJain: false,
    itemImages,
    category,
  };
}
