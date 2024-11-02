import { PentagonFace, RegularDodecahedronPuzzle } from './regular-dodecahedron-puzzle'

/** The fore creases arbitrarily marked by the 4 colors.
 * TODO:
 * - maybe to make it less likely to mistake these colors with the face colors, you could name this something else instead of colors?
 * - However, then how will you know which one it is on the SVG? (dotted, dashed, double, full maybe?)
 */
export enum Crease {
    Red = 'R',
    Blue = 'B',
    Green = 'G',
    Gray = 'D', // D for dark
}

const NUMBER_OF_COLLATERAL_FACES = 3

/**
 * Class that enables rotating the parts along all 4 creases.
 *
 *
 * Classifying all the faces:
 * ```
 *       A
 *  B         C
 *       D
 *    E     F
 *
 *          G     H
 *             I
 *        J         K
 *             L
 * ```
 * If you look at the SVG of the two flowers that are the unfolded regular dodecahedron.
 * ![test](../assets/state-of-my-actual-toy.svg)
 *
 */
export class RotationHelper {
    /**
     * Rules for path:
     * - main path starts at top then left most face. then goes clockwise.
     * - to find which faces are counted towards collateral. Take the first face of main, and rotate the part where the big quarter stays in place.
     * - first collateral face is the one that borders the first main face.
     * - order of collateral faces is counter clockwise when the stationary half is down.
     *
     * TODO: make rule explaining order of lines. Maybe you should start with top-left most and so on.
     */
    private paths = {
        [Crease.Red]: {
            main: 'A K H G E B',
            quarterThatMoves: 'left',
            collateral: 'L I J',
        },
        [Crease.Blue]: {
            main: 'A C F G J L',
            quarterThatMoves: 'right',
            collateral: 'K H I',
        },
        [Crease.Green]: {
            main: 'B D F H I L',
            quarterThatMoves: 'left',
            collateral: 'A C K',
        },
        [Crease.Gray]: {
            main: 'C K I J E D',
            quarterThatMoves: 'right',
            collateral: 'A L B',
        },
    }
    private puzzleToy: RegularDodecahedronPuzzle

    constructor(puzzleToy: RegularDodecahedronPuzzle, parentNode?: HTMLElement) {
        this.puzzleToy = puzzleToy

        if (!parentNode) {
            return
        }

        for (const crease of [Crease.Red, Crease.Blue, Crease.Green, Crease.Gray]) {
            const btn = document.createElement('button')
            btn.textContent = crease.toString()
            btn.onclick = () => {
                this.rotateAlongCrease(crease, true, { updateUi: true })
                console.log('Num of faces:', puzzleToy.getNumberOfSolvedFaces())
            }
            parentNode.append(btn)
        }
    }

    /**
     * @param rotateClockwise default is true
     * TODO: maybe this isn't the cleanest implementation, to have a `rotateClockwise` bool.
     * This is more of an options argument thing or maybe have 2 separate methods?
     */
    public rotateAlongCrease(crease: Crease, rotateClockwise = true, options?: { updateUi: boolean }) {
        if (!rotateClockwise) {
            // The lazy mans counter clockwise solution. Maybe do this properly later, if performance matters.
            this.rotateAlongCrease(crease, true, options)
            this.rotateAlongCrease(crease, true, options)
            return
        }

        const puzzleToy = this.puzzleToy

        const breakingFaces = this.paths[crease].main
        // Reason why you need deep copy is because while updating the face using updateColorValues, the original objects get modified and it breaks things.
        // TODO: Maybe refactor code to not modify existing but create new.
        const faces = breakingFaces.split(' ').map((faceName) => ({...puzzleToy.getFace(faceName)}))

        faces.forEach((face, index) => {
            const even = index % 2 == 0
            const targetFace = faces[(index + 2) % 6]
            // A bit hard to explain in words. Probably good idea to just write a few tests for this
            let updatedFace: Partial<PentagonFace>
            if (this.paths[crease].quarterThatMoves == 'left') {
                if (even) {
                    updatedFace = { faceId: targetFace.faceId, mediumLeft: face.mediumLeft, small: face.small }
                } else {
                    updatedFace = { faceId: targetFace.faceId, mediumLeft: face.mediumLeft, big: face.big }
                }
            } else {
                if (even) {
                    updatedFace = { faceId: targetFace.faceId, mediumRight: face.mediumRight, small: face.small }
                } else {
                    updatedFace = { faceId: targetFace.faceId, mediumRight: face.mediumRight, big: face.big }
                }
            }

            puzzleToy.updateColorValues(updatedFace, options)
        })

        // Collateral:
        const collateralFaces = this.paths[crease].collateral
        const faces2 = collateralFaces.split(' ').map((faceName) => ({...puzzleToy.getFace(faceName)}))
        faces2.forEach((face, index) => {
            const targetFace = faces2[(index + 1) % NUMBER_OF_COLLATERAL_FACES]
            puzzleToy.updateColorValues({ ...face, faceId: targetFace.faceId }, options)
        })
    }
}
