type CompareFn<T> = (a: T, b: T) => number;

export class MinHeap<T> {
  private heap: T[] = [];
  private compare: CompareFn<T>;

  constructor(compareFn: CompareFn<T>) {
    this.compare = compareFn;
  }

  push(item: T): void {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  pop(): T | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const result = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return result;
  }

  peek(): T | null {
    return this.heap[0] || null;
  }

  size(): number {
    return this.heap.length;
  }

  private heapifyUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;

      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      index = parentIndex;
    }
  }

  private heapifyDown(index: number): void {
    while (true) {
      let minIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < this.heap.length &&
        this.compare(this.heap[leftChild], this.heap[minIndex]) < 0
      ) {
        minIndex = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        this.compare(this.heap[rightChild], this.heap[minIndex]) < 0
      ) {
        minIndex = rightChild;
      }

      if (minIndex === index) break;

      [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
      index = minIndex;
    }
  }
}
