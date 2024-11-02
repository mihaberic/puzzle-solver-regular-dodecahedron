/** The puzzle comes with 12 different colors. I will put them into an enum.
 * TODO: maybe mark them with single letters "BbEGgRYGVWPp" so it can more easily be exported as fixture for tests. Less space required.
 */
enum Color {
    DarkBlue = '#2a3bab',
    LightBlue = '#00ffdd',
    Emerald = '#64e8b8',

    LightGreen = '#00ff00',
    DarkGreen = '#1c621c',
    Red = '#ff0000',

    Yellow = '#eff30f',
    Gold = '#d8a20e',
    Violet = '#621564',

    White = '#ffffff',
    LightPink = '#ffc0c0',
    DarkPink = '#e97272',
}

/** Contains color information for all 4 parts of one pentagon. */
export interface PentagonFace {
    faceId: FaceName // TODO: fix this. Either use faceId or faceName, but not both.
    big: Color
    mediumLeft: Color
    mediumRight: Color
    small: Color
}

type FaceName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'

/**
 * This holds the state of the toy.
 */
export class RegularDodecahedronPuzzle {
    /** Pentagons are sorted from top to bottom, left to right. */
    private stateOfPentagons: PentagonFace[] = []

    private stateChangeCallbacks: Record<string, (face: PentagonFace) => void> = {}

    constructor() {
        this.stateOfPentagons = currentStateOfMyActualPuzzleToy.map((item) => ({ ...item })) as any
        //this.stateOfPentagons = this.getSolvedState()
        console.log('isStatePossible', this.isStatePossible())
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

        if (faceUpdate.big) face.big = faceUpdate.big
        if (faceUpdate.mediumLeft) face.mediumLeft = faceUpdate.mediumLeft
        if (faceUpdate.mediumRight) face.mediumRight = faceUpdate.mediumRight
        if (faceUpdate.small) face.small = faceUpdate.small

        if (options?.updateUi) {
            this.stateChangeCallbacks[faceUpdate.faceId]?.(face)
        }
    }

    public getFullState() {
        return this.stateOfPentagons
    }

    /**
     * To simplify implementation. Only one registered listener is supported per faceName.
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
        const allColors = Object.entries(Color).map((entry) => entry[1])
        const colors = new Map(
            allColors.map((color) => {
                return [color, { big: false, mediumLeft: false, mediumRight: false, small: false }]
            })
        )

        for (const item of this.stateOfPentagons) {
            if (colors.get(item.big)?.big) {
                return false
            }

            colors.get(item.big)!.big = true

            if (colors.get(item.mediumLeft)?.mediumLeft) {
                return false
            }

            colors.get(item.mediumLeft)!.mediumLeft = true

            if (colors.get(item.mediumRight)?.mediumRight) {
                return false
            }

            colors.get(item.mediumRight)!.mediumRight = true

            if (colors.get(item.small)?.small) {
                return false
            }

            colors.get(item.small)!.small = true
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
        this.stateOfPentagons.forEach((face) => this.stateChangeCallbacks[face.faceId]?.(face))
    }

    public resetStateToPredefinedState() {
        this.stateOfPentagons = currentStateOfMyActualPuzzleToy.map((item) => ({ ...item })) as any
    }

    /** TODO: make sure it actually matches solved state of real toy.
     * I see that the wrong colors border each other in some places.
     *
     * **Correct pattern:**
     * Gold, LightGreen, LightPink, DarkPink, Yellow, DarkBlue, Red, DarkGreen, Purple, Emerald, White, LightBlue
     */
    private getSolvedState() {
        return Object.entries(Color).map((entry, index) => {
            return {
                faceId: 'ABCDEFGHIJKL'[index] as FaceName,
                big: entry[1],
                mediumLeft: entry[1],
                mediumRight: entry[1],
                small: entry[1],
            }
        })
    }

    private isFaceSolved(face: PentagonFace) {
        return face.small == face.big && face.small == face.mediumLeft && face.small == face.mediumRight
    }
}

/**
 * I used my UI to put in the colors and then I copied the array from the console.
 */
const currentStateOfMyActualPuzzleToy = [
    {
        faceId: 'A',
        big: '#00ffdd',
        mediumLeft: '#64e8b8',
        mediumRight: '#00ff00',
        small: '#ffffff',
    },
    {
        faceId: 'B',
        big: '#ff0000',
        mediumLeft: '#eff30f',
        mediumRight: '#1c621c',
        small: '#d8a20e',
    },
    {
        faceId: 'C',
        big: '#64e8b8',
        mediumLeft: '#ffc0c0',
        mediumRight: '#eff30f',
        small: '#621564',
    },
    {
        faceId: 'D',
        big: '#ffffff',
        mediumLeft: '#e97272',
        mediumRight: '#ff0000',
        small: '#e97272',
    },
    {
        faceId: 'E',
        big: '#eff30f',
        mediumLeft: '#1c621c',
        mediumRight: '#2a3bab',
        small: '#1c621c',
    },
    {
        faceId: 'F',
        big: '#2a3bab',
        mediumLeft: '#2a3bab',
        mediumRight: '#d8a20e',
        small: '#eff30f',
    },
    {
        faceId: 'G',
        big: '#d8a20e',
        mediumLeft: '#ffffff',
        mediumRight: '#ffc0c0',
        small: '#ff0000',
    },
    {
        faceId: 'H',
        big: '#00ff00',
        mediumLeft: '#d8a20e',
        mediumRight: '#ffffff',
        small: '#ffc0c0',
    },
    {
        faceId: 'I',
        big: '#e97272',
        mediumLeft: '#00ffdd',
        mediumRight: '#621564',
        small: '#2a3bab',
    },
    {
        faceId: 'J',
        big: '#621564',
        mediumLeft: '#621564',
        mediumRight: '#64e8b8',
        small: '#00ff00',
    },
    {
        faceId: 'K',
        big: '#ffc0c0',
        mediumLeft: '#00ff00',
        mediumRight: '#e97272',
        small: '#00ffdd',
    },
    {
        faceId: 'L',
        big: '#1c621c',
        mediumLeft: '#ff0000',
        mediumRight: '#00ffdd',
        small: '#64e8b8',
    },
]
