import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import Map from 'screens/Map'
import reducer from 'state/reducers'

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Map />
      </Provider>
    )
  }
}

export default App
