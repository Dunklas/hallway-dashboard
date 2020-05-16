import * as actionTypes from '../actionCreators/actionTypes';
import publicTransportReducer from './publicTransport';

describe('Public Transport Reducer', () => {
	const initialState = {
		departures: [],
		loading: false,
		error: false,
	};
	const loadingState = {
		...initialState,
		loading: true,
	};

	it('should return empty state', () => {
		expect(publicTransportReducer(undefined, {}))
			.toEqual({
				...initialState,
			});
	});

	it(`should set loading on ${actionTypes.GET_DEPARTURES_START}`, () => {
		expect(publicTransportReducer(initialState, {
			type: actionTypes.GET_DEPARTURES_START,
		})).toEqual({
			...initialState,
			loading: true,
		});
	});

	it(`should set error on ${actionTypes.GET_DEPARTURES_FAIL}`, () => {
		const error = new Error('Oh no, the tram is not coming!');
		expect(publicTransportReducer(loadingState, {
			type: actionTypes.GET_DEPARTURES_FAIL,
			payload: error,
		})).toEqual({
			...loadingState,
			loading: false,
			error: true,
		});
	});

	it(`should add departures on ${actionTypes.GET_DEPARTURES_SUCCESS}`, () => {
		const departures = [
			{
				direction: "Göteborg Härlanda",
				number: "6",
				realTime: "2019-06-29T01:24:00+02:00",
				stop: "Göteborg Temperaturgatan",
				time: "2019-06-29T01:23:00+02:00",
			},
			{
				direction: "Ålegården (Mölndal kn)",
				number: "25",
				realTime: "2019-06-29T01:31:00+02:00",
				stop: "Göteborg Temperaturgatan",
				time: "2019-06-29T01:31:00+02:00",
			},
		];
		expect(publicTransportReducer(loadingState, {
			type: actionTypes.GET_DEPARTURES_SUCCESS,
			payload: departures,
		})).toEqual({
			...loadingState,
			loading: false,
			departures,
		});
	});
});