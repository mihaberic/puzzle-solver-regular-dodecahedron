import { Crease, RotationHelper } from './rotation-helper'
import { RegularDodecahedronPuzzle } from './regular-dodecahedron-puzzle'

describe('RotationHelper', () => {
    it('rotates along crease marked with blue', () => {
        const state1 = new RegularDodecahedronPuzzle()

        // TODO: take the toy and save one state. Then rotate and save new state.
        // Then move along same crease in the test and see it they match
    })

    it('rotate forwards then backwards and see it you get same result back', () => {
        const state1 = new RegularDodecahedronPuzzle()
        const rotationHelper = new RotationHelper(state1)

        const state1Json = JSON.stringify(state1.getFullState())
        rotationHelper.rotateAlongCrease(Crease.Red)
        const state2Json = JSON.stringify(state1.getFullState())
        rotationHelper.rotateAlongCrease(Crease.Red, false)
        const state3Json = JSON.stringify(state1.getFullState())

        expect(state1Json).not.toEqual(state2Json)
        expect(state1Json).toEqual(state3Json)
    })
})
