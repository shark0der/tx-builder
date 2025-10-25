import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-gray-900 font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06l-.97-.97V20.5a2.25 2.25 0 0 1-2.25 2.25H6.06A2.25 2.25 0 0 1 3.81 20.5v-7.88l-.97.97a.75.75 0 1 1-1.06-1.06l8.69-8.69ZM5.31 11.31v9.19c0 .414.336.75.75.75h10.88a.75.75 0 0 0 .75-.75v-9.19L12 6.12l-6.69 5.19Z" />
          </svg>
          <span>ETH Wallet</span>
        </a>
        <ConnectButton />
      </div>
    </nav>
  );
}

export default Navbar;
