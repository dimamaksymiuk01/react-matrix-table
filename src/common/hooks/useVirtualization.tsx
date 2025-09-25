import { useRef, useState, useMemo } from 'react';

export interface VirtualizationConfig {
  totalRows: number;
  totalCols: number;
  containerHeight?: number;
  rowHeight?: number;
  columnWidth?: number;
  overscan?: number;
  overscanCols?: number;
}

export const useVirtualization = ({
  totalRows,
  totalCols,
  containerHeight = 800,
  rowHeight = 40,
  columnWidth = 100,
  overscan = 5,
  overscanCols = 4,
}: VirtualizationConfig) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
    setScrollLeft(target.scrollLeft);
  };

  const visibleRowCount = useMemo(() => {
    if (rowHeight <= 0) return totalRows;
    return Math.min(totalRows, Math.ceil(containerHeight / rowHeight) + overscan);
  }, [containerHeight, overscan, rowHeight, totalRows]);

  const startIndex = useMemo(() => {
    if (rowHeight <= 0) return 0;
    const idx = Math.floor(scrollTop / rowHeight) - Math.floor(overscan / 2);
    return Math.max(0, idx);
  }, [rowHeight, overscan, scrollTop]);

  const endIndex = useMemo(() => {
    return Math.min(totalRows, startIndex + visibleRowCount);
  }, [startIndex, totalRows, visibleRowCount]);

  const topPaddingHeight = useMemo(() => startIndex * rowHeight, [rowHeight, startIndex]);

  const bottomPaddingHeight = useMemo(
    () => Math.max(0, (totalRows - endIndex) * rowHeight),
    [endIndex, rowHeight, totalRows],
  );

  const visibleColCount = useMemo(() => {
    if (columnWidth <= 0) return totalCols;
    const containerWidth = scrollContainerRef.current?.clientWidth ?? 0;
    return Math.min(totalCols, Math.ceil(containerWidth / columnWidth) + overscanCols);
  }, [columnWidth, overscanCols, totalCols]);

  const colStart = useMemo(() => {
    if (columnWidth <= 0) return 0;
    const idx = Math.floor(scrollLeft / columnWidth) - Math.floor(overscanCols / 2);
    return Math.max(0, idx);
  }, [columnWidth, overscanCols, scrollLeft]);

  const colEnd = useMemo(() => {
    return Math.min(totalCols, colStart + visibleColCount);
  }, [colStart, totalCols, visibleColCount]);

  const leftPaddingWidth = useMemo(() => colStart * columnWidth, [colStart, columnWidth]);

  const rightPaddingWidth = useMemo(
    () => Math.max(0, (totalCols - colEnd) * columnWidth),
    [colEnd, columnWidth, totalCols],
  );

  return {
    scrollContainerRef,
    scrollTop,
    scrollLeft,
    handleScroll,
    startIndex,
    endIndex,
    visibleRowCount,
    topPaddingHeight,
    bottomPaddingHeight,
    colStart,
    colEnd,
    visibleColCount,
    leftPaddingWidth,
    rightPaddingWidth,
    rowHeight,
    columnWidth,
    containerHeight,
  };
};
