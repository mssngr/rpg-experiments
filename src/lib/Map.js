import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { times, get, find } from 'lodash'

/* STYLES */
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

const TileContainer = styled.div`
  width: ${props => props.tileSize}px;
  height: ${props => props.tileSize}px;
  box-sizing: border-box;
`

const PlayerContainer = styled.div`
  position: absolute;
  left: ${props => props.x * props.tileSize}px;
  top: ${props => props.y * props.tileSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.tileSize}px;
  height: ${props => props.tileSize}px;
`

const Player = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.tileSize / 2};
  height: ${props => props.tileSize / 2};
  border-radius: 50%;
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
  state = {
    x: 0,
    y: 0,
  }

  static propTypes = {
    map: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      collisions: PropTypes.arrayOf(
        PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
      ),
    })
  }

  static defaultProps = {
    map: {
      width: 1,
      height: 1,
      collisions: [],
    }
  }

  willCollide = (x, y) => !!find(this.props.collisions, { x, y })

  handleKeyPress = e => {
    const { width, height } = this.props
    const { x, y } = this.state
    if (e.key === 'w' && y > 0 && !this.willCollide(x, y - 1)) {
      this.setState({ y: y - 1 })
    }
    if (e.key === 'a' && x > 0 && !this.willCollide(x - 1, y)) {
      this.setState({ x: x - 1 })
    }
    if (e.key === 's' && y < height - 1 && !this.willCollide(x, y + 1)) {
      this.setState({ y: y + 1 })
    }
    if (e.key === 'd' && x < width - 1 && !this.willCollide(x + 1, y)) {
      this.setState({ x: x + 1 })
    }
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress)
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress)
  }

  render() {
    const { width, height, playerX, playerY } = this.props
    const { x, y } = this.state
    return (
      <Container>
        {times(
          height,
          index =>
            index + 1 === y ? (
              <Row
                key={index + 1}
                width={width}
                y={index + 1}
                playerCoords={{ x, y }}
              />
            ) : (
              <Row key={index + 1} width={width} y={index + 1} />
            )
        )}
        <PlayerContainer x={x} y={y}>
          <Player />
        </PlayerContainer>
      </Container>
    )
  }
}

export default Map
