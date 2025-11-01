import { useEffect, useRef } from "react";

function BoolInput({ value, onChange, onValidationChange, id }) {
  const handleToggle = () => {
    onChange(!value);
  };

  // Store onValidationChange in a ref to avoid re-running effect
  const onValidationChangeRef = useRef(onValidationChange);
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  // Bool inputs are always valid
  useEffect(() => {
    if (onValidationChangeRef.current) {
      onValidationChangeRef.current(true);
    }
  }, [value]);

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value ? "bg-blue-600" : "bg-gray-300"
        }`}
        aria-checked={value}
        role="switch"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm text-gray-700">{value ? "True" : "False"}</span>
    </label>
  );
}

export default BoolInput;
