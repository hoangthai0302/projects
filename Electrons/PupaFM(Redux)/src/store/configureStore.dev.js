'use strict'

import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { persistState } from 'redux-devtools'
import DevTools from '../containers/DevTools'

import rootReducer from '../reducers'

const loggerMiddleware = createLogger()

const enhancer = compose(
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
)

const configureStore = (initialState) => {
  const store = createStore(rootReducer, initialState, enhancer)

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    )
  }

  // store.subscribe(() =>
  //   console.log(store.getState())
  // )

  return store
}

export default configureStore
