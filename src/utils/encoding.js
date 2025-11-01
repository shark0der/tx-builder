import { encodeFunctionData } from "viem";

/**
 * Encode transaction data using viem
 * @param {Object} params - Encoding parameters
 * @param {Array} params.abi - Contract ABI
 * @param {string} params.functionName - Function name to encode
 * @param {Array} params.args - Function arguments
 * @returns {string} Encoded transaction data or error message
 */
export function encodeTransactionData({ abi, functionName, args }) {
  try {
    return encodeFunctionData({ abi, functionName, args });
  } catch (error) {
    console.error("Error encoding transaction data:", error);
    return `Error: ${error.message}`;
  }
}
