import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from './promiseMiddleware';
import asyncActionCallbackMiddleware from './asyncActionCallbackMiddleware';
import logger from 'redux-logger';
import reducers from '../reducers';


var middlewares = [
	thunkMiddleware,
	promiseMiddleware,
	asyncActionCallbackMiddleware,
	logger()
];




export default function configureStore(initialState) {

	const store = applyMiddleware(
		...middlewares
	)(createStore)(reducers, initialState);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', () => {
			const nextReducer = require('../reducers')
			store.replaceReducer(nextReducer)
		})
	}

	return store
}






