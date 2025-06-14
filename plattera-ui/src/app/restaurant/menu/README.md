# Restaurant Menu with Infinite Scroll

This implementation provides a scalable solution for displaying restaurant menus with category-based infinite scroll pagination. It's designed to handle restaurants with varying menu sizes (from 50 to 2000+ items) efficiently.

## Features

### 🚀 **Category-Based Infinite Scroll**

- Load items per category independently
- Automatic loading when scrolling near the bottom
- Manual "Load More" button for user control
- Responsive pagination settings

### 📱 **Responsive Design**

- Different pagination limits for mobile, tablet, and desktop
- Optimized intersection observer settings per device
- Adaptive loading behavior

### ⚡ **Performance Optimizations**

- Lazy loading of category items
- Efficient state management with React Context
- Debounced scroll events
- Memory management for large datasets

### 🎯 **User Experience**

- Loading indicators and states
- Progress indicators showing loaded/total items
- Empty state handling
- Smooth scrolling experience

## Architecture

### Core Components

1. **MenuContext** (`context/MenuContext.tsx`)

   - Manages category-based pagination state
   - Handles API calls and data fetching
   - Provides methods for CRUD operations

2. **CategorySection** (`components/CategorySection.tsx`)

   - Renders individual category sections
   - Implements infinite scroll logic
   - Handles responsive behavior

3. **useInfiniteScroll** (`hooks/useInfiniteScroll.ts`)

   - Custom hook for intersection observer
   - Manages scroll detection and callbacks
   - Configurable threshold and root margin

4. **Pagination Config** (`config/pagination.ts`)
   - Centralized configuration for pagination settings
   - Responsive breakpoints and limits
   - Performance tuning options

## Usage

### Basic Implementation

```tsx
import { CategorySection } from "./components/CategorySection";

function MenuPage() {
  return (
    <div>
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          restaurantId="123"
          initialLoadLimit={10}
          loadMoreLimit={10}
        />
      ))}
    </div>
  );
}
```

### With Custom Configuration

```tsx
import { getPaginationSettings } from "./config/pagination";

const settings = getPaginationSettings("desktop");
// Returns: { INITIAL_LOAD_LIMIT: 15, LOAD_MORE_LIMIT: 15, ... }
```

## Configuration

### Pagination Settings

```typescript
export const PAGINATION_CONFIG = {
  INITIAL_LOAD_LIMIT: 10, // Items loaded initially
  LOAD_MORE_LIMIT: 10, // Items loaded per "Load More"
  INTERSECTION_OBSERVER: {
    ROOT_MARGIN: "100px", // Start loading 100px before visible
    THRESHOLD: 0.1, // Trigger when 10% visible
  },
  PERFORMANCE: {
    SCROLL_DEBOUNCE: 100, // Debounce scroll events
    MAX_ITEMS_PER_CATEGORY: 100, // Memory limit per category
  },
};
```

### Responsive Breakpoints

- **Mobile** (< 768px): 8 items per load
- **Tablet** (768px - 1024px): 12 items per load
- **Desktop** (> 1024px): 15 items per load

## API Integration

### Expected API Response

```typescript
interface CategoryItemsResponse {
  items: MenuItem[];
  totalItems: number;
  hasMore: boolean;
  page: number;
}
```

### Context Methods

```typescript
const {
  categoryPagination,
  fetchCategoryItems,
  loadMoreCategoryItems,
  updateMenuItem,
  deleteMenuItem,
  addMenuItem,
} = useMenu();

// Load initial items for a category
await fetchCategoryItems(restaurantId, categoryId, 1, 10);

// Load more items
await loadMoreCategoryItems(restaurantId, categoryId, 10);
```

## Performance Considerations

### Memory Management

- Items are loaded progressively to prevent memory bloat
- Configurable maximum items per category
- Efficient state updates with React Context

### Network Optimization

- Debounced API calls prevent excessive requests
- Configurable loading timeouts
- Error handling and retry logic

### User Experience

- Loading states prevent multiple simultaneous requests
- Smooth animations and transitions
- Responsive design adapts to device capabilities

## Customization

### Custom Pagination Limits

```tsx
<CategorySection
  category={category}
  restaurantId="123"
  initialLoadLimit={20} // Custom initial load
  loadMoreLimit={15} // Custom load more
/>
```

### Custom Intersection Observer

```tsx
const { ref } = useInfiniteScroll(handleLoadMore, {
  rootMargin: "200px", // Custom margin
  threshold: 0.5, // Custom threshold
  enabled: hasMoreItems, // Conditional enabling
});
```

## Best Practices

1. **Set Appropriate Limits**: Balance between performance and user experience
2. **Handle Edge Cases**: Empty categories, loading errors, network issues
3. **Optimize Images**: Use proper image sizing and lazy loading
4. **Monitor Performance**: Track loading times and user interactions
5. **Test Responsively**: Ensure smooth experience across all devices

## Troubleshooting

### Common Issues

1. **Items not loading**: Check API endpoints and error handling
2. **Infinite loading**: Verify `hasMore` flag in API response
3. **Performance issues**: Adjust pagination limits and debounce settings
4. **Memory leaks**: Ensure proper cleanup in useEffect hooks

### Debug Mode

Enable debug logging by setting environment variable:

```bash
NEXT_PUBLIC_DEBUG_MENU=true
```

## Future Enhancements

- Virtual scrolling for extremely large menus
- Search and filtering within categories
- Offline support with caching
- Analytics and user behavior tracking
- A/B testing for optimal pagination settings
