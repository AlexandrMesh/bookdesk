import { combineReducers } from 'redux';
import books from './booksReducer';
import auth from './authReducer';
import app from './appReducer';

export default combineReducers({
  books,
  auth,
  app,
});
