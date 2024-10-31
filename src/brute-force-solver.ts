import { RegularDodecahedronPuzzle } from './regular-dodecahedron-puzzle'
import { Crease, RotationHelper } from './rotation-helper.js'

export class BruteForceSolver {
    private puzzleToy: RegularDodecahedronPuzzle

    constructor(puzzleToy: RegularDodecahedronPuzzle) {
        this.puzzleToy = puzzleToy

        ;(window as any).bruteForceSolver = this // TODO: remove. Used only for debugging
    }

    /**
     * TODO: to improve performance:
     *  - Turn off SVG callbacks for the duration of brute forcing and only draw the result at the end.
     */
    public attemptToSolve(targetNumberOfSolvedItems: number, depthOfSearch: number) {
        // for (let i = 0; i < 1000000; i++) {
        //     const crease = 'RBGD'[Math.floor(Math.random() * 4)] as any
        //     rotationHelper.rotateAlongCrease(crease, Math.random() < 0.5)
        //     if (this.puzzleToy.getNumberOfSolvedFaces() >= targetNumberOfSolvedItems) {
        //         console.log('getNumberOfSolvedFaces', this.puzzleToy.getNumberOfSolvedFaces())
        //         console.log('i:', i)
        //         break
        //     }
        //     // await new Promise((r) => setTimeout(r))
        // }

        const rotationHelper = new RotationHelper(this.puzzleToy)

        let maxSolvedFaces = -1
        let bestPattern = null
        for (const pattern of this.movementPatternGenerator(depthOfSearch)) {
            this.puzzleToy.resetStateToPredefinedState()

            pattern.forEach((rotation) => {
                rotationHelper.rotateAlongCrease(rotation.crease, rotation.clockwiseTurn)
            })

            const numberOfSolvedFaces = this.puzzleToy.getNumberOfSolvedFaces()
            if (numberOfSolvedFaces > maxSolvedFaces) {
                maxSolvedFaces = numberOfSolvedFaces
                bestPattern = pattern
            }

            if (numberOfSolvedFaces >= targetNumberOfSolvedItems) {
                console.log('------ getNumberOfSolvedFaces', this.puzzleToy.getNumberOfSolvedFaces())
                console.log(pattern)
                break
            }
        }

        console.log('Max number of solved faces', maxSolvedFaces)
        console.log('BestPattern', bestPattern)

        this.puzzleToy.resetStateToPredefinedState()
        bestPattern?.forEach((rotation) => {
            rotationHelper.rotateAlongCrease(rotation.crease, rotation.clockwiseTurn)
        })
    }

    /**
     * Yields possible movement patterns based on
     * Q: Why use a generator and not a function that returns a list?
     * A: There can be millions of possible pattern and so the list could get too large.
     */
    private *movementPatternGenerator(depth: number): Generator<{ crease: Crease; clockwiseTurn: boolean }[]> {
        const options = [
            { crease: Crease.Red, clockwiseTurn: true },
            { crease: Crease.Green, clockwiseTurn: true },
            { crease: Crease.Blue, clockwiseTurn: true },
            { crease: Crease.Gray, clockwiseTurn: true },
            { crease: Crease.Red, clockwiseTurn: false },
            { crease: Crease.Green, clockwiseTurn: false },
            { crease: Crease.Blue, clockwiseTurn: false },
            { crease: Crease.Gray, clockwiseTurn: false },
        ]

        for (const patter of this.generatePattern(depth, 8)) {
            yield patter.map((num) => options[num])
        }
    }

    /**
     * TODO: seriously. Write a test for this.
     */
    private *generatePattern(depth: number, numberOfOptions: number): Generator<number[]> {
        if (numberOfOptions < 2 || numberOfOptions > 36) {
            // this is because of current implementation that uses the .toString
            throw new Error('numberOfOptions must be between 2 and 36')
        }

        const numberOfAllOptions = numberOfOptions ** depth
        console.log('Number of options to try:', numberOfAllOptions) // TODO: remove console log

        for (let i = 0; i < numberOfAllOptions; i++) {
            // This right here. This is what I call art (more art than science):
            yield i
                .toString(numberOfOptions)
                .padStart(depth, '0')
                .split('')
                .map((item) => parseInt(item, numberOfOptions))
        }
    }
}