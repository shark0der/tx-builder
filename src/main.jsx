import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./components/App.jsx";
// import { WalletProvider } from "./components/WalletProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <WalletProvider> */}
    <App />
    {/* </WalletProvider> */}
  </StrictMode>
);
