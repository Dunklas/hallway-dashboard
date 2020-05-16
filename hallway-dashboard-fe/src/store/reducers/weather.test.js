import * as actionTypes from '../actionCreators/actionTypes';
import weatherReducer from './weather';

describe('Weather Reducer', () => {
	const initialState = {
		weather: [],
		loading: false,
		error: false,
	}
	const loadingState = {
		...initialState,
		loading: true,
	}

	it('should return empty state', () => {
		expect(weatherReducer(undefined, {}))
			.toEqual({
				...initialState,
			});
	});

	it(`should set loading on ${actionTypes.GET_WEATHER_START}`, () => {
		expect(weatherReducer(initialState, {
			type: actionTypes.GET_WEATHER_START,
		})).toEqual({
			...initialState,
			loading: true,
		})
	});

	it(`should set error on ${actionTypes.GET_WEATHER_FAIL}`, () => {
		const error = new Error('we\'re expecting too bad weather!!!');
		expect(weatherReducer(loadingState, {
			type: actionTypes.GET_WEATHER_FAIL,
			payload: error,
		})).toEqual({
			...loadingState,
			loading: false,
			error: true,
		});
	});

	it(`should add weather on ${actionTypes.GET_WEATHER_SUCCESS}`, () => {
		const weather = [
			{
				icon: "partly-cloudy-night",
				latitude: 57.734112,
				longitude: 11.889842,
				precipIntensity: 0,
				precipProbability: 0,
				precipType: "",
				temperature: 14.97,
				time: "2019-06-28T23:00:00Z",
				windGust: 6.99,
				windSpeed: 3.38,
			},
			{
				icon: "partly-cloudy-night",
				latitude: 57.734112,
				longitude: 11.889842,
				precipIntensity: 0,
				precipProbability: 0,
				precipType: "",
				temperature: 14.69,
				time: "2019-06-29T00:00:00Z",
				windGust: 7.99,
				windSpeed: 3.83,
			},
		];
		expect(weatherReducer(loadingState, {
			type: actionTypes.GET_WEATHER_SUCCESS,
			payload: weather,
		})).toEqual({
			...loadingState,
			loading: false,
			weather,
		});
	});

});