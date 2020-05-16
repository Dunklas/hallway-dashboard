jest.mock('../../util/s3');
import { getObject } from '../../util/s3';
import * as actionTypes from './actionTypes';
import { getWeather } from './weather';

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';

describe('Weather ActionCreator', () => {

	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	it(`should dispatch ${actionTypes.GET_WEATHER_SUCCESS} after weatherForecast is received`, () => {
		const weather = [
			{
				icon: 'clear-day',
				latitude: 57.734112,
				longitude: 11.889842,
				precipIntensity: 0,
				precipProbability: 0,
				precipType: '',
				temperature: 18.56,
				time: '2019-06-29T16:00:00Z',
				windGust: 13.54,
				windSpeed: 7.81,
			},
		];
		getObject.mockImplementation(() =>
			new Promise((resolve, reject) => {
				resolve({
					Body: JSON.stringify(weather) // TODO: Return Uint8Array like the real API 
				});
			})
		);

		const expectedActions = [
			{
				type: actionTypes.GET_WEATHER_START,
			},
			{
				type: actionTypes.GET_WEATHER_SUCCESS,
				payload: weather,
			},
		];
		const store = mockStore({ weather: [], });

		return store.dispatch(getWeather()).then(() => {
			expect(store.getActions())
				.toEqual(expectedActions);
		});
	});

	it(`should dispatch ${actionTypes.GET_WEATHER_FAIL} on server error`, () => {
		getObject.mockImplementation(() =>
			new Promise((resolve, reject) => {
				reject('Some error!!');
			})
		);
		const expectedActions = [
			{
				type: actionTypes.GET_WEATHER_START,
			},
			{
				type: actionTypes.GET_WEATHER_FAIL,
				payload: 'Some error!!',
			},
		];
		const store = mockStore({ weather: [], });

		return store.dispatch(getWeather()).then(() => {
			expect(store.getActions())
				.toEqual(expectedActions);
		});
	});
});