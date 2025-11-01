import { useState, useMemo, useCallback, memo } from "react";
import { encodeFunctionData } from "viem";
import { addresses, abis } from "@nexusmutual/deployments";
import InputRouter from "./inputs/InputRouter";
import SearchableDropdown from "./inputs/SearchableDropdown";
import { TEST_CONTRACT_ADDRESS, TEST_CONTRACT_ABI } from "./testContract";

// Memoized input wrapper to prevent unnecessary re-renders
const MemoizedInput = memo(function MemoizedInput({
  type,
  components,
  value,
  paramName,
  inputId,
  onArgChange,
  onArgValidation,
}) {
  const handleChange = useCallback(
    (value) => onArgChange(paramName, value),
    [onArgChange, paramName]
  );

  const handleValidation = useCallback(
    (isValid) => onArgValidation(paramName, isValid),
    [onArgValidation, paramName]
  );

  return (
    <InputRouter
      type={type}
      components={components}
      value={value}
      onChange={handleChange}
      onValidationChange={handleValidation}
      name={inputId}
      id={inputId}
    />
  );
});

function TransactionBuilder() {
  const [selectedContract, setSelectedContract] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [functionArgs, setFunctionArgs] = useState({});
  const [argValidation, setArgValidation] = useState({});
  const [ethValue, setEthValue] = useState("");

  // Get list of contracts that have ABIs
  const availableContracts = useMemo(() => {
    const contractsWithAbis = [];

    // Add test contract first
    contractsWithAbis.push({
      name: "🧪 ArrayTestContract",
      address: TEST_CONTRACT_ADDRESS,
    });

    for (const [name, address] of Object.entries(addresses)) {
      // Check if this contract has an ABI in the abis object
      if (abis[name]) {
        contractsWithAbis.push({ name, address });
      }
    }

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
    const params = fn.inputs
      .map((i, idx) => {
        const name = i.name || `arg${idx}`;
        return `${i.type} ${name}`;
      })
      .join(", ");
    return `${fn.name}(${params})`;
  };

  // Get write functions for selected contract
  const writeFunctions = useMemo(() => {
    if (!selectedContract) return [];

    // Check if it's the test contract
    const abi =
      selectedContract === "🧪 ArrayTestContract"
        ? TEST_CONTRACT_ABI
        : abis[selectedContract];

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
      const signature = getFunctionSignature(fn);
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
    setArgValidation({});
    setEthValue("");
  };

  const handleArgChange = useCallback((paramName, value) => {
    setFunctionArgs((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  }, []);

  const handleArgValidation = useCallback((paramName, isValid) => {
    setArgValidation((prev) => ({
      ...prev,
      [paramName]: isValid,
    }));
  }, []);

  // JSON representation of transaction data
  const jsonTxData = useMemo(() => {
    if (!selectedFunctionAbi) return "";

    try {
      // First ensure all inputs have been validated
      const allInputsValidated = selectedFunctionAbi.inputs.every(
        (input, index) => {
          const paramName = input.name || `arg${index}`;
          return paramName in argValidation;
        }
      );

      if (!allInputsValidated) return "";

      // Check if all args are valid
      const allArgsValid = selectedFunctionAbi.inputs.every((input, index) => {
        const paramName = input.name || `arg${index}`;
        const validation = argValidation[paramName];
        return validation === true;
      });

      if (!allArgsValid) return "";

      // Create object with parameter names as keys
      const argsObject = {};
      selectedFunctionAbi.inputs.forEach((input, index) => {
        const paramName = input.name || `arg${index}`;
        argsObject[paramName] = functionArgs[paramName];
      });

      // Return args as object for better readability
      return JSON.stringify(argsObject, null, 2);
    } catch (error) {
      console.error("Error creating JSON representation:", error);
      return `Error: ${error.message}`;
    }
  }, [selectedFunctionAbi, functionArgs, argValidation]);

  // Encode transaction data using viem
  const encodedTxData = useMemo(() => {
    if (!selectedFunctionAbi) return "";

    try {
      // First ensure all inputs have been validated
      const allInputsValidated = selectedFunctionAbi.inputs.every(
        (input, index) => {
          const paramName = input.name || `arg${index}`;
          return paramName in argValidation;
        }
      );

      if (!allInputsValidated) return "";

      // Check if all args are valid
      const allArgsValid = selectedFunctionAbi.inputs.every((input, index) => {
        const paramName = input.name || `arg${index}`;
        const validation = argValidation[paramName];
        return validation === true;
      });

      if (!allArgsValid) return "";

      // Prepare args array in the correct order
      const args = selectedFunctionAbi.inputs.map((input, index) => {
        const paramName = input.name || `arg${index}`;
        const value = functionArgs[paramName];

        // Return the value as-is, the validation should ensure it's valid
        return value;
      });

      // Double-check that no args are undefined or invalid
      const hasValidArgs = args.every((arg, index) => {
        const input = selectedFunctionAbi.inputs[index];
        const type = input.type.toLowerCase();

        // For arrays, empty is valid
        if (Array.isArray(arg)) {
          return true;
        }

        // For tuples/objects, check if it's an object
        if (type === "tuple" || type.includes("tuple")) {
          return arg !== null && typeof arg === "object";
        }

        // For other types, check if defined and not empty string
        return arg !== undefined && arg !== "";
      });

      if (!hasValidArgs) return "";

      // Get the correct ABI
      const contractAbi =
        selectedContract === "🧪 ArrayTestContract"
          ? TEST_CONTRACT_ABI
          : abis[selectedContract];

      const data = encodeFunctionData({
        abi: contractAbi,
        functionName: selectedFunctionAbi.name,
        args: args,
      });

      return data;
    } catch (error) {
      console.error("Error encoding transaction data:", error);
      return `Error: ${error.message}`;
    }
  }, [selectedContract, selectedFunctionAbi, functionArgs, argValidation]);

  return (
    <div className="p-5 border border-blue-500 rounded-lg m-5 bg-blue-50">
      {/* Contract Selector */}
      <div className="mb-4">
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
          <div className="space-y-4">
            {selectedFunctionAbi.inputs.map((input, index) => {
              const paramName = input.name || `arg${index}`;
              const inputId = `${selectedContract}-${selectedFunction}-${paramName}`;
              // Default value should be [] for arrays, {} for tuples, "" for other types
              const isArrayType =
                input.type.includes("[]") || /\[\d+\]/.test(input.type);
              const isTupleType = input.type === "tuple";
              const defaultValue = isArrayType ? [] : isTupleType ? {} : "";
              return (
                <div key={inputId} className="mt-4">
                  <label
                    htmlFor={inputId}
                    className="block text-xs text-gray-600 mb-1 cursor-pointer"
                  >
                    {paramName}: {input.type}
                  </label>
                  <MemoizedInput
                    type={input.type}
                    components={input.components}
                    value={functionArgs[paramName] ?? defaultValue}
                    paramName={paramName}
                    inputId={inputId}
                    onArgChange={handleArgChange}
                    onArgValidation={handleArgValidation}
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

      {/* JSON Representation */}
      {selectedFunctionAbi && (
        <div className="mb-4">
          <label
            htmlFor="json-tx-data"
            className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
          >
            JSON Representation
          </label>
          <textarea
            id="json-tx-data"
            value={jsonTxData}
            readOnly
            rows={8}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-sm"
            placeholder="Fill in all arguments to see JSON data..."
          />
          {jsonTxData && !jsonTxData.startsWith("Error") && (
            <p className="text-xs text-gray-500 mt-1">
              Human-readable representation of the transaction
            </p>
          )}
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
