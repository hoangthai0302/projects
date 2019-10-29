'use strict'

import React from 'react'
import ReactDom from 'react-dom'
import configureStore from './store'
import Root from './containers/Root'

const localState = localStorage.getItem('state')

const initialState = JSON.parse(localState) || {
  login: {
    isPop: false,
    errMsg: ''
  },
  userInfo: {},
  channelId: '0',
  song: {
    // 是否显示歌词
    isShowLyric: false,
    // 暂停/播放
    pause: false,
    // 当前歌曲索引
    current: 0,
    // 正在获取歌曲
    isFetchingSong: false,
    // 正在获取歌词
    isFetchingLyric: false,
    // 歌曲列表
    songs: [{
      singers: [{ id: '0', name: 'xwartz' }],
      title: 'PupaFM',
      album: '/subject/1458963/',
      url: 'https://xwartz.github.com',
      picture: 'https://img3.doubanio.com/lpic/s7052285.jpg',
      like: false,
      lyric: [],
      sid: ''
    }]
  }
}

const store = configureStore(initialState)

window.addEventListener('beforeunload', () => {
  const lastState = JSON.stringify(store.getState())
  localStorage.setItem('state', lastState)
})

ReactDom.render(
  <Root store={ store } />,
  document.getElementById('app')
)
