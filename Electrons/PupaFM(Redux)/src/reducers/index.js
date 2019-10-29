'use strict'

import { combineReducers } from 'redux'

import login from './login'
import userInfo from './user'
import channelId from './channelId'
import song from './song'

const rootReducer = combineReducers({
  login,
  userInfo,
  channelId,
  song
})

export default rootReducer
