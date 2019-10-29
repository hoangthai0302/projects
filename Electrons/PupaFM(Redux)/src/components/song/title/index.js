'use strict'

import React, { Component, PropTypes } from 'react'

import './index.scss'

class SongTitle extends Component {

  // 格式化时间
  formatTime (n) {
    var m = Math.floor(n / 60)
    var s = Math.ceil(n % 60)
    m = m < 10 ? '0' + m : m
    s = s < 10 ? '0' + s : s
    return m + ':' + s
  }

  render () {
    const { onPause, singers, album, title, time, pause } = this.props

    const singerNodes = singers.map((singer, index) => {
      let name = singer.name
      if (index > 0) {
        name = ' / ' + name
      }
      return (
        <a key={ singer.id }
           href={ `http://douban.fm/artist/${singer.id}` } target='_blank'>
          { name }
        </a>
      )
    })

    return (
      <div className='titles'>
        <div className='title'>
          <a href={ `https://music.douban.com${album}` } target='_blank'>
            { title }
          </a>
        </div>

        <div className='subtitle'>
          { singerNodes }
          <div className='fr'>
            <span className='time'>{ this.formatTime(time) }</span>
            <span onClick={ () => { onPause() } }
              className={ 'iconfont ' + (pause ? 'icon-play' : 'icon-pause') }>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

SongTitle.propTypes = {
  onPause: PropTypes.func.isRequired,
  singers: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  album: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  pause: PropTypes.bool.isRequired
}

export default SongTitle
