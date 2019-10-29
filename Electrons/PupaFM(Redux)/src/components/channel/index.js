'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { changeChannel } from '../../actions'
import channels from './channels'
import Channel from './item'
import Wave from '../wave'

import './index.scss'

class Channels extends Component {

  render () {
    const { channelId, changeChannel } = this.props
    const channelNodes = channels.map((channel) => {
      return (
        <Channel { ...channel } key={ channel.id }
          channelId={ channelId }
          channelClick={ () => { changeChannel(channel.id) } }
        />
      )
    })
    return (
      <div className="channels-wrap">
        <Wave />
        <span className="channels-title">快捷收听</span>
        <ul className="channels clearfix">
          { channelNodes }
        </ul>
      </div>
    )
  }
}

Channels.propTypes = {
  changeChannel: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    channelId: state.channelId
  }
}

const mapDispatchToProps = { changeChannel }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channels)
