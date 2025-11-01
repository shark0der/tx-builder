import BoolInput from "./BoolInput";
import UintInput from "./UintInput";
import IntInput from "./IntInput";
import AddressInput from "./AddressInput";
import StringInput from "./StringInput";
import BytesInput from "./BytesInput";
import ArrayInput from "./ArrayInput";
import TupleInput from "./TupleInput";

function InputRouter({
  type,
  components,
  value,
  onChange,
  onValidationChange,
  name,
  id,
  depth,
}) {
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

  // Boolean type
  if (normalizedType === "bool") {
    return (
      <BoolInput
        value={value}
        onChange={onChange}
        onValidationChange={onValidationChange}
        name={name}
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

export default InputRouter;
