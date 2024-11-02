import { generateExhaustiveNumberPatterns } from './utils'

describe('Utils functions', () => {
    describe('generatePattern', () => {
        it('creates generator with correct number of items', () => {
            const generator = generateExhaustiveNumberPatterns(4, 3)

            expect(Array.from(generator).length).toEqual(81)
        })

        it('creates generator that returns correct few items', () => {
            const generator = generateExhaustiveNumberPatterns(5, 10)

            const firstItem = generator.next().value
            const secondItem = generator.next().value
            const thirdItem = generator.next().value

            expect(firstItem).toEqual([0, 0, 0, 0, 0])
            expect(secondItem).toEqual([0, 0, 0, 0, 1])
            expect(thirdItem).toEqual([0, 0, 0, 0, 2])
        })
    })
})
