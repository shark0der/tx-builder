import BoolInput from "./BoolInput";
import UintInput from "./UintInput";
import IntInput from "./IntInput";
import AddressInput from "./AddressInput";
import StringInput from "./StringInput";
import BytesInput from "./BytesInput";

function InputRouter({ type, value, onChange, name, id }) {
  // Normalize the type
  const normalizedType = type.trim().toLowerCase();

  // Array types - check FIRST before base types
  // TODO: Build specialized array input component
  if (normalizedType.includes("[]")) {
    return <StringInput value={value} onChange={onChange} id={id} />;
  }

  // Boolean type
  if (normalizedType === "bool") {
    return <BoolInput value={value} onChange={onChange} name={name} id={id} />;
  }

  // Unsigned integer types
  if (normalizedType.startsWith("uint")) {
    return <UintInput value={value} onChange={onChange} type={type} id={id} />;
  }

  // Signed integer types
  if (normalizedType.match(/^int(\d+)?$/)) {
    return <IntInput value={value} onChange={onChange} type={type} id={id} />;
  }

  // Address type
  if (normalizedType === "address") {
    return <AddressInput value={value} onChange={onChange} id={id} />;
  }

  // Bytes types (both fixed and dynamic)
  if (normalizedType.startsWith("bytes")) {
    return <BytesInput value={value} onChange={onChange} type={type} id={id} />;
  }

  // String type
  if (normalizedType === "string") {
    return <StringInput value={value} onChange={onChange} id={id} />;
  }

  // Fallback to string input for unknown types
  return <StringInput value={value} onChange={onChange} id={id} />;
}

export default InputRouter;
