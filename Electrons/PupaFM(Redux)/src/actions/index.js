'use strict'

import { operate } from './api'
import * as types from './types'

export const nextSong = () => {
  return { type: types.DO_NEXT }
}

export const pauseSong = () => {
  return { type: types.DO_PAUSE }
}

const never = () => {
  return { type: types.DO_NEVER }
}

const like = () => {
  return { type: types.DO_LIKE }
}

// never play again
const receiveNever = () => {
  return { type: types.RECEIVE_NEVER }
}

export const postNever = (channel, sid) => {
  return (dispatch) => {
    dispatch(never())

    return operate('neverPlayAgain', { channel, sid },
      () => receiveNever())
  }
}

// star song
const receiveLike = () => {
  return { type: types.RECEIVE_LIKE }
}

export const postLike = (isLike, channel, sid) => {
  const method = isLike ? 'unstar' : 'star'
  return (dispatch) => {
    dispatch(like())

    return operate(method, { channel, sid },
      () => receiveLike())
  }
}

// fetch more
const requestMoreSongs = (channel, sid) => {
  return { type: types.REQUEST_MORE, channel, sid }
}

const receiveMoreSongs = (songs) => {
  return { type: types.RECEIVE_MORE, songs }
}

export const fetchMoreSongs = (channel, sid, cb) => {
  return (dispatch) => {
    dispatch(requestMoreSongs(channel, sid))

    return operate('songs', { channel, sid },
      (songs) => {
        dispatch(receiveMoreSongs(songs))
        cb && cb()
      })
  }
}

// fetch songs
const requestSongs = (channel) => {
  return { type: types.REQUEST_SONGS, channel }
}

const receiveSongs = (songs) => {
  return { type: types.RECEIVE_SONGS, songs }
}

export const fetchSongs = (channel) => {
  return (dispatch) => {
    dispatch(requestSongs(channel))

    return operate('songs', { channel },
      (songs) => dispatch(receiveSongs(songs)))
  }
}

// lyric
export const showLyric = () => {
  return { type: types.SHOW_LYRIC }
}

const requestLyric = () => {
  return { type: types.REQUEST_LYRIC }
}

const receiveLyric = (lyric) => {
  return { type: types.RECEIVE_LYRIC, lyric }
}

export const fetchLyric = (sid, ssid, cb) => {
  return (dispatch) => {
    dispatch(requestLyric())

    return operate('lyric', { sid, ssid },
      (res) => {
        dispatch(receiveLyric(res.lyric))
        cb && cb()
      })
  }
}

export const changeChannel = (channelId) => {
  return { type: types.CHANGE_CHANNEL, channelId }
}

// login
const requestLogin = () => {
  return { type: types.REQUEST_LOGIN }
}

const receiveLogin = (userInfo) => {
  return { type: types.RECEIVE_LOGIN, userInfo }
}

const loginError = (errMsg) => {
  return { type: types.ERROR_LOGIN, errMsg }
}

export const login = (opt) => {
  return (dispatch) => {
    dispatch(requestLogin())
    return operate('login', opt, (data) => {
      if (data.body.r === 0) {
        dispatch(receiveLogin(data.body.user_info))
        dispatch(loginPop())
      } else {
        dispatch(loginError(data.body.err_msg))
      }
    })
  }
}

export const loginPop = () => {
  return { type: types.SHOW_LOGIN }
}

export const logout = () => {
  return { type: types.REQUEST_LOGOUT }
}
