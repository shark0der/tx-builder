import { useState, useMemo } from "react";
import { encodeFunctionData } from "viem";
import { addresses, abis } from "@nexusmutual/deployments";
import InputRouter from "./inputs/InputRouter";
import SearchableDropdown from "./inputs/SearchableDropdown";

function TransactionBuilder() {
  const [selectedContract, setSelectedContract] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [functionArgs, setFunctionArgs] = useState({});
  const [ethValue, setEthValue] = useState("");

  // Get list of contracts that have ABIs
  const availableContracts = useMemo(() => {
    const contractsWithAbis = [];
    for (const [name, address] of Object.entries(addresses)) {
      // Check if this contract has an ABI in the abis object
      if (abis[name]) {
        contractsWithAbis.push({ name, address });
      }
    }
    console.log("Available contracts:", contractsWithAbis.length);
    return contractsWithAbis.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Format contracts for dropdown
  const contractOptions = useMemo(() => {
    return availableContracts.map((contract) => ({
      value: contract.name,
      label: `${contract.name} - ${contract.address}`,
    }));
  }, [availableContracts]);

  // Generate function signature
  const getFunctionSignature = (fn) => {
    return `${fn.name}(${fn.inputs.map((i) => i.type).join(",")})`;
  };

  // Get write functions for selected contract
  const writeFunctions = useMemo(() => {
    if (!selectedContract) return [];

    const abi = abis[selectedContract];
    if (!abi) return [];

    // Filter for write functions (not view or pure)
    return abi.filter(
      (item) =>
        item.type === "function" &&
        item.stateMutability !== "view" &&
        item.stateMutability !== "pure"
    );
  }, [selectedContract]);

  // Format functions for dropdown
  const functionOptions = useMemo(() => {
    return writeFunctions.map((fn) => {
      const signature = getFunctionSignature(fn);
      return {
        value: signature,
        label: signature,
      };
    });
  }, [writeFunctions]);

  // Get selected function details
  const selectedFunctionAbi = useMemo(() => {
    if (!selectedFunction) return null;
    return writeFunctions.find((fn) => {
      const signature = `${fn.name}(${fn.inputs.map((i) => i.type).join(",")})`;
      return signature === selectedFunction;
    });
  }, [selectedFunction, writeFunctions]);

  const handleContractChange = (value) => {
    if (value !== selectedContract) {
      setSelectedContract(value);
      setSelectedFunction("");
      setFunctionArgs({});
      setEthValue("");
    }
  };

  const handleFunctionChange = (value) => {
    setSelectedFunction(value);
    setFunctionArgs({});
    setEthValue("");
  };

  const handleArgChange = (paramName, value) => {
    setFunctionArgs((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  // Encode transaction data using viem
  const encodedTxData = useMemo(() => {
    if (!selectedFunctionAbi) return "";

    try {
      // Prepare args array in the correct order
      const args = selectedFunctionAbi.inputs.map((input, index) => {
        const paramName = input.name || `arg${index}`;
        return functionArgs[paramName];
      });

      // Check if all required args are provided
      const hasAllArgs = selectedFunctionAbi.inputs.every((input, index) => {
        const paramName = input.name || `arg${index}`;
        return (
          functionArgs[paramName] !== undefined &&
          functionArgs[paramName] !== ""
        );
      });

      if (!hasAllArgs) return "";

      const data = encodeFunctionData({
        abi: abis[selectedContract],
        functionName: selectedFunctionAbi.name,
        args: args,
      });

      return data;
    } catch (error) {
      console.error("Error encoding transaction data:", error);
      return `Error: ${error.message}`;
    }
  }, [selectedContract, selectedFunctionAbi, functionArgs]);

  return (
    <div className="p-5 border border-blue-500 rounded-lg m-5 bg-blue-50">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">
        Transaction Builder
      </h3>

      {/* Contract Selector */}
      <div className="mb-4">
        <label
          htmlFor="contract-selector"
          className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
        >
          Select Contract
        </label>
        <SearchableDropdown
          id="contract-selector"
          options={contractOptions}
          value={selectedContract}
          onChange={handleContractChange}
          placeholder="Choose a contract..."
        />
      </div>

      {/* Function Selector */}
      {selectedContract && writeFunctions.length > 0 && (
        <div className="mb-4">
          <label
            htmlFor="function-selector"
            className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
          >
            Select Function
          </label>
          <SearchableDropdown
            id="function-selector"
            options={functionOptions}
            value={selectedFunction}
            onChange={handleFunctionChange}
            placeholder="Choose a function..."
          />
        </div>
      )}

      {/* Function Arguments */}
      {selectedFunctionAbi && selectedFunctionAbi.inputs.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Function Arguments
          </label>
          <div className="space-y-3">
            {selectedFunctionAbi.inputs.map((input, index) => {
              const paramName = input.name || `arg${index}`;
              const inputId = `${selectedContract}-${selectedFunction}-${paramName}`;
              return (
                <div key={index}>
                  <label
                    htmlFor={inputId}
                    className="block text-xs text-gray-600 mb-1 cursor-pointer"
                  >
                    {paramName} ({input.type})
                  </label>
                  <InputRouter
                    type={input.type}
                    value={functionArgs[paramName] || ""}
                    onChange={(value) => handleArgChange(paramName, value)}
                    name={inputId}
                    id={inputId}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ETH Value for Payable Functions */}
      {selectedFunctionAbi &&
        selectedFunctionAbi.stateMutability === "payable" && (
          <div className="mb-4">
            <label
              htmlFor="eth-value-input"
              className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
            >
              ETH Value (optional)
            </label>
            <input
              type="text"
              id="eth-value-input"
              value={ethValue}
              onChange={(e) => setEthValue(e.target.value)}
              placeholder="0.0"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              Amount of ETH to send with transaction
            </p>
          </div>
        )}

      {/* Encoded Transaction Data */}
      {selectedFunctionAbi && (
        <div className="mb-4">
          <label
            htmlFor="encoded-tx-data"
            className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
          >
            Encoded Transaction Data
          </label>
          <textarea
            id="encoded-tx-data"
            value={encodedTxData}
            readOnly
            rows={6}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-sm"
            placeholder="Fill in all arguments to see encoded data..."
          />
          {encodedTxData && !encodedTxData.startsWith("Error") && (
            <p className="text-xs text-gray-500 mt-1">
              Copy this data to execute the transaction
            </p>
          )}
        </div>
      )}

      {selectedContract && writeFunctions.length === 0 && (
        <p className="text-center text-gray-600 text-sm">
          No write functions available for this contract
        </p>
      )}
    </div>
  );
}

export default TransactionBuilder;
