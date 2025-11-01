import { useCallback, useEffect, useRef, useState } from "react";

function UintInput({ value, onChange, onValidationChange, type = "uint256", id }) {
  const [error, setError] = useState("");

  const validateValue = useCallback(
    (inputValue) => {
      if (!inputValue || inputValue.trim() === "") {
        setError("");
        return false;
      }

      // Check if it's a valid number
      if (!/^\d+$/.test(inputValue.trim())) {
        setError("Must be a positive integer");
        return false;
      }

      try {
        const bigIntValue = BigInt(inputValue.trim());

        // Check if negative (BigInt handles this)
        if (bigIntValue < 0n) {
          setError("Must be positive");
          return false;
        }

        // Extract bit size from type (e.g., uint256 -> 256, uint -> 256)
        const match = type.match(/uint(\d+)/);
        const bitSize = match ? parseInt(match[1]) : 256;
        const maxValue = (1n << BigInt(bitSize)) - 1n;

        if (bigIntValue > maxValue) {
          setError(`Exceeds max value for ${type}: ${maxValue.toString()}`);
          return false;
        }

        setError("");
        return true;
      } catch {
        setError("Invalid number");
        return false;
      }
    },
    [type]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    const isValid = validateValue(newValue);
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  };

  // Store onValidationChange in a ref to avoid re-running effect
  const onValidationChangeRef = useRef(onValidationChange);
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  useEffect(() => {
    const isValid = validateValue(value);
    if (onValidationChangeRef.current) {
      onValidationChangeRef.current(isValid);
    }
  }, [value, validateValue]);

  return (
    <div>
      <input
        type="text"
        id={id}
        value={value || ""}
        onChange={handleChange}
        placeholder={`Enter ${type}`}
        className={`w-full p-2 border rounded-md bg-white text-gray-900 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default UintInput;
