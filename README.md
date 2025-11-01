# Smart Contract Transaction Builder

A React application for building and encoding transaction data for Ethereum smart contracts.

## Features

- Interactive contract and function selection
- Dynamic form generation for function parameters
- Support for complex data types (arrays, tuples, nested structures)
- Real-time transaction data encoding
- JSON representation of transaction parameters
- Test contract for array operations

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling
- **Viem** - Ethereum library for encoding

## Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Select a Contract**: Choose from available contracts in the dropdown
2. **Pick a Function**: Select the function you want to call
3. **Fill Parameters**: Enter values for all function parameters
4. **Get Encoded Data**: Copy the encoded transaction data for use in your transactions

The application automatically validates inputs and generates both human-readable JSON and encoded transaction data.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── TransactionBuilder.jsx  # Core transaction builder logic
├── inputs/                 # Input components for various data types
│   ├── InputRouter.jsx     # Routes inputs to appropriate components
│   ├── AddressInput.jsx    # Ethereum address validation
│   ├── ArrayInput.jsx      # Dynamic array handling
│   └── ...                 # Other specialized inputs
└── testContract.js         # Test contract for development
```

## License

MIT
