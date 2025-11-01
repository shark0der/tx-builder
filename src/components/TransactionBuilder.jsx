import { abis, addresses } from "@nexusmutual/deployments";
import { useMemo, useState } from "react";

import { useValidatedArguments } from "../hooks/useValidatedArguments";
import { TEST_CONTRACT_ABI, TEST_CONTRACT_ADDRESS } from "../testContract";
import FunctionArguments from "./FunctionArguments";
import SearchableDropdown from "./inputs/SearchableDropdown";
import TransactionPreview from "./TransactionPreview";

function TransactionBuilder() {
  const [selectedContract, setSelectedContract] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");

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
  const functions = useMemo(() => {
    if (!selectedContract) return [];

    // Check if it's the test contract
    const abi =
      selectedContract === "🧪 ArrayTestContract" ? TEST_CONTRACT_ABI : abis[selectedContract];

    if (!abi) return [];

    // Filter for write functions (not view or pure)
    return abi.filter((item) => item.type === "function");
  }, [selectedContract]);

  // Format functions for dropdown
  const functionOptions = useMemo(() => {
    return functions.map((fn) => {
      const signature = getFunctionSignature(fn);
      return {
        value: signature,
        label: signature,
      };
    });
  }, [functions]);

  // Get selected function details
  const selectedFunctionAbi = useMemo(() => {
    if (!selectedFunction) return null;
    return functions.find((fn) => {
      const signature = getFunctionSignature(fn);
      return signature === selectedFunction;
    });
  }, [selectedFunction, functions]);

  // Get the contract ABI for encoding
  const contractAbi = useMemo(() => {
    if (!selectedContract) return null;
    return selectedContract === "🧪 ArrayTestContract" ? TEST_CONTRACT_ABI : abis[selectedContract];
  }, [selectedContract]);

  // Use validation hook for arguments management
  const {
    functionArgs,
    handleArgChange,
    handleArgValidation,
    resetArguments,
    jsonTxData,
    encodedTxData,
  } = useValidatedArguments(selectedFunctionAbi, contractAbi);

  const handleContractChange = (value) => {
    if (value !== selectedContract) {
      setSelectedContract(value);
      setSelectedFunction("");
      resetArguments();
    }
  };

  const handleFunctionChange = (value) => {
    setSelectedFunction(value);
    resetArguments();
  };

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
      {selectedContract && functions.length > 0 && (
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
      <FunctionArguments
        selectedFunctionAbi={selectedFunctionAbi}
        functionArgs={functionArgs}
        handleArgChange={handleArgChange}
        handleArgValidation={handleArgValidation}
        selectedContract={selectedContract}
        selectedFunction={selectedFunction}
      />

      {/* Transaction Preview */}
      {selectedFunctionAbi && (
        <TransactionPreview jsonData={jsonTxData} encodedData={encodedTxData} />
      )}

      {selectedContract && functions.length === 0 && (
        <p className="text-center text-gray-600 text-sm">
          No write functions available for this contract
        </p>
      )}
    </div>
  );
}

export default TransactionBuilder;
