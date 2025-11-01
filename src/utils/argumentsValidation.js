/**
 * Check if all inputs have been validated
 */
export function validateAllInputs(inputs, argValidation) {
  return inputs.every((input, index) => {
    const paramName = input.name || `arg${index}`;
    return paramName in argValidation;
  });
}

/**
 * Check if all arguments are valid
 */
export function validateAllArgs(inputs, argValidation) {
  return inputs.every((input, index) => {
    const paramName = input.name || `arg${index}`;
    const validation = argValidation[paramName];
    return validation === true;
  });
}

/**
 * Create an object with parameter names as keys for JSON representation
 */
export function createArgsObject(inputs, functionArgs) {
  const argsObject = {};
  inputs.forEach((input, index) => {
    const paramName = input.name || `arg${index}`;
    argsObject[paramName] = functionArgs[paramName];
  });
  return argsObject;
}

/**
 * Create an array of arguments in the correct order for encoding
 */
export function createArgsArray(inputs, functionArgs) {
  return inputs.map((input, index) => {
    const paramName = input.name || `arg${index}`;
    return functionArgs[paramName];
  });
}

/**
 * Validate that all args are present and have valid values
 */
export function hasValidArgs(args, inputs) {
  return args.every((arg, index) => {
    const input = inputs[index];
    const type = input.type.toLowerCase();

    // For arrays, empty is valid
    if (Array.isArray(arg)) {
      return true;
    }

    // For tuples/objects, check if it's an object
    if (type === "tuple" || type.includes("tuple")) {
      return arg !== null && typeof arg === "object";
    }

    // For other types, check if defined and not empty string
    return arg !== undefined && arg !== "";
  });
}
