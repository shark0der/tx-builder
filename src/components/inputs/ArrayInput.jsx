import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useArrayItems } from "../../hooks/useArrayItems";
import { getElementType, isArrayType } from "../../utils/arrayTypeParser";
import ArrayItem from "./ArrayItem";

function ArrayInput({ type, components, value, onChange, onValidationChange, id, depth = 0 }) {
  const elementType = getElementType(type);

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

  // Use the extracted hook for array state management
  const {
    arrayItems,
    isFixedSize,
    firstDimension,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
  } = useArrayItems(type, value, onChange, getDefaultValue);

  // Store latest onValidationChange in a ref to avoid re-running effect
  const onValidationChangeRef = useRef(onValidationChange);
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  // Compute validation state
  const isValid = useMemo(() => {
    // Check if fixed-size array has wrong length
    const hasLengthError = isFixedSize && arrayItems.length !== firstDimension;

    if (hasLengthError) {
      return false;
    }

    // Empty arrays are valid for dynamic arrays
    if (arrayItems.length === 0 && !isFixedSize) {
      return true;
    }

    // Check if all items are valid
    const allItemsValid = arrayItems.every((item) => {
      const validation = itemValidation[item.id];
      // undefined means not yet validated, treat as invalid
      // Only true means the item is valid and populated
      return validation === true;
    });

    return allItemsValid;
  }, [itemValidation, arrayItems, isFixedSize, firstDimension]);

  // Update parent validation whenever isValid changes
  useEffect(() => {
    if (onValidationChangeRef.current) {
      onValidationChangeRef.current(isValid);
    }
  }, [isValid]);

  const handleItemValidation = useCallback((itemId, isValid) => {
    setItemValidation((prev) => {
      if (prev[itemId] === isValid) {
        return prev;
      }
      return {
        ...prev,
        [itemId]: isValid,
      };
    });
  }, []);

  const paddingLeft = depth * 20;

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
          <span className="text-xs text-red-600 font-medium">Required: {firstDimension} items</span>
        </div>
      )}

      {/* Array Items */}
      <div className="space-y-2">
        {arrayItems.map((item, index) => (
          <ArrayItem
            key={item.id}
            item={item}
            index={index}
            elementType={elementType}
            components={components}
            isFixedSize={isFixedSize}
            id={id}
            depth={depth}
            onItemChange={handleItemChange}
            onItemValidation={handleItemValidation}
            onRemoveItem={handleRemoveItem}
          />
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default ArrayInput;
