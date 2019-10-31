import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { devToolsEnhancer } from 'redux-devtools-extension';
import viewReducer from './views/reducer';
import apiReducer from './api/reducer';
import audioReducer from './audio/reducer';
import navReducer from './components/bar/reducer';

const rootReducer = combineReducers({
   viewState: viewReducer,
   apiState: apiReducer,
   audioState: audioReducer,
   navState: navReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(
//   reducers,
//   composeEnhancer(applyMiddleware(thunk)),
// );

const store = createStore(
   rootReducer,
   composeEnhancer(applyMiddleware(thunkMiddleware)),
);

export default store;
