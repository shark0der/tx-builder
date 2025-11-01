import { memo } from "react";

import { isArrayType } from "../../utils/arrayTypeParser";
import { getInputComponentForType } from "../../utils/typeMapping";
import ArrayInput from "./ArrayInput";
import TupleInput from "./TupleInput";

/**
 * Renders a single array item with index badge, input, and remove button
 * Extracted from ArrayInput to reduce component complexity
 */
const ArrayItem = memo(function ArrayItem({
  item,
  index,
  elementType,
  components,
  isFixedSize,
  id,
  depth,
  onItemChange,
  onItemValidation,
  onRemoveItem,
}) {
  const isElementArray = isArrayType(elementType);
  const isElementTuple = elementType.trim().toLowerCase() === "tuple";

  return (
    <div className="flex items-start gap-2 border border-transparent has-[>button:hover]:border-red-400 rounded-md py-1.5 px-2 transition-colors">
      {/* Index Badge */}
      <span className="inline-flex items-center justify-center w-6 h-[42px] rounded text-gray-500 text-xs font-medium flex-shrink-0 select-none">
        {index}
      </span>

      {/* Input Content */}
      <div className="flex-1 min-w-0">
        {isElementArray ? (
          // Recursively render nested array
          <ArrayInput
            type={elementType}
            components={components} // Pass components for tuple arrays
            value={item.value}
            onChange={(newValue) => onItemChange(index, newValue)}
            onValidationChange={(isValid) => onItemValidation(item.id, isValid)}
            id={`${id}-${index}`}
            depth={depth + 1}
          />
        ) : isElementTuple ? (
          // Render tuple elements
          <TupleInput
            type={elementType}
            components={components} // Components from parent for tuple arrays
            value={item.value}
            onChange={(newValue) => onItemChange(index, newValue)}
            onValidationChange={(isValid) => onItemValidation(item.id, isValid)}
            id={`${id}-${index}`}
            depth={depth + 1}
          />
        ) : (
          // Render base type input using shared type mapping
          (() => {
            const InputComponent = getInputComponentForType(elementType);
            return (
              <InputComponent
                type={elementType}
                value={item.value}
                onChange={(newValue) => onItemChange(index, newValue)}
                onValidationChange={(isValid) => onItemValidation(item.id, isValid)}
                id={`${id}-${index}`}
              />
            );
          })()
        )}
      </div>

      {/* Remove Button */}
      {!isFixedSize && (
        <button
          type="button"
          onClick={() => onRemoveItem(item.id)}
          className="w-6 h-[42px] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 text-2xl leading-none cursor-pointer"
          title="Remove item"
        >
          ×
        </button>
      )}
    </div>
  );
});

export default ArrayItem;
