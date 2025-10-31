import { useState, useEffect } from "react";

function IntInput({ value, onChange, type = "int256", id }) {
  const [error, setError] = useState("");

  // Extract bit size from type (e.g., int256 -> 256, int -> 256)
  const getBitSize = () => {
    const match = type.match(/int(\d+)/);
    return match ? parseInt(match[1]) : 256;
  };

  const validateValue = (inputValue) => {
    if (!inputValue || inputValue.trim() === "") {
      setError("");
      return true;
    }

    // Check if it's a valid signed integer
    if (!/^-?\d+$/.test(inputValue.trim())) {
      setError("Must be a valid integer");
      return false;
    }

    try {
      const bigIntValue = BigInt(inputValue.trim());

      // Check min/max value based on bit size
      const bitSize = getBitSize();
      const maxValue = (1n << BigInt(bitSize - 1)) - 1n;
      const minValue = -(1n << BigInt(bitSize - 1));

      if (bigIntValue > maxValue) {
        setError(`Exceeds max value for ${type}: ${maxValue.toString()}`);
        return false;
      }

      if (bigIntValue < minValue) {
        setError(`Below min value for ${type}: ${minValue.toString()}`);
        return false;
      }

      setError("");
      return true;
    } catch (e) {
      setError("Invalid number");
      return false;
    }
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

export default IntInput;

