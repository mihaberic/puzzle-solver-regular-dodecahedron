import { RegularDodecahedronPuzzle } from "./regular-dodecahedron-puzzle";

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

/**
 * Class that enables moving the parts along all 4 creases.
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
export class FirstMover {
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
            collateral: 'L I J',
        }, // ILJ
        [Crease.Blue]: {
            main: 'A C F G J L',
            collateral: 'K H I',
        },
        [Crease.Green]: {
            main: 'B D F H I L',
            collateral: 'A C K',
        },
        [Crease.Gray]: {
            main: 'C K I J E D',
            collateral: 'A L B',
        },
    }

    public init(parentNode: HTMLElement, toy: RegularDodecahedronPuzzle) {

        for (const crease of [Crease.Red, Crease.Blue, Crease.Green, Crease.Gray]) {
            const btn = document.createElement('button')
            btn.textContent = crease.toString()
            btn.onclick = () => {
                this.moveAlongCrease(crease)
            }
            parentNode.append(btn)
        }
    }

    private moveAlongCrease(crease: Crease, moveClockwise = true) {
        console.log(this.paths[crease])
        throw new Error('moveAlongCrease not yet implemented')
    }
}
