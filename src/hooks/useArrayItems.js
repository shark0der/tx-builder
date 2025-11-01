import { useCallback, useEffect, useRef, useState } from "react";

import { parseArrayType } from "../utils/arrayTypeParser";

/**
 * Hook to manage array items state and handlers
 * Extracted from ArrayInput to reduce component complexity
 */
export function useArrayItems(type, value, onChange, getDefaultValue) {
  const { dimensions } = parseArrayType(type);
  const firstDimension = dimensions[0]; // null for dynamic, number for fixed
  const isFixedSize = firstDimension !== null;

  // Generate unique ID for each item
  const nextIdRef = useRef(0);
  const getUniqueId = () => nextIdRef.current++;

  // Initialize array state with unique IDs
  const [arrayItems, setArrayItems] = useState(() => {
    const initializeWithIds = (arr) => arr.map((val) => ({ id: getUniqueId(), value: val }));

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

  // Store previous array values to prevent unnecessary updates
  const prevValuesRef = useRef();

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
    if (isFixedSize) {
      setArrayItems((prevItems) => {
        if (prevItems.length === firstDimension) {
          return prevItems; // No change needed
        }
        const newArray = [...prevItems];
        // Pad with default values if too short
        while (newArray.length < firstDimension) {
          newArray.push({ id: getUniqueId(), value: getDefaultValue() });
        }
        // Truncate if too long
        return newArray.slice(0, firstDimension);
      });
    }
  }, [isFixedSize, firstDimension, getDefaultValue]);

  // Update parent whenever arrayItems changes
  useEffect(() => {
    const arrayValues = arrayItems.map((item) => item.value);

    // Only call onChange if values have actually changed
    const prevValues = prevValuesRef.current;
    const valuesChanged =
      prevValues === undefined || JSON.stringify(arrayValues) !== JSON.stringify(prevValues);

    if (valuesChanged) {
      prevValuesRef.current = arrayValues;
      onChangeRef.current(arrayValues);
    }
  }, [arrayItems]);

  // Handler functions
  const handleItemChange = useCallback((index, newValue) => {
    setArrayItems((prev) => {
      const newArray = [...prev];
      newArray[index] = { ...newArray[index], value: newValue };
      return newArray;
    });
  }, []);

  const handleAddItem = useCallback(() => {
    setArrayItems((prev) => {
      if (isFixedSize && prev.length >= firstDimension) {
        return prev; // Can't add more items to fixed-size array
      }
      return [...prev, { id: getUniqueId(), value: getDefaultValue() }];
    });
  }, [isFixedSize, firstDimension, getDefaultValue]);

  const handleRemoveItem = useCallback(
    (itemId) => {
      if (isFixedSize) {
        return; // Can't remove items from fixed-size array
      }
      setArrayItems((prev) => prev.filter((item) => item.id !== itemId));
    },
    [isFixedSize]
  );

  return {
    arrayItems,
    isFixedSize,
    firstDimension,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
  };
}
