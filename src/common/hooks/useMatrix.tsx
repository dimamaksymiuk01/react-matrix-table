import { useState, useEffect, useMemo } from 'react';

import { Cell, CellValue, MatrixData } from '@/common/types';

export const useMatrix = (m: number, n: number) => {
  const [matrixData, setMatrixData] = useState<MatrixData>({
    matrix: [],
    rowSums: [],
    columnPercentiles: [],
  });

  const generateRandomAmount = (): CellValue => {
    return Math.floor(Math.random() * 900) + 100;
  };

  const calculatePercentile = (values: number[], percentile: number): number => {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);

    if (Number.isInteger(index)) {
      return sorted[index];
    }

    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  const generateMatrix = useMemo(() => {
    if (m === 0 || n === 0) {
      return {
        matrix: [],
        rowSums: [],
        columnPercentiles: [],
      };
    }

    let idCounter = 1;

    const newMatrix: Cell[][] = Array.from({ length: m }, () =>
      Array.from({ length: n }, () => ({
        id: idCounter++,
        amount: generateRandomAmount(),
      })),
    );

    const rowSums = newMatrix.map((row) =>
      row.reduce((sum, cell) => sum + cell.amount, 0),
    );

    const columnPercentiles = Array.from({ length: n }, (_, col) =>
      calculatePercentile(
        newMatrix.map((row) => row[col].amount),
        60,
      ),
    );

    return {
      matrix: newMatrix,
      rowSums,
      columnPercentiles,
    };
  }, [m, n]);

  useEffect(() => {
    setMatrixData(generateMatrix);
  }, [generateMatrix]);

  return {
    matrixData,
    hasData: m > 0 && n > 0,
  };
};
