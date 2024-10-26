const SIDE_LENGTH = 50
const ORIGIN_X = 150
const ORIGIN_Y = 150

export class SvgPentagonsHelper {
    public populateSvgWithPentagons() {
        this.createPentagon(ORIGIN_X, ORIGIN_Y, 0)
        /** distance between neighboring centers */
        const centerDistance = (SIDE_LENGTH / 2) * tan(54) * 2
        this.createPentagon(ORIGIN_X, ORIGIN_Y - centerDistance, 36) // A
        this.createPentagon(ORIGIN_X + centerDistance * cos(18), ORIGIN_Y - centerDistance * sin(18), 36) // B
        this.createPentagon(ORIGIN_X + centerDistance * cos(54), ORIGIN_Y + centerDistance * sin(54), 36) // C
        this.createPentagon(ORIGIN_X - centerDistance * cos(54), ORIGIN_Y + centerDistance * sin(54), 36) // D
        this.createPentagon(ORIGIN_X - centerDistance * cos(18), ORIGIN_Y - centerDistance * sin(18), 36) // E
        // Second Flower

        this.createPentagon(ORIGIN_X + centerDistance * cos(54), ORIGIN_Y + centerDistance * (sin(54) + 1))
        this.createPentagon(ORIGIN_X + centerDistance * (cos(54) * 3), ORIGIN_Y + centerDistance * (sin(54) + 1))
        this.createPentagon(ORIGIN_X + centerDistance * cos(54) * 2, ORIGIN_Y + centerDistance * (sin(54) * 2 + 1), 36)

        this.createPentagon(
            ORIGIN_X + centerDistance * (cos(54) * 2 - cos(18)),
            ORIGIN_Y + centerDistance * (sin(54) * 2 + 1 + sin(18))
        )
        this.createPentagon(
            ORIGIN_X + centerDistance * (cos(54) * 2 + cos(18)),
            ORIGIN_Y + centerDistance * (sin(54) * 2 + 1 + sin(18))
        )

        this.createPentagon(ORIGIN_X + centerDistance * (cos(54) * 2), ORIGIN_Y + centerDistance * (sin(54) * 2 + 2))
    }

    /** Creates pentagon with 4 parts */
    private createPentagon(centerX: number, centerY: number, rotateDegrees?: number) {
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        polyline.setAttribute('points', this.createPathForPentagon(centerX, centerY))
        polyline.style.transform = 'rotate(' + rotateDegrees + 'deg)'
        polyline.style.transformOrigin = `${centerX}px ${centerY}px`
        polyline.style.fill = '#ff000022'
        polyline.style.stroke = 'black'
        polyline.style.strokeWidth = '1px'

        document.querySelector('svg')?.append(polyline) // TODO: remove this and do the appending outside
        return polyline
    }

    private createPathForPentagon(centerX: number, centerY: number, rotateDegrees: number = 0) {
        const sideLength = SIDE_LENGTH
        const centerOffsetX = sideLength / 2
        const centerOffsetY = tan(54) * centerOffsetX
        return [
            [0, 0], // top-left corner
            [sideLength, 0],
            [sideLength + cos(72) * sideLength, sin(72) * sideLength],
            [sideLength / 2, sin(72) * sideLength + sin(36) * sideLength],
            [-sideLength * cos(72), sin(72) * sideLength],
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
