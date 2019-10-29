'use strict'

import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducers'

const enhancer = compose(
  applyMiddleware(thunkMiddleware)
)

const configureStore = (initialState) => {
  const store = createStore(rootReducer, initialState, enhancer)
  return store
}

export default configureStore
