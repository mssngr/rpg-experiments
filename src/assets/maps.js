import Chance from 'chance'
import { flatMap } from 'lodash'

const generateMap = ({ width, height }) => {
  const widthArray = new Array(width)
  const heightArray = new Array(height)
  const tileArray = flatMap(widthArray, (x, xIndex) =>
    flatMap(heightArray, (y, yIndex) => [{ x: xIndex, y: yIndex }])
  )
  return {
    width,
    height,
    collisions: new Chance().pickset(tileArray, 500),
  }
}

export default {
  starting: generateMap({ width: 100, height: 100 }),
}
