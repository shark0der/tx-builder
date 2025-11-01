/**
 * Parse a Solidity array type string into its base type and dimensions.
 * In Solidity, the RIGHTMOST dimension is the OUTERMOST array, LEFTMOST is INNERMOST:
 * - uint256[3][2] means: 2 elements (outer), each is an array of 3 uint256 values (inner)
 * - uint256[2][3][4] means: 4 elements, each is an array of (3 elements, each is an array of 2 uint256s)
 * - Read right-to-left: [2] is outermost, [3] is innermost for uint256[3][2]
 *
 * The dimensions array stores them in this order: [outermost, ..., innermost]
 *
 * Examples:
 * - "uint256" -> { baseType: "uint256", dimensions: [] }
 * - "address[]" -> { baseType: "address", dimensions: [null] }
 * - "bytes32[5]" -> { baseType: "bytes32", dimensions: [5] }
 * - "uint256[][3]" -> { baseType: "uint256", dimensions: [3, null] } // 3 dynamic arrays
 * - "uint256[3][2]" -> { baseType: "uint256", dimensions: [2, 3] } // 2 arrays of 3 uint256s
 * - "address[2][3][4]" -> { baseType: "address", dimensions: [4, 3, 2] } // 4 arrays of (3 arrays of 2 addresses)
 *
 * @param {string} type - Solidity type string (e.g., "uint256[][5]")
 * @returns {{ baseType: string, dimensions: (number|null)[] }}
 */
export function parseArrayType(type) {
  const dimensions = [];
  let remainingType = type.trim();

  // Extract all array brackets from right to left
  // Rightmost is outermost, so we parse right-to-left and add in order
  const bracketRegex = /\[(\d*)\]$/;
  let match;

  while ((match = bracketRegex.exec(remainingType)) !== null) {
    // Empty brackets [] mean dynamic array (null), otherwise parse the size
    const size = match[1] === "" ? null : parseInt(match[1], 10);
    dimensions.push(size); // Add in order: rightmost first (outermost)

    // Remove the bracket from the type string
    remainingType = remainingType.slice(0, match.index);
  }

  return {
    baseType: remainingType,
    dimensions: dimensions,
  };
}

/**
 * Check if a type string represents an array
 * @param {string} type - Solidity type string
 * @returns {boolean}
 */
export function isArrayType(type) {
  return /\[\d*\]/.test(type);
}

/**
 * Get the element type for an array (removes the rightmost dimension)
 *
 * Examples:
 * - "uint256[]" -> "uint256"
 * - "address[5]" -> "address"
 * - "bytes32[][3]" -> "bytes32[]"
 *
 * @param {string} type - Solidity array type string
 * @returns {string}
 */
export function getElementType(type) {
  const { baseType, dimensions } = parseArrayType(type);

  if (dimensions.length === 0) {
    return type; // Not an array
  }

  // Remove the first dimension and reconstruct the type
  const elementDimensions = dimensions.slice(1);

  if (elementDimensions.length === 0) {
    return baseType;
  }

  // Reconstruct with remaining dimensions (reverse order for Solidity notation)
  return (
    baseType +
    [...elementDimensions]
      .reverse()
      .map((d) => `[${d === null ? "" : d}]`)
      .join("")
  );
}

/**
 * Get the rightmost dimension size (null for dynamic, number for fixed)
 * @param {string} type - Solidity array type string
 * @returns {number|null}
 */
export function getArraySize(type) {
  const { dimensions } = parseArrayType(type);
  return dimensions.length > 0 ? dimensions[0] : null;
}
