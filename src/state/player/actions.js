import keymirror from 'keymirror'

export const types = keymirror({
  MOVE_UP: null,
  MOVE_DOWN: null,
  MOVE_LEFT: null,
  MOVE_RIGHT: null,
})

export const moveUp = () => ({
  type: types.MOVE_UP,
})

export const moveDown = () => ({
  type: types.MOVE_DOWN,
})

export const moveLeft = () => ({
  type: types.MOVE_LEFT,
})

export const moveRight = () => ({
  type: types.MOVE_RIGHT,
})
