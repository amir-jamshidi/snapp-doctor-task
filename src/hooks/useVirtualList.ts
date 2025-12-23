import { useCallback, useState } from "react";

interface IUseVirtualListProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  moreScan?: number;
}

interface VirtualListRange {
  startIndex: number;
  endIndex: number;
  offsetY: number;
}

export const useVirtualList = ({
  containerHeight,
  itemCount,
  itemHeight,
  moreScan = 5,
}: IUseVirtualListProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;

  const getVisibleItemsIndex = useCallback((): VirtualListRange => {
    const itemVisibleCount = Math.ceil(containerHeight / itemHeight);

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - moreScan
    );
    const endIndex = Math.min(
      itemCount - 1,
      startIndex + itemVisibleCount + moreScan * 2
    );

    const offsetY = startIndex * itemHeight;
    return { startIndex, endIndex, offsetY };
  }, [scrollTop, itemHeight, itemCount, containerHeight, moreScan]);

  const listRange = getVisibleItemsIndex();

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    totalHeight,
    listRange,
    handleScroll,
  };
};
