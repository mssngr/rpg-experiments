import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { charType } from 'state/reducers/characters'

const HeroImg = styled.img`
  height: 400px;
`

class Home extends React.Component {
  static propTypes = {
    hero: charType,
  }
  render() {
    const { hero } = this.props
    return (
      <div>
        <h1>You are {hero.name}.</h1>
        <HeroImg src={hero.portrait} />
      </div>
    )
  }
}

const mapState = state => ({
  hero: state.characters[0],
})

export default connect(mapState)(Home)
