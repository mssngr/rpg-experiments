import PropTypes from 'prop-types'
import { combineReducers } from 'redux'
import { find } from 'lodash'

import maps from 'assets/maps'
import { types } from './actions'
import { createChar, charType } from '../characters/reducers'

export const mapType = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  collisions: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
})

export const playerType = PropTypes.shape({
  detail: charType,
  location: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    map: mapType,
  }),
})

const randomPlayer = createChar()

const initialStateDetails = {
  ...randomPlayer[1],
}

const details = (state = initialStateDetails, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const initialStateLocation = {
  map: maps.starting,
  x: 0,
  y: 0,
}

const location = (state = initialStateLocation, action) => {
  switch (action.type) {
    case types.MOVE_UP: {
      const newY = state.y - 1
      const willCollide = !!find(state.map.collisions, { x: state.x, y: newY })
      if (state.y > 0 && !willCollide) {
        return { ...state, y: newY }
      }
      return state
    }

    case types.MOVE_DOWN: {
      const newY = state.y + 1
      const willCollide = !!find(state.map.collisions, { x: state.x, y: newY })
      if (state.y < state.map.height - 1 && !willCollide) {
        return { ...state, y: newY }
      }
      return state
    }

    case types.MOVE_LEFT: {
      const newX = state.x - 1
      const willCollide = !!find(state.map.collisions, { x: newX, y: state.y })
      if (state.x > 0 && !willCollide) {
        return { ...state, x: newX }
      }
      return state
    }

    case types.MOVE_RIGHT: {
      const newX = state.x + 1
      const willCollide = !!find(state.map.collisions, { x: newX, y: state.y })
      if (state.x < state.map.width - 1 && !willCollide) {
        return { ...state, x: newX }
      }
      return state
    }

    default:
      return state
  }
}

export default combineReducers({
  location,
  details,
})
