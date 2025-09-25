export type CellId = number;
export type CellValue = number;

export type Cell = {
  id: CellId;
  amount: CellValue;
};

export type MatrixRow = Cell[];
export type Matrix = MatrixRow[];

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
  hoveredCellId: number | null;
  nearestCellIds: number[];
  hoveredSumRowIndex: number | null;
  onCellClick: (cellId: number) => void;
  onCellHover: (cellId: number) => void;
  onCellLeave: () => void;
  onSumCellHover: (rowIndex: number) => void;
  onSumCellLeave: () => void;
  onRowRemove?: (rowIndex: number) => void;
};
