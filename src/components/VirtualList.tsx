import { useRef } from "react";
import { useVirtualList } from "../hooks/useVirtualList";

export interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderListItem: (item: T, index: number) => React.ReactNode;
  moreScan?: number;
  className?: string;
}
function VirtualList<T>({
  height,
  itemHeight,
  items,
  renderListItem,
  moreScan,
  className = "",
}: VirtualListProps<T>) {
  const containrRef = useRef<HTMLDivElement>(null);

  const { handleScroll, listRange, totalHeight } = useVirtualList({
    itemCount: items.length,
    containerHeight: height,
    itemHeight,
    moreScan,
  });

  const visibleItemsList = items.slice(
    listRange.startIndex,
    listRange.endIndex + 1
  );

  return (
    <div
      className={className}
      ref={containrRef}
      onScroll={handleScroll}
      style={{
        height: `${height}px`,
        overflow: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          height: `${totalHeight}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${listRange.offsetY}px)`,
          }}
        >
          {visibleItemsList.map((item, idx) => (
            <div
              key={listRange.startIndex + idx}
              style={{
                height: `${itemHeight}px`,
                overflow: "hidden",
              }}
            >
              {renderListItem(item, listRange.startIndex + idx)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;
