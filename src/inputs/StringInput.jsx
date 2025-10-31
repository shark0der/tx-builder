function StringInput({ value, onChange, id }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        id={id}
        value={value || ""}
        onChange={handleChange}
        placeholder="Enter string"
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
      />
    </div>
  );
}

export default StringInput;

