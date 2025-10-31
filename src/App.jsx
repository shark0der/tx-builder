import Navbar from "./Navbar.jsx";
import BalanceDisplay from "./BalanceDisplay.jsx";
import TransactionBuilder from "./TransactionBuilder.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-5">
        <main>
          <TransactionBuilder />
        </main>

        <footer className="text-center mt-10 pt-5 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            {"Built with positive vibes only ♡"}
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
