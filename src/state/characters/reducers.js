import PropTypes from 'prop-types'
import Chance from 'chance'
const chance = new Chance()

export const charType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  gender: PropTypes.oneOf(['male', 'female']).isRequired,
  portrait: PropTypes.string.isRequired,
})

export const createChar = (options = {}) => {
  const { name, gender, portrait } = options
  const id = chance.guid()
  const charGender =
    (gender && gender.toLowerCase()) || chance.gender().toLowerCase()
  const charName = name || chance.name({ gender: charGender })
  const charPortrait = require(`assets/portraits/${charGender}/${portrait ||
    chance.natural({ min: 1, max: 12 })}.jpg`)
  return [
    id,
    {
      id,
      name: charName,
      gender: charGender,
      portrait: charPortrait,
    },
  ]
}

const randomChar = createChar()

const initialState = {
  [randomChar[0]]: randomChar[1],
}

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
