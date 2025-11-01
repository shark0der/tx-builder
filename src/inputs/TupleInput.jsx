import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import InputRouter from "./InputRouter";

// Memoized field input to prevent unnecessary re-renders
const MemoizedFieldInput = memo(function MemoizedFieldInput({
  type,
  components,
  value,
  fieldName,
  fieldId,
  depth,
  onFieldChange,
  onFieldValidation,
}) {
  const handleChange = useCallback(
    (newValue) => onFieldChange(fieldName, newValue),
    [onFieldChange, fieldName]
  );

  const handleValidation = useCallback(
    (isValid) => onFieldValidation(fieldName, isValid),
    [onFieldValidation, fieldName]
  );

  return (
    <InputRouter
      type={type}
      components={components}
      value={value}
      onChange={handleChange}
      onValidationChange={handleValidation}
      id={fieldId}
      depth={depth}
    />
  );
});

function TupleInput({
  components = [],
  value,
  onChange,
  onValidationChange,
  id,
  depth = 0,
}) {
  // Track validation state for each field
  const [fieldValidation, setFieldValidation] = useState({});

  // Get default value for a component type
  const getDefaultValue = (componentType) => {
    const normalizedType = componentType.trim().toLowerCase();
    if (normalizedType === "bool") {
      return false;
    }
    if (normalizedType === "tuple") {
      return {};
    }
    // For arrays, return empty array
    if (normalizedType.includes("[]") || /\[\d+\]/.test(normalizedType)) {
      return [];
    }
    return "";
  };

  // Initialize tuple state
  const [tupleFields, setTupleFields] = useState(() => {
    const initialFields = {};
    components.forEach((component, index) => {
      const fieldName = component.name || `field${index}`;
      // Use existing value if available, otherwise use default
      if (value && typeof value === "object" && fieldName in value) {
        initialFields[fieldName] = value[fieldName];
      } else {
        initialFields[fieldName] = getDefaultValue(component.type);
      }
    });
    return initialFields;
  });

  // Store latest onChange in a ref to avoid re-running effect
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Store latest onValidationChange in a ref to avoid re-running effect
  const onValidationChangeRef = useRef(onValidationChange);
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  // Update parent whenever tupleFields changes
  useEffect(() => {
    onChangeRef.current(tupleFields);
  }, [tupleFields]);

  // Compute validation state
  const isValid = useMemo(() => {
    // Check if all fields are valid
    return components.every((component, index) => {
      const fieldName = component.name || `field${index}`;
      const validation = fieldValidation[fieldName];
      // undefined means not yet validated, treat as invalid
      // Only true means the field is valid and populated
      return validation === true;
    });
  }, [fieldValidation, components]);

  // Update parent validation whenever isValid changes
  useEffect(() => {
    if (onValidationChangeRef.current) {
      onValidationChangeRef.current(isValid);
    }
  }, [isValid]);

  const handleFieldChange = useCallback((fieldName, newValue) => {
    setTupleFields((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));
  }, []);

  const handleFieldValidation = useCallback((fieldName, isValid) => {
    setFieldValidation((prev) => {
      if (prev[fieldName] === isValid) {
        return prev;
      }
      return {
        ...prev,
        [fieldName]: isValid,
      };
    });
  }, []);

  const paddingLeft = depth * 20;

  return (
    <div
      style={{ marginLeft: `${paddingLeft}px` }}
      className={`${depth > 0 ? "border-l-2 border-blue-200 pl-4" : ""}`}
    >
      {/* Tuple Fields */}
      <div className="border border-gray-200 rounded-md p-3 space-y-3">
        {components.map((component, index) => {
          const fieldName = component.name || `field${index}`;
          const fieldId = `${id}-${fieldName}`;
          const fieldValue = tupleFields[fieldName];

          return (
            <div key={fieldId}>
              {/* Field Label */}
              <label
                htmlFor={fieldId}
                className="block text-xs text-gray-600 mb-1.5 cursor-pointer font-medium"
              >
                {fieldName}: {component.type}
              </label>

              {/* Field Input */}
              <MemoizedFieldInput
                type={component.type}
                components={component.components} // Pass components for nested tuples
                value={fieldValue}
                fieldName={fieldName}
                fieldId={fieldId}
                depth={depth + 1}
                onFieldChange={handleFieldChange}
                onFieldValidation={handleFieldValidation}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TupleInput;
