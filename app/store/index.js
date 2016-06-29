import { createStore, combineReducers } from 'redux';

export function configureStore(reducers, initialState) {
  return createStore(combineReducers(reducers), initialState);
}
