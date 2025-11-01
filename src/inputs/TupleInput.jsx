import { useState, useEffect, useRef } from "react";
import InputRouter from "./InputRouter";

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

  // Update parent whenever tupleFields changes
  useEffect(() => {
    onChangeRef.current(tupleFields);
  }, [tupleFields]);

  // Update parent validation whenever field validation changes
  useEffect(() => {
    // Check if all fields are valid
    const allFieldsValid = components.every((component, index) => {
      const fieldName = component.name || `field${index}`;
      const validation = fieldValidation[fieldName];
      // undefined means not yet validated, which we treat as valid
      return validation !== false;
    });

    if (onValidationChange) {
      onValidationChange(allFieldsValid);
    }
  }, [fieldValidation, components, onValidationChange]);

  const handleFieldChange = (fieldName, newValue) => {
    setTupleFields((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));
  };

  const handleFieldValidation = (fieldName, isValid) => {
    setFieldValidation((prev) => ({
      ...prev,
      [fieldName]: isValid,
    }));
  };

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
              <InputRouter
                type={component.type}
                components={component.components} // Pass components for nested tuples
                value={fieldValue}
                onChange={(newValue) => handleFieldChange(fieldName, newValue)}
                onValidationChange={(isValid) =>
                  handleFieldValidation(fieldName, isValid)
                }
                id={fieldId}
                depth={depth + 1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TupleInput;
