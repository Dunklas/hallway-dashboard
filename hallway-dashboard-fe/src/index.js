import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import Dashboard from './Dashboard';

import weatherReducer from './store/reducers/weather';
import publicTransportReducer from './store/reducers/publicTransport';

const rootReducer = combineReducers({
	weather: weatherReducer,
	publicTransport: publicTransportReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	rootReducer,
	composeEnhancers(
		applyMiddleware(thunk)
	));

ReactDOM.render(
	<Provider store={store}>
		<Dashboard />
	</Provider>,
	document.getElementById('root')
);
