import { codeToColorMap, Color, colorToCodeMap } from './colors'

/** Contains color information for all 4 parts of one pentagon. */
export interface PentagonFace {
    faceId: FaceName // TODO: fix this. Either use faceId or faceName, but not both.
    small: Color
    mediumLeft: Color
    mediumRight: Color
    big: Color
}

type FaceName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'

/**
 * This holds the state of the puzzle toy.
 */
export class RegularDodecahedronPuzzle {
    /** Pentagons are sorted from top to bottom, left to right. */
    private stateOfPentagons: PentagonFace[] = []

    private stateChangeCallbacks: Record<string, (face: PentagonFace) => void> = {}

    constructor() {
        this.stateOfPentagons = this.getPredefinedState()
        // this.stateOfPentagons = this.getSolvedState()
    }

    public getFace(faceId: string) {
        return this.stateOfPentagons.find((item) => item.faceId == faceId)!
    }

    /** Update one or more colors. */
    public updateColorValues(faceUpdate: Partial<PentagonFace>, options?: { updateUi: boolean }) {
        if (!faceUpdate.faceId) {
            throw new Error('Id of face is required')
        }

        const face = this.getFace(faceUpdate.faceId)

        if (faceUpdate.small) face.small = faceUpdate.small
        if (faceUpdate.mediumLeft) face.mediumLeft = faceUpdate.mediumLeft
        if (faceUpdate.mediumRight) face.mediumRight = faceUpdate.mediumRight
        if (faceUpdate.big) face.big = faceUpdate.big

        if (options?.updateUi) {
            this.stateChangeCallbacks[faceUpdate.faceId]?.(face)
        }
    }

    public getFullState() {
        return this.stateOfPentagons
    }

    public getFullStateCompressed() {
        return this.stateOfPentagons
            .map((item) => {
                const encodedFace = [
                    colorToCodeMap.get(item.small),
                    colorToCodeMap.get(item.mediumLeft),
                    colorToCodeMap.get(item.mediumRight),
                    colorToCodeMap.get(item.big),
                ]

                if (encodedFace.some((item) => item == null)) {
                    throw new Error('can not export because of face ' + item.faceId)
                }

                return encodedFace.join('')
            })
            .join('-')
    }

    public setFullState(newState: PentagonFace[], options: { updateUi: boolean }) {
        this.stateOfPentagons = newState.map((item) => ({ ...item }))

        if (options.updateUi) {
            this.callAllCallbacksWithCurrentState()
        }
    }

    /**
     * Only one registered listener is supported per faceName. This allows for simpler implementation.
     * - If same faceName is provided again, only the newest callback for it will be used.
     */
    public listenForColorChanges(faceName: string, callback: (face: PentagonFace) => void) {
        this.stateChangeCallbacks[faceName] = callback
    }

    /**
     * Check the number of times each color appears and make sure it is in all 4 places.
     * TODO: make this more useful by making it log out the problematic part.
     */
    public isStatePossible() {
        const allColors = Object.values(Color)
        const colors = new Map(
            allColors.map((color) => {
                return [color, { small: false, mediumLeft: false, mediumRight: false, big: false }]
            })
        )

        for (const item of this.stateOfPentagons) {
            if (colors.get(item.small)?.small) {
                return false
            }

            colors.get(item.small)!.small = true

            if (colors.get(item.mediumLeft)?.mediumLeft) {
                return false
            }

            colors.get(item.mediumLeft)!.mediumLeft = true

            if (colors.get(item.mediumRight)?.mediumRight) {
                return false
            }

            colors.get(item.mediumRight)!.mediumRight = true

            if (colors.get(item.big)?.big) {
                return false
            }

            colors.get(item.big)!.big = true
        }

        return Array.from(colors.values())
            .map((item) => Object.values(item))
            .flat()
            .every((item) => item)
    }

    public getNumberOfSolvedFaces() {
        return this.stateOfPentagons.filter(this.isFaceSolved).length
    }

    public updateDisplayToSolvedState() {
        this.stateOfPentagons = this.getSolvedState()
        this.callAllCallbacksWithCurrentState()
    }

    private getPredefinedState(): PentagonFace[] {
        return currentStateOfMyActualPuzzleToy.split('-').map((item, index) => {
            const small = codeToColorMap.get(item[0])
            const mediumLeft = codeToColorMap.get(item[1])
            const mediumRight = codeToColorMap.get(item[2])
            const big = codeToColorMap.get(item[3])
            if (small == null || mediumLeft == null || mediumRight == null || big == null) {
                throw new Error('')
            }

            return {
                faceId: 'ABCDEFGHIJKL'[index] as FaceName,
                small,
                mediumLeft,
                mediumRight,
                big,
            }
        })
    }

    /** Returns a state that matches the one you get when the real puzzle toy is solved. */
    private getSolvedState(): PentagonFace[] {
        const solvedState = [
            Color.DarkYellow,
            Color.LightGreen,
            Color.LightPink,

            Color.DarkPink,
            Color.LightYellow,
            Color.DarkBlue,

            Color.Red,
            Color.DarkGreen,
            Color.Violet,

            Color.Emerald,
            Color.White,
            Color.LightBlue,
        ]
        return solvedState.map((color, index) => {
            return {
                faceId: 'ABCDEFGHIJKL'[index] as FaceName,
                big: color,
                mediumLeft: color,
                mediumRight: color,
                small: color,
            }
        })
    }

    private isFaceSolved(face: PentagonFace) {
        return face.small == face.big && face.small == face.mediumLeft && face.small == face.mediumRight
    }

    private callAllCallbacksWithCurrentState() {
        this.stateOfPentagons.forEach((face) => this.stateChangeCallbacks[face.faceId]?.(face))
    }
}

/**
 * I used my UI to put in the colors and then I copied the array from the console.
 */
const currentStateOfMyActualPuzzleToy = 'WEgb-YyGR-VpyE-PPRW-GGBy-yBYB-RWpY-pYWg-BbVP-gVEV-bgPp-ERbG'
