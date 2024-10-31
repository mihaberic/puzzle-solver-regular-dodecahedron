import { ColorPicker } from './src/color-picker.js'
import { RotationHelper } from './src/rotation-helper.js'
import { RegularDodecahedronPuzzle } from './src/regular-dodecahedron-puzzle.js'
import { SvgPentagonsHelper } from './src/svg-pentagons-helper.js'
import { BruteForceSolver } from './src/brute-force-solver.js'

const svgHelper = new SvgPentagonsHelper()

const puzzleToy = new RegularDodecahedronPuzzle()
svgHelper.populateSvgWithPentagons(puzzleToy)

const elementForMover = document.getElementById('firstMover')!
new RotationHelper(puzzleToy, elementForMover)
new BruteForceSolver(puzzleToy)
ColorPicker.init()
