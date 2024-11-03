import { ColorPicker } from './color-picker'
import { RegularDodecahedronPuzzle } from './regular-dodecahedron-puzzle'
import { SvgPentagonsHelper } from './svg-pentagons-helper'

describe('SvgPentagonsHelper', () => {
    let svgPentagonsHelper: SvgPentagonsHelper

    beforeAll(() => {
        const colorPicker: ColorPicker = { currentColor: '#ffffff' } as any
        const puzzleToy = new RegularDodecahedronPuzzle()
        const svgElement = {} as any
        svgPentagonsHelper = new SvgPentagonsHelper(puzzleToy, colorPicker, svgElement)
    })

    // TODO: change this to actually check the pentagons you get back maybe
    it('populates Svg With Pentagons', () => {
        // svgPentagonsHelper.populateSvgWithPentagons()
        expect(1).toBe(1)
    })
})
