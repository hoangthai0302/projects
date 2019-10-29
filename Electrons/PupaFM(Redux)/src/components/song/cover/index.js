'use strict'

import React, { Component, PropTypes } from 'react'

import Loader from '../loader'

import './index.scss'

// const styleCover = {
//   width: 206,
//   borderRadius: '50%',
//   background: this.props.picture
// }

class Cover extends Component {
  render () {
    const { picture, album, isFetchingLyric } = this.props

    return (
      <a className='playing-cover' href={`https://music.douban.com${album}`} target='_blank'>
        <div className='cover' style={{ backgroundImage: 'url(' + picture + ')' }} ></div>
        { isFetchingLyric ? <Loader /> : '' }
      </a>
    )
  }
}

Cover.propTypes = {
  picture: PropTypes.string.isRequired,
  album: PropTypes.string.isRequired,
  isFetchingLyric: PropTypes.bool.isRequired
}

export default Cover
