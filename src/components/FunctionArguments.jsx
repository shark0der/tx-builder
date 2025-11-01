import { memo, useCallback } from "react";

import InputRouter from "./inputs/InputRouter";

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

function FunctionArguments({
  selectedFunctionAbi,
  functionArgs,
  handleArgChange,
  handleArgValidation,
  selectedContract,
  selectedFunction,
}) {
  if (!selectedFunctionAbi || selectedFunctionAbi.inputs.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Function Arguments</label>
      <div className="space-y-4">
        {selectedFunctionAbi.inputs.map((input, index) => {
          const paramName = input.name || `arg${index}`;
          const inputId = `${selectedContract}-${selectedFunction}-${paramName}`;
          // Default value should be [] for arrays, {} for tuples, "" for other types
          const isArrayType = input.type.includes("[]") || /\[\d+\]/.test(input.type);
          const isTupleType = input.type === "tuple";
          const defaultValue = isArrayType ? [] : isTupleType ? {} : "";
          return (
            <div key={inputId} className="mt-4">
              <label htmlFor={inputId} className="block text-xs text-gray-600 mb-1 cursor-pointer">
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
  );
}

export default FunctionArguments;
