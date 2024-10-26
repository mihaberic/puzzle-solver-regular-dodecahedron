const SIDE_LENGTH = 50
const ORIGIN_X = 150
const ORIGIN_Y = 150
/**
 * Number of degrees a pentagon needs to be rotated, before it can be attached to another pentagon.
 */
const ROTATION_STEP = 36

/**
 *
 * Before trying to understand the code in this class, read this doc string. It explains some of the choices made while writing this code.
 *
 *
 * Representation of a pentagon and its sides
 * - so reader can understand what edge A means or what side AB means.
 * ```markdown
 *         A               B
 *          --------------
 *         /              \
 *        /                \
 *       /                  \
 *      /                    \
 *   E  \                    / C
 *         \              /
 *            \        /
 *               \  /
 *                D
 * ```
 *
 * Rules for defining points:
 * - when defining the points of a polygon, I always start with the top most point. If there are more than 1 at the top, then I start with the left most one.
 * - the following points are specified clock wise.
 */
export class SvgPentagonsHelper {
    public populateSvgWithPentagons() {
        this.createPentagon(ORIGIN_X, ORIGIN_Y, 0)
        
        /** distance between neighboring centers */
        const centerDistance = (SIDE_LENGTH / 2) * tan(54) * 2
        this.createPentagon(ORIGIN_X, ORIGIN_Y - centerDistance, ROTATION_STEP * 5) // A
        this.createPentagon(ORIGIN_X + centerDistance * cos(18), ORIGIN_Y - centerDistance * sin(18), ROTATION_STEP * 3) // B
        this.createPentagon(ORIGIN_X + centerDistance * cos(54), ORIGIN_Y + centerDistance * sin(54), ROTATION_STEP * 7) // C
        this.createPentagon(ORIGIN_X - centerDistance * cos(54), ORIGIN_Y + centerDistance * sin(54), ROTATION_STEP * 3) // D
        this.createPentagon(ORIGIN_X - centerDistance * cos(18), ORIGIN_Y - centerDistance * sin(18), ROTATION_STEP * 7) // E

        // Second Flower
        this.createPentagon(
            ORIGIN_X + centerDistance * cos(54),
            ORIGIN_Y + centerDistance * (sin(54) + 1),
            ROTATION_STEP * 4
        )
        this.createPentagon(
            ORIGIN_X + centerDistance * (cos(54) * 3),
            ORIGIN_Y + centerDistance * (sin(54) + 1),
            ROTATION_STEP * 2
        )
        this.createPentagon(
            ORIGIN_X + centerDistance * cos(54) * 2,
            ORIGIN_Y + centerDistance * (sin(54) * 2 + 1),
            ROTATION_STEP * 9
        )

        this.createPentagon(
            ORIGIN_X + centerDistance * (cos(54) * 2 - cos(18)),
            ORIGIN_Y + centerDistance * (sin(54) * 2 + 1 + sin(18)),
            ROTATION_STEP * 6
        )
        this.createPentagon(
            ORIGIN_X + centerDistance * (cos(54) * 2 + cos(18)),
            ORIGIN_Y + centerDistance * (sin(54) * 2 + 1 + sin(18)),
            ROTATION_STEP * 6
        )

        this.createPentagon(
            ORIGIN_X + centerDistance * (cos(54) * 2),
            ORIGIN_Y + centerDistance * (sin(54) * 2 + 2),
            ROTATION_STEP * 2
        )
    }

    /** Creates pentagon with 4 parts */
    private createPentagon(centerX: number, centerY: number, rotateDegrees: number = 0) {
        if (rotateDegrees > 360) {
            throw new Error('Do not rotate by more than 360')
        }
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        polygon.setAttribute('points', this.createPathForPentagon(centerX, centerY))

        // I could do this in numbers, to not use css rotate, but it would be more work and more code to maintain.
        polygon.style.transform = 'rotate(' + rotateDegrees + 'deg)'
        polygon.style.transformOrigin = `${centerX}px ${centerY}px`
        polygon.style.fill = '#0000ff24'
        polygon.style.stroke = 'black'
        polygon.style.strokeWidth = '1px'

        const svg = document.querySelector('svg')

        if (!svg) {
            throw new Error('No svg element found')
        }

        svg.append(polygon) // TODO: remove this and do the appending outside
        svg.append(this.createBigQuarter(centerX, centerY, rotateDegrees))
        svg.append(this.createSmallQuarter(centerX, centerY, rotateDegrees))
        svg.append(this.createMediumLeftQuarter(centerX, centerY, rotateDegrees))
        svg.append(this.createMediumRightQuarter(centerX, centerY, rotateDegrees))
        return polygon
    }

    private createPathForPentagon(centerX: number, centerY: number) {
        const centerOffsetX = SIDE_LENGTH / 2
        const centerOffsetY = tan(54) * centerOffsetX
        const points = [
            [0, 0], // top-left corner
            [1, 0],
            [cos(72) + 1, sin(72)],
            [1 / 2, sin(72) + sin(36)],
            [-cos(72), sin(72)],
        ]

        return points
            .map(([x, y]) => {
                const xString = (x * SIDE_LENGTH + centerX - centerOffsetX).toFixed(2)
                const yString = (y * SIDE_LENGTH + centerY - centerOffsetY).toFixed(2)
                return xString + ',' + yString
            })
            .join(' ')
    }

    /**
     * Creates the big division of the pentagon.
     * - The `centerX` and `centerY` refer to the center of the containing pentagon.
     */
    private createBigQuarter(centerX: number, centerY: number, rotateDegrees?: number) {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        polygon.setAttribute('points', this.createPathForBigQuarter(centerX, centerY))
        polygon.style.transform = 'rotate(' + rotateDegrees + 'deg)'
        polygon.style.transformOrigin = `${centerX}px ${centerY}px`
        polygon.style.fill = '#ff000099'
        polygon.style.stroke = 'black'
        polygon.style.strokeWidth = '1px'

        return polygon
    }

    private createPathForBigQuarter(centerX: number, centerY: number) {
        const centerOffsetX = SIDE_LENGTH / 2
        const centerOffsetY = tan(54) * centerOffsetX
        const points = [
            [0, 0],
            [1, 0],
            [1 + cos(72) / 2, sin(72) / 2],
            [1 / 2, sin(72)],
            [-cos(72) / 2, sin(72) / 2],
        ]

        return points
            .map(([x, y]) => {
                const xString = (x * SIDE_LENGTH + centerX - centerOffsetX).toFixed(2)
                const yString = (y * SIDE_LENGTH + centerY - centerOffsetY).toFixed(2)
                return xString + ',' + yString
            })
            .join(' ')
    }

    /**
     * Creates the small division of the pentagon.
     * - The `centerX` and `centerY` refer to the center of the containing pentagon.
     */
    private createSmallQuarter(centerX: number, centerY: number, rotateDegrees?: number) {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        polygon.setAttribute('points', this.createPathForQuarterSmall(centerX, centerY))
        polygon.style.transform = 'rotate(' + rotateDegrees + 'deg)'
        polygon.style.transformOrigin = `${centerX}px ${centerY}px`
        polygon.style.fill = '#00ff0099'
        polygon.style.stroke = 'black'
        polygon.style.strokeWidth = '1px'

        return polygon
    }

    private createPathForQuarterSmall(centerX: number, centerY: number) {
        const centerOffsetX = SIDE_LENGTH / 2
        const centerOffsetY = tan(54) * centerOffsetX
        const points = [
            [1 / 2, 1 * sin(72)],
            [(cos(72) + 3 / 2) / 2, sin(72) + sin(36) / 2],
            [1 / 2, sin(72) + sin(36)],
            [(-cos(72) + 1 / 2) / 2, (2 * sin(72) + sin(36)) / 2],
        ]

        return points
            .map(([x, y]) => {
                const xString = (x * SIDE_LENGTH + centerX - centerOffsetX).toFixed(2)
                const yString = (y * SIDE_LENGTH + centerY - centerOffsetY).toFixed(2)
                return xString + ',' + yString
            })
            .join(' ')
    }

    /**
     * Creates the small division of the pentagon.
     * - The `centerX` and `centerY` refer to the center of the containing pentagon.
     */
    private createMediumLeftQuarter(centerX: number, centerY: number, rotateDegrees?: number) {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        polygon.setAttribute('points', this.createPathForQuarterMediumLeft(centerX, centerY))
        polygon.style.transform = 'rotate(' + rotateDegrees + 'deg)'
        polygon.style.transformOrigin = `${centerX}px ${centerY}px`
        polygon.style.fill = '#1100ff99'
        polygon.style.stroke = 'black'
        polygon.style.strokeWidth = '1px'

        return polygon
    }

    private createPathForQuarterMediumLeft(centerX: number, centerY: number) {
        const centerOffsetX = SIDE_LENGTH / 2
        const centerOffsetY = tan(54) * centerOffsetX
        const points = [
            [-cos(72) / 2, sin(72) / 2],
            [1 / 2, sin(72)],
            [(-cos(72) + 1 / 2) / 2, (2 * sin(72) + sin(36)) / 2],
            [-1 * cos(72), sin(72)],
        ]

        return points
            .map(([x, y]) => {
                const xString = (x * SIDE_LENGTH + centerX - centerOffsetX).toFixed(2)
                const yString = (y * SIDE_LENGTH + centerY - centerOffsetY).toFixed(2)
                return xString + ',' + yString
            })
            .join(' ')
    }


    /**
     * Creates the small division of the pentagon.
     * - The `centerX` and `centerY` refer to the center of the containing pentagon.
     */
    private createMediumRightQuarter(centerX: number, centerY: number, rotateDegrees?: number) {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        polygon.setAttribute('points', this.createPathForQuarterMediumRight(centerX, centerY))
        polygon.style.transform = 'rotate(' + rotateDegrees + 'deg)'
        polygon.style.transformOrigin = `${centerX}px ${centerY}px`
        polygon.style.fill = '#ffb10099'
        polygon.style.stroke = 'black'
        polygon.style.strokeWidth = '1px'

        return polygon
    }

    private createPathForQuarterMediumRight(centerX: number, centerY: number) {
        const centerOffsetX = SIDE_LENGTH / 2
        const centerOffsetY = tan(54) * centerOffsetX
        const points = [
            [1 + cos(72) / 2, sin(72) / 2],
            [cos(72) + 1, sin(72)],
            [(cos(72) + 3 / 2) / 2, sin(72) + sin(36) / 2],
            [1 / 2, sin(72)],
        ]

        return points
            .map(([x, y]) => {
                const xString = (x * SIDE_LENGTH + centerX - centerOffsetX).toFixed(2)
                const yString = (y * SIDE_LENGTH + centerY - centerOffsetY).toFixed(2)
                return xString + ',' + yString
            })
            .join(' ')
    }
}

function cos(degrees: number) {
    return Math.cos((degrees / 180) * Math.PI)
}
function sin(degrees: number) {
    return Math.sin((degrees / 180) * Math.PI)
}
function tan(degrees: number) {
    return Math.tan((degrees / 180) * Math.PI)
}
