'use strict'

import React, { Component, PropTypes } from 'react'

import Wave from '../wave'
import './index.scss'

class Channel extends Component {

  render () {
    const { id, name, channelId, channelClick } = this.props
    return (
      <li
        className={ 'channel' + (channelId === id ? ' active' : '') } key={ id }>
        <Wave />
        <a href='javascript:;' onClick={ channelClick }>{ name }</a>
      </li>
    )
  }
}

Channel.propTypes = {
  channelClick: PropTypes.func.isRequired
}

export default Channel

