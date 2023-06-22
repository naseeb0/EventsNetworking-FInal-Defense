// store.js

import { createStore, combineReducers } from 'redux';
import { favoritesReducer } from './reducers';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
});

const store = createStore(rootReducer);

export default store;
