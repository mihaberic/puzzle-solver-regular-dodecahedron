/**
 * It yields a list of given length. Starting with all 0s. Then for each consecutive generated list
 * it increases the last number by one, until it gets to the numberOfOptions,
 * in which case it sets the last item back to 0 and increases the second number. And so on.
 *
 * **End state:** the last returned list is filled with all (numberOfOptions-1) numbers.
 *
 * @param length number of integers in returned lists
 * @param numberOfOptions the list will count upto this number, not including this number
 * Example: if numberOfOptions is 3, then available ints will be 0, 1, 2
 */
export function* generateExhaustiveNumberPatterns(length: number, numberOfOptions: number): Generator<number[]> {
    if (numberOfOptions < 2 || numberOfOptions > 36) {
        // this is because of current implementation that uses the .toString
        throw new Error('numberOfOptions must be between 2 and 36')
    }

    const numberOfAllOptions = numberOfOptions ** length

    for (let i = 0; i < numberOfAllOptions; i++) {
        // This right here. This is what I call art (more art than science):
        yield i
            .toString(numberOfOptions)
            .padStart(length, '0')
            .split('')
            .map((item) => parseInt(item, numberOfOptions))
    }
}

export function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

/** Simply calls "JSON.parse(JSON.stringify(item))".
 * - This avoids needing to import Lodash */
export function deepClone<T>(item: T): T {
    return JSON.parse(JSON.stringify(item))
}
