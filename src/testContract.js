// Test contract for array functionality
export const TEST_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000000001";

export const TEST_CONTRACT_ABI = [
  {
    type: "function",
    name: "testDynamicUintArray",
    inputs: [
      {
        name: "numbers",
        type: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testNesting",
    inputs: [
      {
        name: "nestedArray",
        type: "uint256[][2]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testFixedUintArray",
    inputs: [
      {
        name: "numbers",
        type: "uint256[5]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testDynamicAddressArray",
    inputs: [
      {
        name: "addresses",
        type: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testFixedAddressArray",
    inputs: [
      {
        name: "addresses",
        type: "address[3]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testDynamicStringArray",
    inputs: [
      {
        name: "strings",
        type: "string[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testFixedBoolArray",
    inputs: [
      {
        name: "flags",
        type: "bool[4]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testNestedDynamicArray",
    inputs: [
      {
        name: "matrix",
        type: "uint256[][]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testNestedFixedArray",
    inputs: [
      {
        name: "matrix",
        type: "uint256[3][2]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testNestedMixedArray",
    inputs: [
      {
        name: "data",
        type: "address[][3]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testTripleNestedArray",
    inputs: [
      {
        name: "cube",
        type: "uint256[2][3][4]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testBytesArray",
    inputs: [
      {
        name: "data",
        type: "bytes32[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testMixedParams",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "addresses",
        type: "address[]",
      },
      {
        name: "enabled",
        type: "bool",
      },
      {
        name: "amounts",
        type: "uint256[3]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testPayableWithArray",
    inputs: [
      {
        name: "recipients",
        type: "address[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "testSimpleTuple",
    inputs: [
      {
        name: "person",
        type: "tuple",
        components: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "age",
            type: "uint256",
          },
          {
            name: "wallet",
            type: "address",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testTupleArray",
    inputs: [
      {
        name: "people",
        type: "tuple[]",
        components: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "age",
            type: "uint256",
          },
          {
            name: "isActive",
            type: "bool",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testNestedTuple",
    inputs: [
      {
        name: "transaction",
        type: "tuple",
        components: [
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "from",
            type: "tuple",
            components: [
              {
                name: "wallet",
                type: "address",
              },
              {
                name: "balance",
                type: "uint256",
              },
            ],
          },
          {
            name: "to",
            type: "tuple",
            components: [
              {
                name: "wallet",
                type: "address",
              },
              {
                name: "balance",
                type: "uint256",
              },
            ],
          },
          {
            name: "amount",
            type: "uint256",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testTupleWithArrays",
    inputs: [
      {
        name: "data",
        type: "tuple",
        components: [
          {
            name: "ids",
            type: "uint256[]",
          },
          {
            name: "addresses",
            type: "address[3]",
          },
          {
            name: "enabled",
            type: "bool",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testFixedTupleArray",
    inputs: [
      {
        name: "records",
        type: "tuple[2]",
        components: [
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "value",
            type: "string",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "testComplexMixed",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "config",
        type: "tuple",
        components: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "params",
            type: "uint256[]",
          },
        ],
      },
      {
        name: "enabled",
        type: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];
