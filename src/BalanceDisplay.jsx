import { useAccount, useBalance } from "wagmi";

function BalanceDisplay() {
  const { address, isConnected } = useAccount();
  const {
    data: balance,
    isLoading,
    error,
  } = useBalance({
    address,
    enabled: Boolean(isConnected && address),
    refetchOnWindowFocus: false,
  });

  if (!isConnected) {
    return (
      <div className="p-5 border border-gray-300 rounded-lg m-5 bg-gray-50">
        <p className="text-center text-gray-600">
          Please connect your wallet to view balance
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-5 border border-gray-300 rounded-lg m-5 bg-gray-50">
        <p className="text-center text-gray-600">Loading balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-red-500 rounded-lg m-5 bg-red-50">
        <p className="text-center text-red-700">
          Error loading balance: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 border border-green-500 rounded-lg m-5 bg-green-50">
      <h3 className="text-lg font-semibold text-center mb-3 text-green-800">
        ETH Balance
      </h3>
      <p className="text-2xl font-bold my-2.5 text-center text-green-900">
        {balance?.formatted} {balance?.symbol}
      </p>
      {balance?.value !== undefined && (
        <p className="text-gray-600 text-sm text-center">
          Raw: {balance.value.toString()} wei
        </p>
      )}
    </div>
  );
}

export default BalanceDisplay;
