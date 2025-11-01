// import { ConnectButton } from "@rainbow-me/rainbowkit";
import turtleLogo from "./assets/turtle.svg";

function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-gray-900 font-semibold"
        >
          <img src={turtleLogo} alt="Turtle logo" className="w-6 h-6" />
          <span>Transaction builder</span>
        </a>
        {/* <ConnectButton /> */}
      </div>
    </nav>
  );
}

export default Navbar;
