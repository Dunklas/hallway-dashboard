jest.mock('../../util/s3');
import { getObject } from '../../util/s3';
import * as actionTypes from './actionTypes';
import { getDepartures } from './publicTransport';

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';

describe('Public Transport ActionCreator', () => {

	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	it(`should dispatch ${actionTypes.GET_DEPARTURES_SUCCESS} after departures are received`, () => {
		const departures = [
			{
				direction: 'Ålegården (Mölndal kn)',
				number: '25',
				realTime: '2019-06-29T10:37:00+02:00',
				stop: 'Göteborg Temperaturgatan',
				time: '2019-06-29T10:37:00+02:00',
			},
		];
		getObject.mockImplementation(() =>
			new Promise((resolve, reject) => {
				resolve({
					Body: JSON.stringify(departures) // TODO: Return Uint8Array like the real API 
				});
			})
		);

		const expectedActions = [
			{
				type: actionTypes.GET_DEPARTURES_START,
			},
			{
				type: actionTypes.GET_DEPARTURES_SUCCESS,
				payload: departures
			},
		];
		const store = mockStore({ departures: [], });

		store.dispatch(getDepartures()).then(() => {
			expect(store.getActions())
				.toEqual(expectedActions);
		});
	});

	it(`should dispatch ${actionTypes.GET_DEPARTURES_FAIL} on server error`, () => {
		getObject.mockImplementation(() =>
			new Promise((resolve, reject) => {
				reject('Some error!!');
			})
		);
		const expectedActions = [
			{
				type: actionTypes.GET_DEPARTURES_START,
			},
			{
				type: actionTypes.GET_DEPARTURES_FAIL,
				payload: 'Some error!!',
			},
		];
		const store = mockStore({ departures: [], });

		store.dispatch(getDepartures()).then(() => {
			expect(store.getActions())
				.toEqual(expectedActions);
		});
	});
});