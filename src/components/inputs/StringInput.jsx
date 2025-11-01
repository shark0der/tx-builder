import { useEffect, useRef } from "react";

function StringInput({ value, onChange, onValidationChange, id }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Store onValidationChange in a ref to avoid re-running effect
  const onValidationChangeRef = useRef(onValidationChange);
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  // Empty strings are valid values in Solidity
  useEffect(() => {
    if (onValidationChangeRef.current) {
      onValidationChangeRef.current(true);
    }
  }, [value]);

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
