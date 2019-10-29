'use strict'

import { RECEIVE_LOGIN, REQUEST_LOGOUT } from '../actions/types'

const initialState = {}

const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_LOGIN:
      return action.userInfo
    case REQUEST_LOGOUT:
      return {}
    default:
      return state
  }
}

export default userInfo
