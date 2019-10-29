'use strict'

import { CHANGE_CHANNEL } from '../actions/types'

const initialState = '0'

const channelId = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_CHANNEL:
      return action.channelId
    default:
      return state
  }
}

export default channelId
