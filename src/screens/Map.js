import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { times, get } from 'lodash'
import Chance from 'chance'

import * as Selectors from 'state/selectors'
import * as PlayerActions from 'state/player/actions'
import { mapType } from 'state/player/reducers'

const tileSize = 60

/* STYLES */
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background-color: black;
`

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

const TileContainer = styled.div`
  width: ${tileSize}px;
  height: ${tileSize}px;
  border: 1px solid gray;
  box-sizing: border-box;
`

const PlayerContainer = styled.div`
  position: absolute;
  left: ${props => props.x * tileSize}px;
  top: ${props => props.y * tileSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${tileSize}px;
  height: ${tileSize}px;
  transition: 200ms;
`

const Player = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background-color: limegreen;
  border-radius: 50%;
`

const Enemy = Player.extend`
  background-color: orangered;
`

/* TYPES */
const playerCoordsType = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
})

/* PRESENTATION */
class Tile extends React.Component {
  static propTypes = {
    isPlayerHere: PropTypes.bool,
  }

  render() {
    return <TileContainer />
  }
}

class Row extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    playerCoords: playerCoordsType,
  }

  render() {
    const { width, y, playerCoords } = this.props
    return (
      <RowContainer>
        {times(
          width,
          index =>
            index + 1 === get(playerCoords, 'x') ? (
              <Tile key={index + 1} x={index + 1} y={y} isPlayerHere />
            ) : (
              <Tile key={index + 1} x={index + 1} y={y} />
            )
        )}
      </RowContainer>
    )
  }
}

class Map extends React.Component {
  static propTypes = {
    moveUp: PropTypes.func,
    moveDown: PropTypes.func,
    moveLeft: PropTypes.func,
    moveRight: PropTypes.func,
    currentMap: mapType,
    playerX: PropTypes.number,
    playerY: PropTypes.number,
  }

  state = {
    playerX: this.props.playerX,
    playerY: this.props.playerY,
    enemyX: 9,
    enemyY: 9,
    interval: null,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    this.setState({ interval: setInterval(this.chase, 1000) })
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    clearInterval(this.state.interval)
  }

  chase = () => {
    const xDiff = Math.abs(this.props.playerX - this.state.enemyX)
    const yDiff = Math.abs(this.props.playerY - this.state.enemyY)
    const shouldMoveRight = this.props.playerX > this.state.enemyX
    const shouldMoveDown = this.props.playerY > this.state.enemyY
    const horizontalMove = shouldMoveRight
      ? this.state.enemyX + 1
      : this.state.enemyX - 1
    const verticalMove = shouldMoveDown
      ? this.state.enemyY + 1
      : this.state.enemyY - 1
    let newEnemyCoords =
      new Chance().coin() === 'heads'
        ? { enemyX: horizontalMove, enemyY: this.state.enemyY }
        : { enemyX: this.state.enemyX, enemyY: verticalMove }
    if (xDiff !== yDiff) {
      newEnemyCoords =
        xDiff > yDiff
          ? { enemyX: horizontalMove, enemyY: this.state.enemyY }
          : { enemyX: this.state.enemyX, enemyY: verticalMove }
    }
    this.setState({ ...newEnemyCoords })
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
    const { currentMap, playerX, playerY } = this.props
    const { enemyX, enemyY } = this.state
    console.log(playerX, playerY)
    return (
      <Container>
        {times(
          currentMap.height,
          index =>
            index + 1 === playerY ? (
              <Row
                key={index + 1}
                width={currentMap.width}
                y={index + 1}
                playerCoords={{ x: playerX, y: playerY }}
              />
            ) : (
              <Row key={index + 1} width={currentMap.width} y={index + 1} />
            )
        )}
        <PlayerContainer x={playerX} y={playerY}>
          <Player />
        </PlayerContainer>
        <PlayerContainer x={enemyX} y={enemyY}>
          <Enemy />
        </PlayerContainer>
      </Container>
    )
  }
}

const mapState = state => ({
  playerX: Selectors.getPlayerX(state),
  playerY: Selectors.getPlayerY(state),
  currentMap: Selectors.getCurrentMap(state),
})

const mapActions = {
  moveUp: PlayerActions.moveUp,
  moveDown: PlayerActions.moveDown,
  moveLeft: PlayerActions.moveLeft,
  moveRight: PlayerActions.moveRight,
}

export default connect(mapState, mapActions)(Map)
