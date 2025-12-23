# Product Search & Filter Engine with Virtualized List

A performance-focused search and filter system built with React and TypeScript, designed to handle large datasets efficiently through virtualization and optimization techniques.

## Quick Start

### Prerequisites

- Node.js 
- npm or pnpm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── FilterBox.tsx      # Filter controls with search, category, price, and status
│   ├── ListItem.tsx         # Individual item display component
│   └── VirtualList.tsx      # Custom virtualization implementation
│
├── hooks/
│   ├── useDebounced.ts # Debouncing hook for input optimization
│   └── useVirtualList.ts    # Core virtualization logic and scroll calculations
│
├── types/
│   └── share.types.ts            # Main data types (Item interface & Filter Interface)
│
├── utils/
│   ├── filterData.ts       # Pure filtering logic separated from UI
│   └── generateMockData.ts # Mock data generator (5000 items)
│
├── App.tsx                  # Main application component
└── main.tsx                # Application entry point
```

### File Descriptions

**components/FilterBox.tsx**: Manages all filter inputs including search text, category dropdown, price range inputs, and status selector. Implements immediate filtering without submit buttons for better user experience.

**components/ListItem.tsx**: Displays individual product information with styling. Kept simple without React.memo since VirtualList only renders visible items, making memoization unnecessary.

**components/VirtualList.tsx**: Custom virtualization implementation that renders only visible items plus an overscan buffer. Uses CSS transform for positioning instead of absolute top/left for GPU acceleration.

**hooks/useDebounced.ts**: Delays state updates to prevent excessive recomputations during rapid user input. Critical for maintaining smooth performance during typing.

**hooks/useVirtualList.ts**: Calculates which items should be visible based on scroll position. Handles viewport calculations, overscan logic, and scroll event management.

**types/**: TypeScript definitions ensuring type safety across the application. FilterState enforces specific status types while remaining flexible for other fields.

**utils/filterData.ts**: Pure function implementing all filtering logic in a single pass through the array. Returns early on failed conditions to avoid unnecessary checks.

**utils/generateMockData.ts**: Creates deterministic test data with varied categories and realistic price distributions for testing filter performance.

## Architecture Decisions

### State Management Strategy

The application uses a single FilterState object rather than separate state variables for each filter. This approach provides several benefits:

1. Easier to pass to child components as a single prop
2. Simpler dependency tracking in useMemo
3. Type safety for the entire filter set
4. Clearer update patterns
5. Easier to implement features like "clear all filters"

The filter state updates immediately on user input for responsive UI, but expensive filtering operations are debounced:

```typescript
const searchFilterDebounce = useDebounce(filters.search, 500);
const minPriceFilterDebounce = useDebounce(filters.minPrice, 500);
const maxPriceFilterDebounce = useDebounce(filters.maxPrice, 500);

const filterItems = useMemo(() => {
  return filterData(data, {
    ...filters,
    search: searchFilterDebounce,
    minPrice: minPriceFilterDebounce,
    maxPrice: maxPriceFilterDebounce,
  });
}, [
  data,
  filters,
  searchFilterDebounce,
  minPriceFilterDebounce,
  maxPriceFilterDebounce,
]);
// all filter fields affect the result so we depend on the filters object itself
```

This pattern allows the input fields to update immediately while delaying the actual filtering operation until the user pauses typing. The 500ms delay for price inputs is slightly longer than search (which could use 300ms) because numeric inputs typically require more deliberate input.

### Separation of Concerns

The codebase maintains clear boundaries between different responsibilities:

**UI Components**: Focus solely on rendering and user interaction. They remain presentational and delegate business logic to hooks and utility functions.

**Custom Hooks**: Encapsulate reusable stateful logic. useDebouncedValue and useVirtualList can be extracted and used in other projects without modification.

**Pure Functions**: Filtering logic lives in utils/filterData.ts as a pure function. This makes it easy to test, reason about, and optimize independently of React's rendering cycle.

**Type Definitions**: Centralized in the types directory, ensuring consistency across the application and catching potential bugs at compile time.

## Performance Optimizations

### 1. Debouncing User Input

Without debouncing, filtering 5000 items on every keystroke would cause noticeable lag. The debounce hook delays expensive operations until the user stops typing:

```typescript
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

The cleanup function is crucial here. It cancels the previous timer when a new value arrives, ensuring only the final value triggers the filtering operation.

### 2. Memoization Strategy

The application uses useMemo strategically for expensive computations:

**Categories extraction**: Computed once from the base data and never recalculated unless the data changes.

**Filtered results**: Only recalculated when actual filter values change (after debouncing), not on every render.

**Render function**: Wrapped in useCallback to maintain referential equality, preventing unnecessary re-renders of the VirtualList component.

I deliberately avoided over-memoization. ListItem components are not wrapped in React.memo because:

- Only 10-20 items are rendered at once
- When filters change, the items themselves change, so memoization provides no benefit
- Premature optimization here would add complexity without measurable performance gains

### 3. Efficient Filtering Algorithm

The filterData function uses a single-pass algorithm with early returns:

```typescript
export const filterData = (
  data: IListItem[],
  filters: IFilters
): IListItem[] => {
  return data.filter((itm) => {
    if (filters.search.trim()) {
      const normalWord = filters.search.toLowerCase();
      if (!itm.name.toLowerCase().includes(normalWord)) return false;
    }

    if (filters.category) {
      const normalCategory = filters.category.toLowerCase();
      if (!itm.category.toLowerCase().includes(normalCategory)) return false;
    }

    // more conditions ....

    return true;
  });
};
```

This approach ensures O(n) complexity where n is the number of items. Each item is examined exactly once, and we skip unnecessary comparisons as soon as a condition fails.

The order of conditions matters for performance. Search is checked first because it's most likely to filter out items quickly. More specific filters like category and status come next.

### 4. Key Selection for List Items

A critical but often overlooked detail is using stable, unique keys for list items:

```typescript
{
  visibleItems.map((item, index) => {
    const actualIndex = range.startIndex + index;
    return (
      <div key={item.id}>
        {" "}
        {/* Using item.id, not index */}
        {renderListItem(item, listRange.startIndex + idx)}
      </div>
    );
  });
}
```

Using item.id instead of array index is essential because:

- When filters change, different items occupy the same positions
- React uses keys to determine which DOM nodes to reuse
- Index-based keys would cause React to incorrectly reuse nodes, leading to rendering bugs
- Unique IDs ensure React correctly unmounts old items and mounts new ones

## Virtualized List Implementation

### Why Custom Implementation?

I chose to implement virtualization from scratch rather than using react-window or react-virtualized for several reasons:

**Learning and Control**: Building it myself demonstrates understanding of the underlying concepts rather than just importing a library.

**Bundle Size**: The custom implementation is under 100 lines and adds minimal bundle size compared to external libraries.

**Specific Requirements**: The implementation is tailored exactly to this use case without the overhead of features we don't need.

**Interview Context**: Creating it from scratch better showcases problem-solving abilities and React knowledge.

That said, for a production application, I would likely use react-window for its battle-tested edge case handling and broader browser support.

### How Virtualization Works

The core concept is simple: only render items currently visible in the viewport, plus a small buffer (overscan) for smooth scrolling.

**Step 1: Calculate visible range**

```typescript
const itemVisibleCount = Math.ceil(containerHeight / itemHeight);

const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - moreScan);
const endIndex = Math.min(
  itemCount - 1,
  startIndex + itemVisibleCount + moreScan * 2
);
```

As the user scrolls, we calculate which items should be visible based on the scroll position and viewport height.

**Step 2: Create a spacer**

```typescript
<div style={{ height: `${totalHeight}px` }}>
  {/* This maintains the scrollbar size */}
</div>
```

A container with the height of all items creates the illusion of a full list and maintains correct scrollbar behavior.

**Step 3: Position visible items**

```typescript
<div style={{ transform: `translateY(${offsetY}px)` }}>
  {visibleItems.map(...)}
</div>
```

Instead of absolute positioning, we use CSS transform which is GPU-accelerated and performs better during scrolling.

**Step 4: Overscan for smooth scrolling**

The overscan parameter renders a few extra items above and below the viewport. This prevents blank flashes when scrolling quickly. An overscan of 3-5 items balances smoothness with memory usage.

### Limitations and Trade-offs

**Fixed Item Height**: The current implementation requires all items to have the same height. Supporting variable heights would require measuring each item and maintaining a height cache, significantly increasing complexity.

**Horizontal Scrolling**: Only vertical scrolling is supported. Adding horizontal virtualization would require 2D viewport calculations.

**Scroll Performance**: While smooth for most use cases, extremely rapid scrolling on slower devices might show brief blank areas before items render. This could be mitigated by increasing overscan at the cost of rendering more items.

**Memory vs Performance**: We're trading memory (keeping 5000 items in state) for rendering performance (only drawing 20 items). For truly massive datasets (100k+ items), you'd want server-side pagination.

**ResizeObserver**: The implementation doesn't handle dynamic container resizing. In a production app, you'd want to listen for resize events and recalculate the visible range.

## Key Technical Decisions

### TypeScript Usage

The application makes extensive use of TypeScript's type system:

**Discriminated Unions**: The status field uses a union type of literal strings rather than a simple string, catching typos at compile time.

**Generic Constraints**: VirtualList uses a generic type constrained to objects with an id property, ensuring it can only be used with appropriate data.

**Interface Composition**: FilterState and Item interfaces are defined separately and composed where needed, promoting reusability.

### Immediate Apply Pattern

Filters apply immediately without a submit button. This is the modern standard for filter UIs because:

- Users get instant feedback on their selections
- It encourages exploration and experimentation with filters
- Combined with debouncing, it doesn't harm performance
- Most major e-commerce sites (Amazon, eBay) use this pattern

The only downside is that it requires careful performance optimization, which this implementation addresses through debouncing and memoization.

### Styling Approach

The project uses Tailwind CSS for styling because:

- Utility classes keep component files self-contained
- No CSS modules or styled-components dependency
- Fast development without context switching
- Small bundle size with proper purging

Inline styles are used sparingly only for dynamic values that can't be expressed as utility classes (like transform offsets in virtualization).

## Testing Approach

While this implementation doesn't include formal tests, here's how I would approach testing:

**Unit Tests**: filterData function is a pure function, making it trivial to test with various input combinations.

**Hook Tests**: useDebouncedValue can be tested with React Testing Library's renderHook utility and fake timers.

**Component Tests**: FilterPanel and ListItem can be tested in isolation by mocking their props.

**Integration Tests**: Testing the full flow of typing in the search box and verifying filtered results appear would catch most bugs.

**Performance Tests**: Using React DevTools Profiler to measure render times and ensure they stay under acceptable thresholds (16ms for 60fps).

## Resources and Learning

This implementation was built using knowledge from:

- YouTube tutorials on React performance optimization
- dev.to articles about virtualization techniques
- Official React documentation on useMemo and useCallback
- TypeScript handbook for advanced type patterns

## Future Improvements

Given more time, I would consider:

**Accessibility**: Adding ARIA labels, keyboard navigation, and screen reader support for the filter controls.

**Persistence**: Saving filter state to URL query parameters so users can share or bookmark filtered views.

**Advanced Filtering**: Supporting multiple categories, range sliders for price, or full-text search with highlighting.

**Sort Options**: Allowing users to sort results by name, price, or status.

**Performance Monitoring**: Integrating with tools like Lighthouse or Web Vitals to track real-world performance metrics.

**Error Boundaries**: Adding error boundaries to gracefully handle runtime errors without crashing the entire app.

**Loading States**: Simulating async data loading to demonstrate proper loading UI and skeleton screens.

---

This implementation prioritizes code quality, performance, and maintainability while keeping the complexity appropriate for a technical assessment. The architecture supports easy extension and modification as requirements evolve.
