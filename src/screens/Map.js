import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { times } from 'lodash'
import { AutoSizer, Grid } from 'react-virtualized'

import HandleMovement from 'components/HandleMovement'
import grass from 'assets/textures/lowRes/grass1.png'
import tree from 'assets/textures/lowRes/tree1.png'
import * as Selectors from 'state/selectors'
import { mapType } from 'state/player/reducers'

const StyledGrid = styled(Grid)`
  border: 1px solid #e0e0e0;
`

const Cell = styled.span`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: none;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  outline: none;
`

const FocusedCell = Cell.extend`
  background-color: #e0e0e0;
  font-weight: bold;
`

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

  cellRenderer = ({ columnIndex, key, rowIndex, x, y, style }) => {
    const CellComponent =
      columnIndex === x && rowIndex === y ? FocusedCell : Cell

    return (
      <CellComponent role="none" key={key} style={style}>
        {`r:${rowIndex}, c:${columnIndex}`}
      </CellComponent>
    )
  }

  render() {
    const { currentMap } = this.props
    return (
      <HandleMovement currentMap={currentMap}>
        {({ x, y }) => (
          <div>
            <AutoSizer disableHeight>
              {({ width }) => (
                <StyledGrid
                  columnWidth={tileSize}
                  rowHeight={tileSize}
                  columnCount={currentMap.width}
                  rowCount={currentMap.height}
                  width={width}
                  height={window.innerHeight}
                  scrollToColumn={x}
                  scrollToRow={y}
                  cellRenderer={({ columnIndex, key, rowIndex, style }) =>
                    this.cellRenderer({
                      columnIndex,
                      key,
                      rowIndex,
                      x,
                      y,
                      style,
                    })
                  }
                />
              )}
            </AutoSizer>
          </div>
        )}
      </HandleMovement>
    )
  }
}

const mapState = state => ({
  currentMap: Selectors.getCurrentMap(state),
})

export default connect(mapState)(Map)
