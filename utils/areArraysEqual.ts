const areArraysEqual = (arr1: string[] | null, arr2: string[]| null): boolean => {
    if(!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
};

export default areArraysEqual