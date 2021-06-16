import {createStore, applyMiddleware} from 'redux'
import Reducer from './Reducer'
import thunk from 'redux-thunk'

const Store=createStore(Reducer,applyMiddleware(thunk))
export default Store;