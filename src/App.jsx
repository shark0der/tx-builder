import Navbar from "./Navbar.jsx";
import BalanceDisplay from "./BalanceDisplay.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-5">
        <header className="text-center mb-10">
          <h1 className="text-gray-800 text-4xl mb-2.5 font-bold leading-tight">
            ETH Wallet Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Connect your wallet and view your ETH balance
          </p>
        </header>

        <main>
          <BalanceDisplay />
        </main>

        <footer className="text-center mt-10 pt-5 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Built with React, Vite, and wagmi
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
