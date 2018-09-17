import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { AutoSizer, Grid } from 'react-virtualized'

import HandleMovement from 'components/HandleMovement'
import Player from 'components/Player'

import grass from 'assets/textures/lowRes/grass1.png'
import tree from 'assets/textures/lowRes/tree1.png'
import * as Selectors from 'state/selectors'
import { mapType } from 'state/player/reducers'

const StyledGrid = styled(Grid)`
  ${'' /* border: 1px solid #e0e0e0; */};
`

const tileSize = 60

/* STYLES */
const TileContainer = styled.span`
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

/* PRESENTATION */
class Tile extends React.Component {
  static propTypes = {
    isTreeHere: PropTypes.boolean,
    children: PropTypes.node,
  }

  render() {
    const { isTreeHere, children, ...otherProps } = this.props
    return (
      <TileContainer src={grass} {...otherProps}>
        {children}
        {isTreeHere && <Tree src={tree} />}
      </TileContainer>
    )
  }
}

class Map extends React.Component {
  static propTypes = {
    currentMap: mapType,
  }

  cellRenderer = ({ columnIndex, key, rowIndex, x, y, collisions, style }) => {
    return (
      <Tile
        role="none"
        key={key}
        style={style}
        isTreeHere={collisions.find(
          collision => collision.x === columnIndex && collision.y === rowIndex
        )}
      >
        {columnIndex === x && rowIndex === y && <Player />}
      </Tile>
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
                  overscanColumnCount={10}
                  overscanRowCount={10}
                  scrollToColumn={x}
                  scrollToRow={y}
                  cellRenderer={({ columnIndex, key, rowIndex, style }) =>
                    this.cellRenderer({
                      columnIndex,
                      key,
                      rowIndex,
                      x,
                      y,
                      collisions: currentMap.collisions,
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
