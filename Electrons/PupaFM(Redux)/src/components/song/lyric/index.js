'use strict'

import React, { Component, PropTypes } from 'react'

import './index.scss'

class Lyric extends Component {

  componentDidUpdate () {
    this.scrollLyric()
  }

  getCurrent () {
    let { lyric, time } = this.props
    lyric = lyric || []

    let cLine = 0
    let len = lyric.length
    for (let i = 0; i < len; i++) {
      if (time < lyric[i].time) {
        cLine = i === 0 ? 0 : i - 1
        break
      }
    }

    return cLine
  }

  scrollLyric () {
    const { isShowLyric, lyric } = this.props

    if (!isShowLyric || !lyric) return

    const index = this.getCurrent()
    const top = 28 * (index - 4 < 0 ? 0 : index - 4)
    this.lyric.scrollTop = top
  }

  renderLyric () {
    let { lyric } = this.props
    lyric = lyric || []

    let ldiv
    let len = lyric.length
    if (len) {
      const cLine = this.getCurrent()
      let lyricNodes = lyric.map((l, index) => {
        return <p key={ index }
          className={ cLine === index ? 'on' : '' }>{ l.text }</p>
      })
      ldiv = <div className="ps-container">{ lyricNodes }</div>
    } else {
      ldiv = <div className="no-lyric">暂无歌词</div>
    }
    return ldiv
  }

  render () {
    const { isShowLyric } = this.props

    return (
      <div className={ isShowLyric ? 'playing-lyric' : 'hide' }>
        <div className="lyric" ref={ r => { this.lyric = r } }>
          { this.renderLyric() }
        </div>
        {
          // <div className="lyric-toolbar">
          //   <a href="javascript:;" onClick={ () => closeLyric() } >关闭歌词</a>
          // </div>
        }
      </div>
    )
  }
}

Lyric.propTypes = {
  isShowLyric: PropTypes.bool.isRequired
}

export default Lyric
