import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import rogue from 'assets/rogue.gif'
import * as Selectors from 'state/selectors'
import * as PlayerActions from 'state/player/actions'

const tileSize = 60

/* STYLES */
const PlayerContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${tileSize}px;
  height: ${tileSize}px;
  z-index: 1;
`

const Sprite = styled.div`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: no-repeat center / 200% url(${rogue});
`

/* PRESENTATION */
class Player extends React.Component {
  static propTypes = {
    moveUp: PropTypes.func,
    moveDown: PropTypes.func,
    moveLeft: PropTypes.func,
    moveRight: PropTypes.func,
    playerX: PropTypes.number,
    playerY: PropTypes.number,
  }

  state = {
    playerX: this.props.playerX,
    playerY: this.props.playerY,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = e => {
    const { moveUp, moveDown, moveLeft, moveRight } = this.props
    if (e.key === 'w' || e.key === 'ArrowUp') {
      moveUp()
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
      moveDown()
    }
    if (e.key === 'a' || e.key === 'ArrowLeft') {
      moveLeft()
    }
    if (e.key === 'd' || e.key === 'ArrowRight') {
      moveRight()
    }
  }

  render() {
    return (
      <PlayerContainer>
        <Sprite />
      </PlayerContainer>
    )
  }
}

const mapState = state => ({
  playerX: Selectors.getPlayerX(state),
  playerY: Selectors.getPlayerY(state),
})

const mapActions = {
  moveUp: PlayerActions.moveUp,
  moveDown: PlayerActions.moveDown,
  moveLeft: PlayerActions.moveLeft,
  moveRight: PlayerActions.moveRight,
}

export default connect(mapState, mapActions)(Player)
