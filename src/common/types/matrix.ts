import { RefObject } from 'react';

export type CellId = number;
export type CellValue = number;

export type Cell = {
  id: CellId;
  amount: CellValue;
};
export type CellWithDistance = Cell & {
  distance: number;
};

export type MatrixData = {
  matrix: Cell[][];
  rowSums: number[];
  columnPercentiles: number[];
};

export type MatrixTableProps = {
  matrixData: MatrixData;
  m: number;
  n: number;
  x: number;
  nearestCellIds: number[];
  hoveredSumRowIndex: number | null;
  tableCellsRef: RefObject<Map<number, HTMLTableCellElement>> | null;
  onCellClick: (cellId: number) => void;
  onCellHover: (cell: Cell) => void;
  onCellLeave: () => void;
  onSumCellHover: (rowIndex: number) => void;
  onSumCellLeave: () => void;
  onRowRemove?: (rowIndex: number) => void;
  onRowAdd?: () => void;
};
