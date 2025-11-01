function TransactionPreview({ jsonData, encodedData }) {
  return (
    <>
      {/* JSON Representation */}
      <div className="mb-4">
        <label
          htmlFor="json-tx-data"
          className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
        >
          JSON Representation
        </label>
        <textarea
          id="json-tx-data"
          value={jsonData}
          readOnly
          rows={8}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-sm"
          placeholder="Fill in all arguments to see JSON data..."
        />
        {jsonData && !jsonData.startsWith("Error") && (
          <p className="text-xs text-gray-500 mt-1">
            Human-readable representation of the transaction
          </p>
        )}
      </div>

      {/* Encoded Transaction Data */}
      <div className="mb-4">
        <label
          htmlFor="encoded-tx-data"
          className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
        >
          Encoded Transaction Data
        </label>
        <textarea
          id="encoded-tx-data"
          value={encodedData}
          readOnly
          rows={6}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-sm"
          placeholder="Fill in all arguments to see encoded data..."
        />
        {encodedData && !encodedData.startsWith("Error") && (
          <p className="text-xs text-gray-500 mt-1">Copy this data to execute the transaction</p>
        )}
      </div>
    </>
  );
}

export default TransactionPreview;
