import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import chat from './chat';
import message from './message'
import call from './call'

const reducers = combineReducers({
    app,
    auth,
    chat,
    call,
    message,
});

export default reducers;