import React from "react";

const Menu = async () => {
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
  }
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
      itemAvailable: true,
      itemBestSeller: true,
      itemIsVeg: true,
      itemIsJain: false,
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
    },
  ];
  // const res = await fetch("http://localhost:3001/menu-items/0");
  // const menuItems: MenuItem = await res.json();
  return (
    <>
      <h1>Restaurant_name</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.itemId}>{item.itemName}</li>
        ))}
      </ul>
    </>
  );
};

export default Menu;
