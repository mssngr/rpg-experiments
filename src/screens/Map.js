import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { times } from 'lodash'
import Chance from 'chance'

import monster from 'assets/monster.gif'
import rogue from 'assets/rogue.gif'
import grass from 'assets/textures/grass1.png'
import tree from 'assets/textures/tree1.png'
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
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: ${tileSize}px;
  height: ${tileSize}px;
  ${'' /* border: 1px solid gray; */};
  box-sizing: border-box;
  background: no-repeat center / cover url(${grass});
`

const Tree = styled.img`
  width: 150%;
  margin-bottom: 10px;
  z-index: 10;
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
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: no-repeat center / 200% url(${rogue});
  z-index: 1;
`

const Enemy = Player.extend`
  top: 50%;
  background: no-repeat center / 200% url(${monster});
`

/* PRESENTATION */
class Tile extends React.Component {
  static propTypes = {
    isTreeHere: PropTypes.boolean,
  }

  render() {
    const { isTreeHere } = this.props
    return (
      <TileContainer src={grass}>
        {isTreeHere && <Tree src={tree} />}
      </TileContainer>
    )
  }
}

class Row extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    collisions: PropTypes.array,
  }

  render() {
    const { width, y, collisions } = this.props
    return (
      <RowContainer>
        {times(width, index => {
          if (
            collisions.find(
              collision => collision.x === index && collision.y === y
            )
          ) {
            return <Tile key={index} x={index} y={y} isTreeHere />
          }
          return <Tile key={index} x={index} y={y} />
        })}
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
    this.setState({ interval: setInterval(this.keepDistance, 500) })
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    clearInterval(this.state.interval)
  }

  getEnemyDistance = () => ({
    x: Math.abs(this.props.playerX - this.state.enemyX),
    y: Math.abs(this.props.playerY - this.state.enemyY),
  })

  moveEnemy = (isHorizontalMove, shouldMoveRight, shouldMoveDown) => {
    const horizontalMove = shouldMoveRight
      ? this.state.enemyX + 1
      : this.state.enemyX - 1
    let verticalMove = shouldMoveDown
      ? this.state.enemyY + 1
      : this.state.enemyY - 1
    if (shouldMoveDown === undefined) {
      verticalMove =
        new Chance().coin() === 'heads'
          ? this.state.enemyY + 1
          : this.state.enemyY - 1
    }
    let newEnemyCoords = isHorizontalMove
      ? { enemyX: horizontalMove, enemyY: this.state.enemyY }
      : { enemyX: this.state.enemyX, enemyY: verticalMove }
    if (isHorizontalMove === undefined) {
      newEnemyCoords =
        new Chance().coin() === 'heads'
          ? { enemyX: horizontalMove, enemyY: this.state.enemyY }
          : { enemyX: this.state.enemyX, enemyY: verticalMove }
    }
    this.setState({ ...newEnemyCoords })
  }

  chase = () => {
    const enemyDistance = this.getEnemyDistance()
    const shouldMoveRight = this.props.playerX > this.state.enemyX
    const shouldMoveDown = this.props.playerY > this.state.enemyY
    let isHorizontalMove
    if (enemyDistance.x !== enemyDistance.y) {
      isHorizontalMove = enemyDistance.x > enemyDistance.y
    }
    this.moveEnemy(isHorizontalMove, shouldMoveRight, shouldMoveDown)
  }

  runAway = () => {
    const enemyDistance = this.getEnemyDistance()
    const shouldMoveRight = this.props.playerX < this.state.enemyX
    const shouldMoveDown = this.props.playerY < this.state.enemyY
    let isHorizontalMove
    if (enemyDistance.x !== enemyDistance.y) {
      isHorizontalMove = enemyDistance.x < enemyDistance.y
    }
    this.moveEnemy(isHorizontalMove, shouldMoveRight, shouldMoveDown)
  }

  keepDistance = () => {
    const enemyDistance = this.getEnemyDistance()
    const distanceToKeep = 2
    if (enemyDistance.x > distanceToKeep || enemyDistance.y > distanceToKeep) {
      this.chase()
    } else if (
      enemyDistance.x < distanceToKeep &&
      enemyDistance.y < distanceToKeep
    ) {
      this.runAway()
    }
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
        {times(currentMap.height, index => (
          <Row
            key={index}
            width={currentMap.width}
            collisions={currentMap.collisions}
            y={index}
          />
        ))}
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
