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
  itemImages: string[]; // Changed from itemImage?: string to itemImages: string[]
  category: string; // Category of the item (e.g., "veg", "non-veg", "drinks", "desserts")
  ingredients?: string[]; // Optional array of ingredients
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}
