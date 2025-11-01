import { getInputComponentForType } from "../../utils/typeMapping";
import ArrayInput from "./ArrayInput";
import TupleInput from "./TupleInput";

function InputRouter({ type, components, value, onChange, onValidationChange, name, id, depth }) {
  // Normalize the type
  const normalizedType = type.trim().toLowerCase();

  // Tuple types - check FIRST before arrays (tuple[] will be handled by ArrayInput)
  if (normalizedType === "tuple") {
    return (
      <TupleInput
        type={type}
        components={components}
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        id={id}
        depth={depth}
      />
    );
  }

  // Array types - check before base types
  if (normalizedType.includes("[]") || /\[\d+\]/.test(normalizedType)) {
    return (
      <ArrayInput
        type={type}
        components={components}
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        id={id}
      />
    );
  }

  // Use shared type mapping for base types
  const InputComponent = getInputComponentForType(type);

  return (
    <InputComponent
      value={value}
      onChange={onChange}
      onValidationChange={onValidationChange}
      type={type}
      name={name}
      id={id}
    />
  );
}

export default InputRouter;
