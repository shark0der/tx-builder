import { useEffect, useRef, useState } from "react";

function AddressInput({ value, onChange, onValidationChange, id }) {
  const [error, setError] = useState("");

  const validateAddress = (address) => {
    if (!address || address.trim() === "") {
      setError("");
      return false;
    }

    const trimmedAddress = address.trim();

    // Check if it starts with 0x
    if (!trimmedAddress.startsWith("0x")) {
      setError("Address must start with 0x");
      return false;
    }

    // Check if it's the correct length (0x + 40 hex characters)
    if (trimmedAddress.length !== 42) {
      setError("Address must be 42 characters (0x + 40 hex)");
      return false;
    }

    // Check if it contains only hex characters after 0x
    const hexPart = trimmedAddress.slice(2);
    if (!/^[0-9a-fA-F]+$/.test(hexPart)) {
      setError("Address must contain only hexadecimal characters");
      return false;
    }

    setError("");
    return true;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    const isValid = validateAddress(newValue);
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
    const isValid = validateAddress(value);
    if (onValidationChangeRef.current) {
      onValidationChangeRef.current(isValid);
    }
  }, [value]);

  return (
    <div>
      <input
        type="text"
        id={id}
        value={value || ""}
        onChange={handleChange}
        placeholder="0x..."
        className={`w-full p-2 border rounded-md bg-white text-gray-900 font-mono text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default AddressInput;
