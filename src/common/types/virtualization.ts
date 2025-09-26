export interface VirtualizationConfig {
  totalRows: number;
  totalCols: number;
  containerHeight?: number;
  rowHeight?: number;
  columnWidth?: number;
  overscan?: number;
  overscanCols?: number;
}

export interface VirtualizationResult {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  scrollTop: number;
  scrollLeft: number;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  startIndex: number;
  endIndex: number;
  visibleRowCount: number;
  topPaddingHeight: number;
  bottomPaddingHeight: number;
  colStart: number;
  colEnd: number;
  visibleColCount: number;
  leftPaddingWidth: number;
  rightPaddingWidth: number;
  rowHeight: number;
  columnWidth: number;
  containerHeight: number;
  totalHeight: number;
  totalWidth: number;
}
