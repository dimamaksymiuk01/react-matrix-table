# react-matrix-table

A dynamic interactive matrix table built with React and TypeScript that allows users to generate, manipulate, and visualize matrix data with advanced features like virtualization, nearest cell highlighting, and percentage heatmaps.

### 📋 Features
### Core Functionality
- Dynamic Matrix Generation: Create matrices of size M×N (0-100 rows/columns)
- Interactive Cells: Click any cell to increment its value by 1
- Row Management: Add new rows or remove existing ones
- Automatic Calculations: Real-time sum calculations and 60th percentile values
  
### Advanced Features
- Nearest Cell Highlighting: Hover over any cell to highlight X nearest cells by value
- Percentage View & Heatmap: Hover over row sum to see percentages and color-coded heatmap
- Virtual Scrolling: Efficient rendering for large matrices using custom virtualization
- Responsive Design: Clean, modern UI that works across different screen sizes

### Technical Highlights
- Custom Virtualization: Optimized rendering for matrices up to 100×100 (10,000 cells)
- Min-Heap Algorithm: Efficient nearest neighbor search using custom heap implementation
- TypeScript: Full type safety throughout the application
- SCSS Modules: Scoped styling with CSS modules

### 🛠️ Tech Stack
- React 19
- TypeScript for type safety
- SCSS with CSS modules for styling
- Vite for fast development and building
- Custom algorithms for virtualization and nearest neighbor search

  ## 🏗️ Project Structure
```bash
  src/
├── assets/                 # Static assets
├── common/
│   ├── components/         
│   │   ├── InputForm/      # Matrix configuration form
│   │   └── MatrixTable/    # Main table component
│   ├── hooks/              # Custom hooks
│   │   ├── useMatrix.tsx   # Matrix state management
│   │   └── useVirtualization.tsx # Virtual scrolling logic
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions (MinHeap, helpers)
├── modules/
│   └── Matrix/             # Main matrix module
└── styles/                 # Global styles
```

## 💡 Usage

### Basic Usage

Configure Matrix: Set the number of rows (M), columns (N), and nearest cells to highlight (X)
Interact with Cells: Click any cell to increment its value
Explore Features:

- Hover over cells to see nearest neighbors highlighted
- Hover over row sums to view percentages and heatmap
- Use row controls to add/remove rows


## Key Components
### Matrix Configuration

- M (Rows): 0-100, defines matrix height
- N (Columns): 0-100, defines matrix width
- X (Nearest Cells): 0 to (M×N-1), number of nearest cells to highlight

### Interactive Features

- Cell Click: Increments cell value and recalculates totals
- Cell Hover: Highlights X nearest cells by value using efficient heap-based search
- Sum Hover: Shows percentage view with color-coded heatmap based on row maximum
- Row Management: Add/remove rows with automatic recalculation

### 🔧 Technical Implementation
- Custom Virtualization
- The application implements custom virtualization to handle large matrices efficiently:

- Only renders visible rows and columns
- Configurable overscan for smooth scrolling
- Dynamic padding for proper scroll behavior
- Supports both vertical and horizontal virtualization

### Efficient Algorithms

- MinHeap: Custom implementation for O(log n) nearest neighbor search
- Percentile Calculation: Accurate 60th percentile computation
- Real-time Updates: Optimized state management for instant feedback

- Performance Optimizations

- Memoized calculations with useMemo
- Callback optimization with useCallback
- Ref-based DOM manipulation for highlighting
- Virtual scrolling for large datasets

### 🧪 Development Tools
The project includes comprehensive development tooling:

- ESLint: Code linting with strict rules
- Prettier: Code formatting
- Husky: Pre-commit hooks for code quality
- GitHub Actions: Automated testing, linting, and deployment

## Virtualization Strategy
- Custom virtual scrolling implementation:

- Calculates visible viewport based on scroll position
- Renders only necessary DOM elements
- Maintains smooth scrolling with padding elements
- Handles both row and column virtualization
