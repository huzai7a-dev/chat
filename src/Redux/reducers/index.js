import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import chat from './chat';
import message from './message'
const reducers = combineReducers({
    app,
    auth,
    chat,
    message,
});

export default reducers;