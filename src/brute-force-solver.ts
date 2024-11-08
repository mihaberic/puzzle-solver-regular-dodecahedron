import { Color } from './colors'
import { RegularDodecahedronPuzzle } from './regular-dodecahedron-puzzle'
import { Crease, RotationHelper, rotationCodeToArrowHtml } from './rotation-helper'
import { createButton, deepClone, generateExhaustiveNumberPatterns, sleep } from './utils'

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

interface Rotation {
    crease: Crease
    clockwiseTurn: boolean
}

export class BruteForceSolver {
    private bestPattern?: Rotation[]
    constructor(private puzzleToy: RegularDodecahedronPuzzle, private rotationHelper: RotationHelper) {
        ;(window as any).bruteForceSolver = this // TODO: remove. Used only for debugging

        this.createUi()
    }

    public async attemptToSolve(targetNumberOfSolvedItems: number, depthOfSearch: number, random = false) {
        if (!random && depthOfSearch > 7) {
            throw new Error('Exhaustive search (not random) is limited to depth of 7 because of computational expense.')
        }
        const startTime = Date.now()

        let maxSolvedFaces = -1
        let bestPattern: Rotation[] = []
        let stateAtTimeOfBestPattern = deepClone(this.puzzleToy.getFullState())
        const startState = deepClone(this.puzzleToy.getFullState())
        let counter = 0
        const patternGenerator = random
            ? this.movementPatternGeneratorRandom(depthOfSearch)
            : this.movementPatternGenerator(depthOfSearch)

        // I don't usually use labeled loops, but when I do.
        patternsLoop: for (const pattern of patternGenerator) {
            counter++
            this.puzzleToy.setFullState(startState, { updateUi: false })

            let i = 1
            for (const rotation of pattern) {
                this.rotationHelper.rotateAlongCrease(rotation.crease, rotation.clockwiseTurn)

                const numberOfSolvedFaces = this.puzzleToy.getNumberOfSolvedFaces()
                if (numberOfSolvedFaces > maxSolvedFaces) {
                    maxSolvedFaces = numberOfSolvedFaces
                    bestPattern = pattern.slice(0, i)
                    stateAtTimeOfBestPattern = deepClone(this.puzzleToy.getFullState())

                    console.log('New best:', this.puzzleToy.getNumberOfSolvedFaces())
                    this.puzzleToy.setFullState(stateAtTimeOfBestPattern, { updateUi: true })
                    await sleep(0)
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
        console.log('BestPattern:', this.compressPattern(bestPattern))
        console.log('Time spent:', ((Date.now() - startTime) / 1000).toFixed(3), 's')

        this.bestPattern = this.compressPattern(bestPattern)
        this.puzzleToy.setFullState(stateAtTimeOfBestPattern, { updateUi: true })

        console.log(this.puzzleToy.getFullStateCompressed())
    }

    /**
     * Yields possible movement patterns based on
     * Q: Why use a generator and not a function that returns a list?
     * A: There can be millions of possible pattern and so the list could get too large.
     */
    private *movementPatternGenerator(depth: number): Generator<Rotation[]> {
        for (const patter of generateExhaustiveNumberPatterns(depth, 8)) {
            yield patter.map((num) => ROTATION_OPTIONS[num])
        }
    }

    private *movementPatternGeneratorRandom(depth: number): Generator<Rotation[]> {
        for (let i = 0; i < 1000_000; i++) {
            yield Array.from({ length: depth }).map(() => ROTATION_OPTIONS[Math.floor(Math.random() * 8)])
        }
    }

    /**
     * Makes the pattern shorter by following these rules:
     * - removes rotation pairs where the second rotation just undoes the previous rotation.
     * - compresses 2 identical rotations into: one rotation in opposite direction
     */
    private compressPattern(pattern: Rotation[]): Rotation[] {
        const compressedPattern: Rotation[] = []

        for (const rotation of pattern) {
            compressedPattern.push(rotation)

            const r1 = compressedPattern.at(-1)
            const r2 = compressedPattern.at(-2)
            if (!r1 || !r2) {
                continue
            }

            if (r1.clockwiseTurn !== r2.clockwiseTurn && r1.crease === r2.crease) {
                compressedPattern.pop()
                compressedPattern.pop()
            } else if (r1.clockwiseTurn === r2.clockwiseTurn && r1.crease === r2.crease) {
                compressedPattern.pop()
                compressedPattern.pop()
                compressedPattern.push({ crease: r1.crease, clockwiseTurn: !r1.clockwiseTurn })
            }
        }

        return compressedPattern
    }

    private createUi() {
        const element = document.getElementById('bruteForceSolver')! // TODO: change this

        const clearColorsButton = createButton('Clear colors', () => {
            this.puzzleToy.setFullState(
                'ABCDEFGHIJKL'.split('').map((id) => {
                    return {
                        faceId: id as any,
                        small: Color.White,
                        mediumLeft: Color.White,
                        mediumRight: Color.White,
                        big: Color.White,
                    }
                }),
                { updateUi: true }
            )
        })
        element.append(clearColorsButton)

        /// "Try to solve" button:
        // TODO: should be disabled if isStatePossible is false
        const solveButton = createButton('Solve', async () => {
            if (!this.puzzleToy.isStatePossible()) {
                alert('Can not attempt solving. Color mismatch. Some colors seem to be incorrectly placed.')
                return
            }
            solveButton.disabled = true
            await this.attemptToSolve(7, 21, true)
            solveButton.disabled = false
            drawSolution()
        })
        element.append(solveButton)

        const solution = document.createElement('div')
        solution.classList.add('suggested-moves')
        element.append(solution)

        const drawSolution = () => {
            solution.innerHTML = ''

            this.bestPattern?.forEach((rotation) => {
                const code = rotation.crease + '-' + rotation.clockwiseTurn

                solution.innerHTML += `<div class="item">${rotationCodeToArrowHtml.get(code)}</div>`
            })
        }
        drawSolution()
    }
}
