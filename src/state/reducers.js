import { combineReducers } from 'redux'
import characters from './characters/reducers'
import player from './player/reducers'

export default combineReducers({
  characters,
  player,
})
