import * as React from 'react'
import PropTypes from 'prop-types'
import { find } from 'lodash'

export default class HandleMovement extends React.PureComponent {
  static propTypes = {
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    currentMap: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.any,
  }
  static defaultProps = {
    initialX: 0,
    initialY: 0,
  }

  state = {
    x: this.props.initialX,
    y: this.props.initialY,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
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

  handleKeyDown = e => {
    console.log(e.key)
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
    const { className, children } = this.props
    const { x, y } = this.state

    return <div className={className}>{children({ x, y })}</div>
  }
}
