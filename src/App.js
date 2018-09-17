import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import Map from 'screens/Map3'
import Player from 'components/Player'
import reducer from 'state/reducers'

import maps from 'assets/maps'

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Map currentMap={maps.starting} />
          <Player />
        </div>
      </Provider>
    )
  }
}

export default App
