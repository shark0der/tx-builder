# ETH Wallet Dashboard

A simple React application built with wagmi.sh that connects to Ethereum wallets and displays ETH balances.

## Features

- Connect to Ethereum wallets (MetaMask, WalletConnect, etc.)
- Display ETH balance in both formatted and raw (wei) formats
- Responsive design with clean UI
- Built with React, Vite, and wagmi

## Setup

1. Install dependencies:
```bash
npm install
```

2. **Configure WalletConnect (optional):**
   - Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Update the project ID in `src/wagmi.js`:
   ```javascript
   walletConnect({ projectId: 'your-walletconnect-project-id' })
   ```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **wagmi** - React hooks for Ethereum
- **viem** - Ethereum library
- **@wagmi/connectors** - Wallet connectors

## Supported Wallets

- MetaMask
- WalletConnect
- Any injected wallet (Browser extension wallets)

## Network

Currently configured for Ethereum Mainnet. To add other networks, modify the chains in `src/wagmi.js`.
