import { ColorPicker } from './src/color-picker.js'
import { FirstMover } from './src/first-mover.js'
import { RegularDodecahedronPuzzle } from './src/regular-dodecahedron-puzzle.js'
import { SvgPentagonsHelper } from './src/svg-pentagons-helper.js'

const svgHelper = new SvgPentagonsHelper()
const firstMover = new FirstMover()

const puzzleToy = new RegularDodecahedronPuzzle()
svgHelper.populateSvgWithPentagons(puzzleToy)

const elementForMover = document.getElementById('firstMover')!
firstMover.init(elementForMover, puzzleToy)
ColorPicker.init()