import BoolInput from "./BoolInput";
import UintInput from "./UintInput";
import IntInput from "./IntInput";
import AddressInput from "./AddressInput";
import StringInput from "./StringInput";
import BytesInput from "./BytesInput";
import ArrayInput from "./ArrayInput";

function InputRouter({ type, value, onChange, onValidationChange, name, id }) {
  // Normalize the type
  const normalizedType = type.trim().toLowerCase();

  // Array types - check FIRST before base types
  if (normalizedType.includes("[]") || /\[\d+\]/.test(normalizedType)) {
    return <ArrayInput type={type} value={value} onChange={onChange} onValidationChange={onValidationChange} id={id} />;
  }

  // Boolean type
  if (normalizedType === "bool") {
    return <BoolInput value={value} onChange={onChange} onValidationChange={onValidationChange} name={name} id={id} />;
  }

  // Unsigned integer types
  if (normalizedType.startsWith("uint")) {
    return <UintInput value={value} onChange={onChange} onValidationChange={onValidationChange} type={type} id={id} />;
  }

  // Signed integer types
  if (normalizedType.match(/^int(\d+)?$/)) {
    return <IntInput value={value} onChange={onChange} onValidationChange={onValidationChange} type={type} id={id} />;
  }

  // Address type
  if (normalizedType === "address") {
    return <AddressInput value={value} onChange={onChange} onValidationChange={onValidationChange} id={id} />;
  }

  // Bytes types (both fixed and dynamic)
  if (normalizedType.startsWith("bytes")) {
    return <BytesInput value={value} onChange={onChange} onValidationChange={onValidationChange} type={type} id={id} />;
  }

  // String type
  if (normalizedType === "string") {
    return <StringInput value={value} onChange={onChange} onValidationChange={onValidationChange} id={id} />;
  }

  // Fallback to string input for unknown types
  return <StringInput value={value} onChange={onChange} onValidationChange={onValidationChange} id={id} />;
}

export default InputRouter;
