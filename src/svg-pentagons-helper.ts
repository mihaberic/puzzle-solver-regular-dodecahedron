const SIDE_LENGTH = 50
const ORIGIN_X = 150
const ORIGIN_Y = 150
/**
 * Number of degrees a pentagon needs to be rotated, before it can be attached to another pentagon.
 */
const ROTATION_STEP = 36

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
        polygon.style.transform = 'rotate(' + rotateDegrees + 'deg)'
        polygon.style.transformOrigin = `${centerX}px ${centerY}px`
        polygon.style.fill = '#0000ff99'
        polygon.style.stroke = 'black'
        polygon.style.strokeWidth = '1px'

        document.querySelector('svg')?.append(polygon) // TODO: remove this and do the appending outside
        document.querySelector('svg')?.append(this.createBigQuarter(centerX, centerY, rotateDegrees))
        return polygon
    }

    private createPathForPentagon(centerX: number, centerY: number, rotateDegrees: number = 0) {
        const sideLength = SIDE_LENGTH
        const centerOffsetX = sideLength / 2
        const centerOffsetY = tan(54) * centerOffsetX
        return [
            [0, 0], // top-left corner
            [sideLength, 0],
            [sideLength * (cos(72) + 1), sideLength * sin(72)],
            [sideLength / 2, sideLength * (sin(72) + sin(36))],
            [-sideLength * cos(72), sideLength * sin(72)],
        ]
            .map(([x, y]) => {
                const xString = (x + centerX - centerOffsetX).toFixed(2)
                const yString = (y + centerY - centerOffsetY).toFixed(2)
                return xString + ',' + yString
            })
            .join(' ')
    }

    private createBigQuarter(centerX: number, centerY: number, rotateDegrees?: number) {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        polygon.setAttribute('points', this.createPathForQuarter(centerX, centerY))
        polygon.style.transform = 'rotate(' + rotateDegrees + 'deg)'
        polygon.style.transformOrigin = `${centerX}px ${centerY}px`
        polygon.style.fill = '#ff000099'
        polygon.style.stroke = 'black'
        polygon.style.strokeWidth = '1px'

        return polygon
    }

    private createPathForQuarter(centerX: number, centerY: number, rotateDegrees: number = 0) {
        const sideLength = SIDE_LENGTH
        const centerOffsetX = sideLength / 2
        const centerOffsetY = tan(54) * centerOffsetX
        return [
            [0, 0], // top-left corner
            [sideLength, 0],
            [sideLength * (1 + cos(72) / 2), (sideLength * sin(72)) / 2],
            [sideLength / 2, sideLength * sin(72)], // TODO: figure out if this is correct
            [(-sideLength * cos(72)) / 2, (sin(72) * sideLength) / 2],
        ]
            .map(([x, y]) => {
                const xString = (x + centerX - centerOffsetX).toFixed(2)
                const yString = (y + centerY - centerOffsetY).toFixed(2)
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
