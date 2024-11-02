import { RegularDodecahedronPuzzle } from './regular-dodecahedron-puzzle'
import { Crease, RotationHelper } from './rotation-helper.js'
import { generateExhaustiveNumberPatterns } from './utils.js';

const ROTATION_OPTIONS = [
    { crease: Crease.Red, clockwiseTurn: true },
    { crease: Crease.Green, clockwiseTurn: true },
    { crease: Crease.Blue, clockwiseTurn: true },
    { crease: Crease.Gray, clockwiseTurn: true },
    { crease: Crease.Red, clockwiseTurn: false },
    { crease: Crease.Green, clockwiseTurn: false },
    { crease: Crease.Blue, clockwiseTurn: false },
    { crease: Crease.Gray, clockwiseTurn: false },
]

export class BruteForceSolver {
    private puzzleToy: RegularDodecahedronPuzzle

    constructor(puzzleToy: RegularDodecahedronPuzzle) {
        this.puzzleToy = puzzleToy
        ;(window as any).bruteForceSolver = this // TODO: remove. Used only for debugging
    }

    public attemptToSolve(targetNumberOfSolvedItems: number, depthOfSearch: number, random = false) {
        const rotationHelper = new RotationHelper(this.puzzleToy)
        const startTime = Date.now()

        let maxSolvedFaces = -1
        let bestPattern = null
        let counter = 0
        const patternGenerator = random
            ? this.movementPatternGeneratorRandom(depthOfSearch)
            : this.movementPatternGenerator(depthOfSearch)

        // I don't usually use labeled loops, but when I do.
        patternsLoop: for (const pattern of patternGenerator) {
            counter++
            this.puzzleToy.resetStateToPredefinedState()

            let i = 1
            for (const rotation of pattern) {
                rotationHelper.rotateAlongCrease(rotation.crease, rotation.clockwiseTurn)

                const numberOfSolvedFaces = this.puzzleToy.getNumberOfSolvedFaces()
                if (numberOfSolvedFaces > maxSolvedFaces) {
                    maxSolvedFaces = numberOfSolvedFaces
                    bestPattern = pattern.slice(0, i)
                }

                if (numberOfSolvedFaces >= targetNumberOfSolvedItems) {
                    console.log('------ getNumberOfSolvedFaces', this.puzzleToy.getNumberOfSolvedFaces())
                    console.log(pattern)
                    break patternsLoop
                }

                i++
            }
        }

        console.log('Number of attempts:', counter, '/', 8 ** depthOfSearch) // TODO: remove console log
        console.log('Max number of solved faces:', maxSolvedFaces)
        console.log('BestPattern:', bestPattern)
        console.log('Time spent:', ((Date.now() - startTime) / 1000).toFixed(3), 's')

        this.puzzleToy.resetStateToPredefinedState()
        bestPattern?.forEach((rotation) => {
            rotationHelper.rotateAlongCrease(rotation.crease, rotation.clockwiseTurn, { updateUi: true })
        })

        console.log(this.puzzleToy.getFullState())
    }

    /**
     * Yields possible movement patterns based on
     * Q: Why use a generator and not a function that returns a list?
     * A: There can be millions of possible pattern and so the list could get too large.
     */
    private *movementPatternGenerator(depth: number): Generator<{ crease: Crease; clockwiseTurn: boolean }[]> {
        for (const patter of generateExhaustiveNumberPatterns(depth, 8)) {
            yield patter.map((num) => ROTATION_OPTIONS[num])
        }
    }

    private *movementPatternGeneratorRandom(depth: number): Generator<{ crease: Crease; clockwiseTurn: boolean }[]> {
        for (let i = 0; i < 1000_000; i++) {
            yield Array.from({ length: depth }).map(() => ROTATION_OPTIONS[Math.floor(Math.random() * 8)])
        }
    }
}
