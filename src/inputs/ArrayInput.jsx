import { useState, useEffect, useRef, useCallback } from "react";
import { parseArrayType, getElementType, isArrayType } from "./arrayTypeParser";
import BoolInput from "./BoolInput";
import UintInput from "./UintInput";
import IntInput from "./IntInput";
import AddressInput from "./AddressInput";
import StringInput from "./StringInput";
import BytesInput from "./BytesInput";
import TupleInput from "./TupleInput";

function ArrayInput({
  type,
  components,
  value,
  onChange,
  onValidationChange,
  id,
  depth = 0,
}) {
  const { dimensions } = parseArrayType(type);
  const firstDimension = dimensions[0]; // null for dynamic, number for fixed
  const elementType = getElementType(type);
  const isFixedSize = firstDimension !== null;

  // Generate unique ID for each item
  const nextIdRef = useRef(0);
  const getUniqueId = () => nextIdRef.current++;

  // Track validation state for each item
  const [itemValidation, setItemValidation] = useState({});

  // Get default value for element type
  const getDefaultValue = useCallback(() => {
    const normalizedType = elementType.trim().toLowerCase();
    if (normalizedType === "bool") {
      return false;
    }
    // For tuples, return empty object
    if (normalizedType === "tuple") {
      return {};
    }
    // For nested arrays, return empty array
    if (isArrayType(elementType)) {
      return [];
    }
    return "";
  }, [elementType]);

  // Initialize array state with unique IDs
  const [arrayItems, setArrayItems] = useState(() => {
    const initializeWithIds = (arr) =>
      arr.map((val) => ({ id: getUniqueId(), value: val }));

    if (Array.isArray(value) && value.length > 0) {
      // For fixed-size arrays, ensure correct length
      if (isFixedSize && value.length !== firstDimension) {
        const arr = [...value];
        // Pad with default values if too short
        while (arr.length < firstDimension) {
          arr.push(getDefaultValue());
        }
        // Truncate if too long
        return initializeWithIds(arr.slice(0, firstDimension));
      }
      return initializeWithIds(value);
    }
    // For fixed-size arrays, pre-populate with default values
    if (isFixedSize) {
      return initializeWithIds(
        Array(firstDimension)
          .fill(null)
          .map(() => getDefaultValue())
      );
    }
    return [];
  });

  // Store latest onChange in a ref to avoid re-running effect
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Reset array when type changes (e.g., switching from uint256[5] to uint256[])
  const prevTypeRef = useRef(type);
  useEffect(() => {
    if (prevTypeRef.current !== type) {
      prevTypeRef.current = type;
      // Reinitialize array with correct structure for the new type
      if (isFixedSize) {
        setArrayItems(
          Array(firstDimension)
            .fill(null)
            .map(() => ({ id: getUniqueId(), value: getDefaultValue() }))
        );
      } else {
        setArrayItems([]);
      }
    }
  }, [type, isFixedSize, firstDimension, getDefaultValue]);

  // Ensure fixed-size arrays maintain correct length
  useEffect(() => {
    if (isFixedSize && arrayItems.length !== firstDimension) {
      const newArray = [...arrayItems];
      // Pad with default values if too short
      while (newArray.length < firstDimension) {
        newArray.push({ id: getUniqueId(), value: getDefaultValue() });
      }
      // Truncate if too long
      const correctedArray = newArray.slice(0, firstDimension);
      setArrayItems(correctedArray);
    }
  }, [isFixedSize, firstDimension, arrayItems, getDefaultValue]);

  // Update parent whenever arrayItems changes (including on mount)
  useEffect(() => {
    onChangeRef.current(arrayItems.map((item) => item.value));
  }, [arrayItems]);

  // Update parent validation whenever item validation or array length changes
  useEffect(() => {
    // Check if fixed-size array has wrong length
    const hasLengthError = isFixedSize && arrayItems.length !== firstDimension;

    // Check if all items are valid
    const allItemsValid = arrayItems.every((item) => {
      const validation = itemValidation[item.id];
      return validation !== false; // undefined means not yet validated, which we treat as valid
    });

    const isValid = !hasLengthError && allItemsValid;

    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [
    itemValidation,
    arrayItems,
    isFixedSize,
    firstDimension,
    onValidationChange,
  ]);

  const handleItemChange = (index, newValue) => {
    const newArray = [...arrayItems];
    newArray[index] = { ...newArray[index], value: newValue };
    setArrayItems(newArray);
  };

  const handleItemValidation = (itemId, isValid) => {
    setItemValidation((prev) => ({
      ...prev,
      [itemId]: isValid,
    }));
  };

  const handleAddItem = () => {
    if (isFixedSize && arrayItems.length >= firstDimension) {
      return; // Can't add more items to fixed-size array
    }
    setArrayItems([
      ...arrayItems,
      { id: getUniqueId(), value: getDefaultValue() },
    ]);
  };

  const handleRemoveItem = (itemId) => {
    if (isFixedSize) {
      return; // Can't remove items from fixed-size array
    }
    const newArray = arrayItems.filter((item) => item.id !== itemId);
    setArrayItems(newArray);
  };

  const paddingLeft = depth * 20;
  const isElementArray = isArrayType(elementType);
  const isElementTuple = elementType.trim().toLowerCase() === "tuple";

  // Check if fixed-size array has wrong length
  const hasLengthError = isFixedSize && arrayItems.length !== firstDimension;

  return (
    <div
      style={{ marginLeft: `${paddingLeft}px` }}
      className={`${depth > 0 ? "border-l-2 border-blue-200 pl-4" : ""}`}
    >
      {/* Error message for fixed-size arrays with wrong length */}
      {hasLengthError && (
        <div className="mb-3 bg-red-50 px-3 py-2 rounded-md border border-red-200">
          <span className="text-xs text-red-600 font-medium">
            Required: {firstDimension} items
          </span>
        </div>
      )}

      {/* Array Items */}
      <div className="space-y-2">
        {arrayItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-start gap-2 border border-transparent has-[>button:hover]:border-red-400 rounded-md py-1.5 px-2 transition-colors"
          >
            {/* Index Badge */}
            <span className="inline-flex items-center justify-center w-6 h-[42px] rounded text-gray-500 text-xs font-medium flex-shrink-0 select-none">
              {index}
            </span>

            {/* Input Content */}
            <div className="flex-1 min-w-0">
              {isElementArray ? (
                // Recursively render nested array
                <ArrayInput
                  type={elementType}
                  components={components} // Pass components for tuple arrays
                  value={item.value}
                  onChange={(newValue) => handleItemChange(index, newValue)}
                  onValidationChange={(isValid) =>
                    handleItemValidation(item.id, isValid)
                  }
                  id={`${id}-${index}`}
                  depth={depth + 1}
                />
              ) : isElementTuple ? (
                // Render tuple elements
                <TupleInput
                  type={elementType}
                  components={components} // Components from parent for tuple arrays
                  value={item.value}
                  onChange={(newValue) => handleItemChange(index, newValue)}
                  onValidationChange={(isValid) =>
                    handleItemValidation(item.id, isValid)
                  }
                  id={`${id}-${index}`}
                  depth={depth + 1}
                />
              ) : (
                // Render base type input directly (avoid circular dependency)
                <BaseInputSelector
                  type={elementType}
                  value={item.value}
                  onChange={(newValue) => handleItemChange(index, newValue)}
                  onValidationChange={(isValid) =>
                    handleItemValidation(item.id, isValid)
                  }
                  id={`${id}-${index}`}
                />
              )}
            </div>

            {/* Remove Button */}
            {!isFixedSize && (
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="w-6 h-[42px] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 text-2xl leading-none cursor-pointer"
                title="Remove item"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      {(!isFixedSize || arrayItems.length < firstDimension) && (
        <div className="flex items-start gap-2 py-1.5 px-2">
          {/* Spacer for badge alignment */}
          <span className="w-6 flex-shrink-0"></span>

          {/* Button */}
          <button
            type="button"
            onClick={handleAddItem}
            className="flex-1 h-[42px] px-4 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Item
          </button>

          {/* Spacer for remove button alignment */}
          {!isFixedSize && <span className="w-6 flex-shrink-0"></span>}
        </div>
      )}
    </div>
  );
}

// Direct input selector to avoid circular dependency with InputRouter
// This replicates the InputRouter logic for base types only
function BaseInputSelector({
  type,
  components,
  value,
  onChange,
  onValidationChange,
  id,
}) {
  const normalizedType = type.trim().toLowerCase();

  // Tuple type
  if (normalizedType === "tuple") {
    return (
      <TupleInput
        type={type}
        components={components}
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        id={id}
      />
    );
  }

  // Boolean type
  if (normalizedType === "bool") {
    return (
      <BoolInput
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        id={id}
      />
    );
  }

  // Unsigned integer types
  if (normalizedType.startsWith("uint")) {
    return (
      <UintInput
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        type={type}
        id={id}
      />
    );
  }

  // Signed integer types
  if (normalizedType.match(/^int(\d+)?$/)) {
    return (
      <IntInput
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        type={type}
        id={id}
      />
    );
  }

  // Address type
  if (normalizedType === "address") {
    return (
      <AddressInput
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        id={id}
      />
    );
  }

  // Bytes types (both fixed and dynamic)
  if (normalizedType.startsWith("bytes")) {
    return (
      <BytesInput
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        type={type}
        id={id}
      />
    );
  }

  // String type
  if (normalizedType === "string") {
    return (
      <StringInput
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        id={id}
      />
    );
  }

  // Fallback to string input for unknown types
  return (
    <StringInput
      value={value}
      onChange={onChange}
      onValidationChange={onValidationChange}
      id={id}
    />
  );
}

export default ArrayInput;
