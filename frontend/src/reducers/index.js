import { combineReducers } from 'redux';
import author from './author';
import errors from './errors';
import messages from './messages';
import auth from './auth';
import editor from './editor';
import common from './common';
import chief from './chief';

export default combineReducers({
  author,
  errors,
  messages,
  auth,
  editor,
  common,
  chief,
});
