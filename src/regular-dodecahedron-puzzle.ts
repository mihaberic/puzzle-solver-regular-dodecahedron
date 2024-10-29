/** The puzzle comes with 12 different colors. I will put them into an enum. */
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
    Pink = '#ffc0c0',
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
 * It will (TODO) also allow specifying movements along axis.
 */
export class RegularDodecahedronPuzzle {
    /** Pentagons are sorted from top to bottom, left to right. */
    private stateOfPentagons: PentagonFace[] = []

    constructor() {
        Object.entries(Color).forEach((entry, index) => {
            this.stateOfPentagons.push({
                faceId: 'ABCDEFGHIJKL'[index] as FaceName,
                big: entry[1],
                mediumLeft: entry[1],
                mediumRight: entry[1],
                small: entry[1],
            })
        })
        this.stateOfPentagons = currentStateOfMyActualPuzzleToy as any

        console.log('isStatePossible', this.isStatePossible())
    }

    /**
     * TODO:
     * - instead of index, support more human understandable concept as well.
     * - Use the newly defined A B C ... face naming
     */
    public getFace(faceId: string) {
        return this.stateOfPentagons.find(item => item.faceId == faceId)!
    }

    /** Update one or more colors. */
    public updateColorValues(options: Partial<PentagonFace>) {
        if (!options.faceId) {
            throw new Error('Id of face is required')
        }

        const face = this.stateOfPentagons.find(item => item.faceId == options.faceId)!
        Object.assign(face, options)
    }

    public getFullState() {
        return this.stateOfPentagons
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
}

/**
 * I used my UI to put in the colors and then I copied the array from the console.
 */
const currentStateOfMyActualPuzzleToy = [
    {
        faceId: 'A',
        big: '#00ffdd',
        mediumLeft: '#00ff00',
        mediumRight: '#64e8b8',
        small: '#ffffff',
    },
    {
        faceId: 'B',
        big: '#ff0000',
        mediumLeft: '#1c621c',
        mediumRight: '#eff30f',
        small: '#d8a20e',
    },
    {
        faceId: 'C',
        big: '#64e8b8',
        mediumLeft: '#eff30f',
        mediumRight: '#ffc0c0',
        small: '#621564',
    },
    {
        faceId: 'D',
        big: '#ffffff',
        mediumLeft: '#ff0000',
        mediumRight: '#e97272',
        small: '#e97272',
    },
    {
        faceId: 'E',
        big: '#eff30f',
        mediumLeft: '#2a3bab',
        mediumRight: '#1c621c',
        small: '#1c621c',
    },
    {
        faceId: 'F',
        big: '#2a3bab',
        mediumLeft: '#d8a20e',
        mediumRight: '#2a3bab',
        small: '#eff30f',
    },
    {
        faceId: 'G',
        big: '#d8a20e',
        mediumLeft: '#ffc0c0',
        mediumRight: '#ffffff',
        small: '#ff0000',
    },
    {
        faceId: 'H',
        big: '#00ff00',
        mediumLeft: '#ffffff',
        mediumRight: '#d8a20e',
        small: '#ffc0c0',
    },
    {
        faceId: 'I',
        big: '#e97272',
        mediumLeft: '#621564',
        mediumRight: '#00ffdd',
        small: '#2a3bab',
    },
    {
        faceId: 'J',
        big: '#621564',
        mediumLeft: '#64e8b8',
        mediumRight: '#621564',
        small: '#00ff00',
    },
    {
        faceId: 'K',
        big: '#ffc0c0',
        mediumLeft: '#e97272',
        mediumRight: '#00ff00',
        small: '#00ffdd',
    },
    {
        faceId: 'L',
        big: '#1c621c',
        mediumLeft: '#00ffdd',
        mediumRight: '#ff0000',
        small: '#64e8b8',
    },
]
