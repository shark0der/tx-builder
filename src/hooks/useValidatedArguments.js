import { useCallback, useMemo, useState } from "react";

import {
  createArgsArray,
  createArgsObject,
  hasValidArgs,
  validateAllArgs,
  validateAllInputs,
} from "../utils/argumentsValidation";
import { encodeTransactionData } from "../utils/encoding";

/**
 * Hook to manage function arguments and their validation state
 * Returns computed JSON and encoded transaction data
 */
export function useValidatedArguments(selectedFunctionAbi, contractAbi) {
  const [functionArgs, setFunctionArgs] = useState({});
  const [argValidation, setArgValidation] = useState({});

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

  const resetArguments = useCallback(() => {
    setFunctionArgs({});
    setArgValidation({});
  }, []);

  // JSON representation of transaction data
  const jsonTxData = useMemo(() => {
    if (!selectedFunctionAbi) return "";

    try {
      const allInputsValidated = validateAllInputs(selectedFunctionAbi.inputs, argValidation);

      if (!allInputsValidated) return "";

      const allArgsValid = validateAllArgs(selectedFunctionAbi.inputs, argValidation);

      if (!allArgsValid) return "";

      const argsObject = createArgsObject(selectedFunctionAbi.inputs, functionArgs);

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
      const allInputsValidated = validateAllInputs(selectedFunctionAbi.inputs, argValidation);

      if (!allInputsValidated) return "";

      const allArgsValid = validateAllArgs(selectedFunctionAbi.inputs, argValidation);

      if (!allArgsValid) return "";

      const args = createArgsArray(selectedFunctionAbi.inputs, functionArgs);

      if (!hasValidArgs(args, selectedFunctionAbi.inputs)) return "";

      return encodeTransactionData({
        abi: contractAbi,
        functionName: selectedFunctionAbi.name,
        args,
      });
    } catch (error) {
      console.error("Error encoding transaction data:", error);
      return `Error: ${error.message}`;
    }
  }, [argValidation, contractAbi, functionArgs, selectedFunctionAbi]);

  return {
    functionArgs,
    argValidation,
    handleArgChange,
    handleArgValidation,
    resetArguments,
    jsonTxData,
    encodedTxData,
  };
}
