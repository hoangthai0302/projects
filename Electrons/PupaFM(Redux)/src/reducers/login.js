'use strict'

import { assign } from '../utils'
import { SHOW_LOGIN, ERROR_LOGIN } from '../actions/types'

const initialState = {
  isPop: false,
  errMsg: ''
}

const login = (state = initialState, action) => {
  const { isPop } = state
  switch (action.type) {
    case SHOW_LOGIN:
      return assign(state, { isPop: !isPop })
    case ERROR_LOGIN:
      return assign(state, { errMsg: action.errMsg })
    default:
      return state
  }
}

export default login
