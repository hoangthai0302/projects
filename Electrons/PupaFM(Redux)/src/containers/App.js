'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  fetchSongs
} from '../actions'

import Song from '../components/song'
import Channels from '../components/channel'
import Login from '../components/login'
import User from '../components/user'

import './base.scss'

class App extends Component {

  componentDidMount () {
    const { fetchSongs, channelId, songs } = this.props
    if (songs.length === 1 && songs[0].sid === '') {
      fetchSongs(channelId)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { fetchSongs, channelId } = this.props
    if (prevProps.channelId !== channelId) {
      fetchSongs(channelId)
    }
  }

  render () {
    return (
      <div className="cl-player">

        <div className="cl-fr">
          <Channels />
          <User />
        </div>

        <Song />

        <Login />

      </div>
    )
  }
}

App.PropTypes = {
  channelId: PropTypes.number.isRequired
}

const mapStateToProps = state => {
  return {
    ...state.song,
    channelId: state.channelId
  }
}

const mapDispatchToProps = { fetchSongs }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
