'use strict'

import { ipcRenderer } from 'electron'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { nextSong,
  pauseSong,
  postNever,
  postLike,
  fetchMoreSongs,
  showLyric,
  fetchLyric
} from '../../actions'

import './index.scss'
import '../../assets/font/iconfont.scss'

import SongTitle from './title'
import Progress from './progress'
import Controls from './controls'
import Cover from './cover'
import Lyric from './lyric'

class Song extends Component {

  constructor (props) {
    super(props)
    this.state = {
      time: 0,
      percent: '0%'
    }
  }

  updateState (props) {
    const nState = Object.assign({}, this.state, props)
    this.setState(nState)
  }

  componentDidMount () {
    this.listenUpdate()
  }

  notification (song) {
    const n = new Notification(song.title, {
      icon: song.picture,
      body: song.artist,
      silent: true
    })
    setTimeout(n.close.bind(n), 3000)
    n.onclick = () => {
      ipcRenderer.send('showWindow')
    }
  }

  componentDidUpdate (prevProps) {
    const { songs, current } = this.props
    const song = songs[current]
    if (song.sid !== prevProps.songs[prevProps.current].sid) {
      this.notification(song)
    }
  }

  pauseSong () {
    this.player.pause()
  }

  playSong () {
    this.player.play()
  }

  handlePause () {
    const { pause, pauseSong } = this.props
    pause ? this.playSong() : this.pauseSong()
    pauseSong()
  }

  // 如果是要显示歌词，在切换歌的时候，尝试获取歌词
  initLyric () {
    const { current, songs, isShowLyric, fetchLyric } = this.props
    const song = songs[current]
    if (isShowLyric && !song.lyric) {
      fetchLyric(song.sid, song.ssid)
    }
  }

  // 跳过
  _skip (method) {
    const { current, songs, channelId, fetchMoreSongs } = this.props
    const song = songs[current]

    if (songs.length <= current + 2) {
      fetchMoreSongs(channelId, song.sid,
        () => {
          method()
          this.initLyric()
        })
    } else {
      method()
      this.initLyric()
    }
  }

  handleNext () {
    const { nextSong } = this.props
    this._skip(nextSong)
  }

  handleStar () {
    const { postLike, current, songs, channelId } = this.props
    const song = songs[current]
    postLike(song.like, channelId, song.sid)
  }

  handleNever () {
    const { postNever } = this.props
    this._skip(postNever)
  }

  // 显示隐藏歌词
  handleShowLyric () {
    const { current, songs, showLyric, fetchLyric } = this.props
    const song = songs[current]
    if (song.lyric) {
      showLyric()
    } else {
      fetchLyric(song.sid, song.ssid, showLyric)
    }
  }

  listenUpdate () {
    // 监听时间更新
    this.player.addEventListener('timeupdate', () => {
      let pt = this.player.currentTime
      let dt = this.player.duration

      this.updateState({
        percent: pt / dt * 100 + '%',
        time: pt
      })
    })

    // 监听播放结束
    this.player.addEventListener('ended', () => {
      this.handleNext()
    })
  }

  render () {
    const { current, songs, pause, isShowLyric, isFetchingLyric } = this.props
    const song = songs[current]

    return (
      <div className="fullplayer">
        <div className="playing-info">

          <audio ref={ r => { this.player = r } } src={ song.url } preload autoPlay={ !pause } />

          <SongTitle { ...song } time={ this.state.time } pause={ pause }
            onPause={ this.handlePause.bind(this) }
          />

          <Progress percent={ this.state.percent } />

          <div className="below-progress">
            <span className="iconfont icon-lyric"
              onClick={ () => { this.handleShowLyric() } }>
            </span>
          </div>

          <Controls { ...song }
            onNext={ this.handleNext.bind(this) }
            onStar={ this.handleStar.bind(this) }
            onTrash={ this.handleNever.bind(this) }
          />

        </div>

        <Cover { ...song } isFetchingLyric={ isFetchingLyric } />

        <Lyric { ...song } isShowLyric={ isShowLyric }
          time={ this.state.time }
        />

      </div>
    )
  }
}

Song.propTypes = {
  channelId: PropTypes.string.isRequired,
  pause: PropTypes.bool.isRequired,
  current: PropTypes.number.isRequired,
  songs: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  isShowLyric: PropTypes.bool.isRequired,
  isFetchingLyric: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
  return {
    ...state.song,
    channelId: state.channelId
  }
}

const mapDispatchToProps = {
  nextSong,
  pauseSong,
  postNever,
  postLike,
  fetchMoreSongs,
  showLyric,
  fetchLyric
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Song)

