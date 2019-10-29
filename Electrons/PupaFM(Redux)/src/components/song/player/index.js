'use strict'

import React, { Component, PropTypes } from 'react'

import './index.scss'

class Player extends Component {

  render () {
    const { url } = this.props
    return (
      <audio src={ url }
      preload autoPlay />
    )
  }
}

Player.propTypes = {
  url: PropTypes.string.isRequired
}

export default Player
