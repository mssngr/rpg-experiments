import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { times } from 'lodash'

import grass from 'assets/textures/lowRes/grass1.png'
import tree from 'assets/textures/lowRes/tree1.png'

const tileSize = 60

/* STYLES */
const Container = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
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
  flex-shrink: 0;
  flex-grow: 0;
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

/* UTILS */
const scroll = ({ moveUp, moveLeft, moveDown, moveRight }) => e => {
  switch (e.key) {
    case 'w': {
      moveUp()
      break
    }
    case 'a': {
      moveLeft()
      break
    }
    case 's': {
      moveDown()
      break
    }
    default: {
      moveRight()
      break
    }
  }
}

/* PRESENTATION */
export default class Map3 extends React.Component {
  static propTypes = {
    currentMap: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      collisions: PropTypes.array,
    }),
  }

  state = {
    x: 500,
    y: 500,
  }

  componentDidMount() {
    window.addEventListener(
      'keydown',
      scroll({
        moveUp: this.moveUp,
        moveLeft: this.moveLeft,
        moveDown: this.moveDown,
        moveRight: this.moveRight,
      })
    )
  }

  moveUp = () => this.setState(state => ({ x: state.x, y: state.y + 1 }))
  moveLeft = () => this.setState(state => ({ x: state.x + 1, y: state.y }))
  moveDown = () => this.setState(state => ({ x: state.x, y: state.y - 1 }))
  moveRight = () => this.setState(state => ({ x: state.x - 1, y: state.y }))

  render() {
    const { currentMap } = this.props
    console.log('render map')
    return (
      <Container x={this.state.x} y={this.state.y}>
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

class Row extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    collisions: PropTypes.array,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.width !== this.props.width ||
      nextProps.y !== this.props.y ||
      nextProps.collisions !== this.props.collisions
    ) {
      return true
    } else {
      return false
    }
  }

  render() {
    const { width, y, collisions } = this.props
    console.log('row render')
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

class Tile extends React.Component {
  static propTypes = {
    isTreeHere: PropTypes.bool,
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
