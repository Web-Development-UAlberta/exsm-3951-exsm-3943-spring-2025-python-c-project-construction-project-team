// This file is responsible for converting the BigInt type to and from API to prevent the TypeError: "Do not know how to serialize a BigInt"

export const bigIntConverter = {

    // Get the data from the API - converts a string or number to BigInt
    fromAPI: (value: string | number | bigint | null | undefined): bigint | null => {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'bigint') {
            return value;
        }
        return BigInt(value);
    },

    // Send the data to the API - only converts BigInt to string
    toAPI: (value: bigint | string | number | null | undefined): string | null => {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'bigint') return value.toString();
        return String(value);
    },

    // Get the data from the API - converts an array of strings or numbers to an array of BigInts
    arrayFromAPI: (values: (string | number | bigint | null)[] | null | undefined): (bigint | null)[] => {
        if (!values) return [];
        return values.map(value => {
            if (value === null || value === undefined) return null;
            if (typeof value === 'bigint') return value;
            return BigInt(value);
        });
    },

    // Send the data to the API - converts an array of BigInts to an array of strings
    arrayToAPI: (values: (bigint | string | number | null)[] | null | undefined): (string | null)[] => {
        if (!values) return [];
        return values.map(value => {
            if (value === null || value === undefined) return null;
            if (typeof value === 'bigint') return value.toString();
            return String(value);
        });
    }
};