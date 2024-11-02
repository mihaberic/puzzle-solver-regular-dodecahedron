import { RegularDodecahedronPuzzle } from './src/regular-dodecahedron-puzzle.js'
import { ColorPicker } from './src/color-picker.js'
import { RotationHelper } from './src/rotation-helper.js'
import { SvgPentagonsHelper } from './src/svg-pentagons-helper.js'
import { BruteForceSolver } from './src/brute-force-solver.js'

const puzzleToy = new RegularDodecahedronPuzzle()

const colorPicker = new ColorPicker(document.getElementById('colorPicker')!)
const svgHelper = new SvgPentagonsHelper(puzzleToy, colorPicker)
svgHelper.populateSvgWithPentagons()

const elementForMover = document.getElementById('rotationHelper')!
new RotationHelper(puzzleToy, elementForMover)

new BruteForceSolver(puzzleToy, new RotationHelper(puzzleToy))
