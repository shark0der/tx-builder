import { useEffect } from "react";

function StringInput({ value, onChange, onValidationChange, id }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Empty strings are valid values in Solidity
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [value, onValidationChange]);

  return (
    <div>
      <input
        type="text"
        id={id}
        value={value || ""}
        onChange={handleChange}
        placeholder="Enter string"
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
      />
    </div>
  );
}

export default StringInput;

