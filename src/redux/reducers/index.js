import { combineReducers } from 'redux';
import books from './booksReducer';
import customBook from './customBookReducer';
import auth from './authReducer';
import app from './appReducer';

export default combineReducers({
  books,
  customBook,
  auth,
  app,
});
