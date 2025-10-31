import { useState, useEffect } from "react";

function BytesInput({ value, onChange, type = "bytes", id }) {
  const [error, setError] = useState("");

  // Extract byte size from type (e.g., bytes32 -> 32, bytes -> null for dynamic)
  const getByteSize = () => {
    const match = type.match(/bytes(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const validateValue = (inputValue) => {
    if (!inputValue || inputValue.trim() === "") {
      setError("");
      return true;
    }

    const trimmedValue = inputValue.trim();

    // Check if it starts with 0x
    if (!trimmedValue.startsWith("0x")) {
      setError("Hex string must start with 0x");
      return false;
    }

    // Check if it contains only hex characters after 0x
    const hexPart = trimmedValue.slice(2);
    if (!/^[0-9a-fA-F]*$/.test(hexPart)) {
      setError("Must contain only hexadecimal characters");
      return false;
    }

    // For fixed-size bytes, check the exact length
    const byteSize = getByteSize();
    if (byteSize !== null) {
      const expectedLength = byteSize * 2; // Each byte is 2 hex characters
      if (hexPart.length !== expectedLength) {
        setError(
          `${type} requires exactly ${expectedLength} hex characters (got ${hexPart.length})`
        );
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    validateValue(newValue);
  };

  useEffect(() => {
    if (value) {
      validateValue(value);
    }
  }, [value]);

  const byteSize = getByteSize();
  const placeholder = byteSize
    ? `0x${"".padEnd(byteSize * 2, "0")}`
    : "0x...";

  return (
    <div>
      <input
        type="text"
        id={id}
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full p-2 border rounded-md bg-white text-gray-900 font-mono text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {byteSize && !error && (
        <p className="text-gray-500 text-xs mt-1">
          Requires {byteSize * 2} hex characters
        </p>
      )}
    </div>
  );
}

export default BytesInput;

