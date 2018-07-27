import React from 'react'
import styled from 'styled-components'

import rogue from 'assets/rogue.gif'

const tileSize = 60

/* STYLES */
const PlayerContainer = styled.span`
  ${'' /* position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */};
  position: relative;
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
export default class Player extends React.Component {
  render() {
    return (
      <PlayerContainer {...this.props}>
        <Sprite />
      </PlayerContainer>
    )
  }
}
