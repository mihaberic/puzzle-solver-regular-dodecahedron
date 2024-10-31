import { RegularDodecahedronPuzzle } from './regular-dodecahedron-puzzle'

/** The fore creases arbitrarily marked by the 4 colors.
 * TODO:
 * - maybe to make it less likely to mistake these colors with the face colors, you could name this something else instead of colors?
 * - However, then how will you know which one it is on the SVG? (dotted, dashed, double, full maybe?)
 */
enum Crease {
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
            quarterThatMoves: 'right',
            main: 'A C F G J L',
            collateral: 'K H I',
        },
        [Crease.Green]: {
            quarterThatMoves: 'left',
            main: 'B D F H I L',
            collateral: 'A C K',
        },
        [Crease.Gray]: {
            quarterThatMoves: 'right',
            main: 'C K I J E D',
            collateral: 'A L B',
        },
    }
    private puzzleToy?: RegularDodecahedronPuzzle

    public init(parentNode: HTMLElement, puzzleToy: RegularDodecahedronPuzzle) {
        this.puzzleToy = puzzleToy

        for (const crease of [Crease.Red, Crease.Blue, Crease.Green, Crease.Gray]) {
            const btn = document.createElement('button')
            btn.textContent = crease.toString()
            btn.onclick = () => {
                this.rotateAlongCrease(crease)
            }
            parentNode.append(btn)
        }
    }

    private rotateAlongCrease(crease: Crease, rotateClockwise = true) {
        const puzzleToy = this.puzzleToy
        if (!puzzleToy) {
            throw new Error()
        }

        const breakingFaces = this.paths[crease].main
        const faces = breakingFaces.split(' ').map((faceName) => Object.assign({}, puzzleToy.getFace(faceName)))

        faces.forEach((face, index) => {
            const even = index % 2 == 0
            const targetFace = faces[(index + 2) % 6]
            // A bit hard to explain in words. Probably good idea to just write a few tests for this
            if (this.paths[crease].quarterThatMoves == 'left') {
                if (even) {
                    puzzleToy.updateColorValues({ ...targetFace, mediumLeft: face.mediumLeft, small: face.small })
                } else {
                    puzzleToy.updateColorValues({ ...targetFace, mediumLeft: face.mediumLeft, big: face.big })
                }
            } else {
                if (even) {
                    puzzleToy.updateColorValues({ ...targetFace, mediumRight: face.mediumRight, small: face.small })
                } else {
                    puzzleToy.updateColorValues({ ...targetFace, mediumRight: face.mediumRight, big: face.big })
                }
            }
        })

        // Collateral:
        const collateralFaces = this.paths[crease].collateral
        const faces2 = collateralFaces.split(' ').map((faceName) => Object.assign({}, puzzleToy.getFace(faceName)))
        faces2.forEach((face, index) => {
            const targetFace = faces2[(index + 1) % NUMBER_OF_COLLATERAL_FACES]
            puzzleToy.updateColorValues({ ...face, faceId: targetFace.faceId })
        })
    }
}
