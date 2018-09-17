import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { times, find } from 'lodash'

import grass from 'assets/textures/lowRes/grass1.png'
import tree from 'assets/textures/lowRes/tree1.png'
import * as Selectors from 'state/selectors'
import { mapType } from 'state/player/reducers'

const tileSize = 60

/* STYLES */
const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(
    calc(-${tileSize * 0.5}px - ${props => props.x * tileSize}px),
    calc(-${tileSize * 0.5}px - ${props => props.y * tileSize}px)
  );
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background-color: black;
  transition-property: transform;
  transition-duration: 200ms;
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
  border: 1px solid gray;
  box-sizing: border-box;
  background: no-repeat center / cover url(${grass});
`

const Tree = styled.img`
  width: 150%;
  margin-bottom: 10px;
  z-index: 10;
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
    currentMap: mapType,
  }

  state = {
    x: 0,
    y: 0,
  }

  moveUp = () => {
    this.setState(state => {
      const newY = state.y - 1
      const willCollide = !!find(this.props.currentMap.collisions, {
        x: state.x,
        y: newY,
      })
      if (state.y > 0 && !willCollide) {
        return { ...state, y: newY }
      }
      return state
    })
  }

  moveDown = () => {
    this.setState(state => {
      const newY = state.y + 1
      const willCollide = !!find(this.props.currentMap.collisions, {
        x: state.x,
        y: newY,
      })
      if (state.y < this.props.currentMap.height - 1 && !willCollide) {
        return { ...state, y: newY }
      }
      return state
    })
  }

  moveLeft = () => {
    this.setState(state => {
      const newX = state.x - 1
      const willCollide = !!find(this.props.currentMap.collisions, {
        x: newX,
        y: state.y,
      })
      if (state.x > 0 && !willCollide) {
        return { ...state, x: newX }
      }
      return state
    })
  }

  moveRight = () => {
    this.setState(state => {
      const newX = state.x + 1
      const willCollide = !!find(this.props.currentMap.collisions, {
        x: newX,
        y: state.y,
      })
      if (state.x < this.props.currentMap.width - 1 && !willCollide) {
        return { ...state, x: newX }
      }
      return state
    })
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = e => {
    if (e.key === 'w' || e.key === 'ArrowUp') {
      this.moveUp()
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
      this.moveDown()
    }
    if (e.key === 'a' || e.key === 'ArrowLeft') {
      this.moveLeft()
    }
    if (e.key === 'd' || e.key === 'ArrowRight') {
      this.moveRight()
    }
  }

  render() {
    const { currentMap } = this.props
    const { x, y } = this.state
    return (
      <Container x={x} y={y}>
        {times(currentMap.height, index => (
          <Row
            key={index}
            width={currentMap.width}
            collisions={currentMap.collisions}
            y={index}
          />
        ))}
      </Container>
    )
  }
}

const mapState = state => ({
  currentMap: Selectors.getCurrentMap(state),
})

export default connect(mapState)(Map)
