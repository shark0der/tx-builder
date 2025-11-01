# Smart Contract Transaction Builder

A React application for encoding transaction data for Ethereum smart contracts.

## Usage

1. **Select a Contract**: Choose from available Nexus Mutual contracts or the test contract
2. **Pick a Function**: Select a write function from the contract
3. **Fill Parameters**: Enter values for all function parameters using the dynamically generated forms
4. **Get Encoded Data**: Copy the encoded transaction data from the preview section

The application automatically validates inputs and generates both human-readable JSON and encoded transaction data ready for use in transactions.

## Features

- **Validated input forms**: Dynamic form generation for function parameters with validation
- **Complex data type support**: Arrays, tuples, nested structures, addresses, integers, bytes, strings
- **Real-time, client-side encoding**: Automatic transaction data encoding using Viem
- **Transaction preview**: View both human-readable JSON and encoded calldata

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS 4** - Styling
- **Wagmi** - Ethereum React hooks
- **Viem** - Ethereum library for encoding and utilities

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

## License

MIT
