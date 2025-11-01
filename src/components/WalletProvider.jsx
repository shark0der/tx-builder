import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected /* walletConnect */ } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    // /* walletConnect */({
    //   projectId:
    //     import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo-project-id",
    // }),
  ],
  transports: {
    [mainnet.id]: http("https://eth.llamarpc.com"),
  },
});

const queryClient = new QueryClient();

export function WalletProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" initialChain={mainnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
