import AddressInput from "../components/inputs/AddressInput";
import BoolInput from "../components/inputs/BoolInput";
import BytesInput from "../components/inputs/BytesInput";
import IntInput from "../components/inputs/IntInput";
import StringInput from "../components/inputs/StringInput";
import UintInput from "../components/inputs/UintInput";

/**
 * Maps Solidity type to appropriate input component
 * Used by both InputRouter and ArrayInput to avoid code duplication
 */
export function getInputComponentForType(type) {
  const normalizedType = type.trim().toLowerCase();

  // Boolean type
  if (normalizedType === "bool") {
    return BoolInput;
  }

  // Unsigned integer types
  if (normalizedType.startsWith("uint")) {
    return UintInput;
  }

  // Signed integer types
  if (normalizedType.match(/^int(\d+)?$/)) {
    return IntInput;
  }

  // Address type
  if (normalizedType === "address") {
    return AddressInput;
  }

  // Bytes types (both fixed and dynamic)
  if (normalizedType.startsWith("bytes")) {
    return BytesInput;
  }

  // String type and fallback for unknown types
  return StringInput;
}
