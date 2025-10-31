import { useState, useEffect, useRef } from "react";

function SearchableDropdown({ options, value, onChange, placeholder, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const optionRefs = useRef([]);
  const wasOpenRef = useRef(false);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display label for selected value
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex].scrollIntoView({
        block: "nearest",
        behavior: "auto",
      });
    }
  }, [highlightedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Refocus button when dropdown closes
  useEffect(() => {
    if (wasOpenRef.current && !isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          // Navigate to next option when closed (no wrap)
          const currentIndex = options.findIndex((opt) => opt.value === value);
          if (currentIndex < options.length - 1) {
            onChange(options[currentIndex + 1].value);
          }
        } else {
          // Navigate through filtered options when open
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          // Navigate to previous option when closed (no wrap)
          const currentIndex = options.findIndex((opt) => opt.value === value);
          if (currentIndex > 0) {
            onChange(options[currentIndex - 1].value);
          }
        } else {
          // Navigate through filtered options when open
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
        break;
      case "Enter":
        e.preventDefault();
        if (
          isOpen &&
          highlightedIndex >= 0 &&
          filteredOptions[highlightedIndex]
        ) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
          setSearchTerm("");
        }
        break;
      default:
        break;
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHighlightedIndex(-1);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} className="relative" onKeyDown={handleKeyDown}>
      {/* Display button */}
      <button
        ref={buttonRef}
        type="button"
        id={id}
        onClick={handleToggle}
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 text-left flex justify-between items-center"
      >
        <span className={`truncate ${selectedLabel ? "" : "text-gray-500"}`}>
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  ref={(el) => (optionRefs.current[index] = el)}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors truncate ${
                    option.value === value ? "bg-blue-100 font-medium" : ""
                  } ${highlightedIndex === index ? "bg-blue-200" : ""}`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
