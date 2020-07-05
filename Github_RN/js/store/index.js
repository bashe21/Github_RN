import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducer'

const middlewares = [
    thunk
];

// 创建store
export default createStore(reducer, applyMiddleware(...middlewares));
