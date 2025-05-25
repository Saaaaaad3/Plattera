import { MenuContainer } from "@/app/restaurant/menu/MenuContainer";

// This is a Server Component by default in the App Router
// It receives route parameters in the `params` prop
export default function RestaurantMenuPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const restaurantId = params.restaurantId;

  // Pass the restaurantId to MenuContainer for data fetching
  return <MenuContainer restaurantId={restaurantId} />;
}
