import { RegularDodecahedronPuzzle } from './src/regular-dodecahedron-puzzle'
import { ColorPicker } from './src/color-picker'
import { RotationHelper } from './src/rotation-helper'
import { SvgPentagonsHelper } from './src/svg-pentagons-helper'
import { BruteForceSolver } from './src/brute-force-solver'

const puzzleToy = new RegularDodecahedronPuzzle()

const colorPicker = new ColorPicker(document.getElementById('colorPicker')!)
const svgHelper = new SvgPentagonsHelper(puzzleToy, colorPicker, document.querySelector('svg')!)
svgHelper.populateSvgWithPentagons()

const elementForMover = document.getElementById('rotationHelper')!
new RotationHelper(puzzleToy, elementForMover)

new BruteForceSolver(puzzleToy, new RotationHelper(puzzleToy))
