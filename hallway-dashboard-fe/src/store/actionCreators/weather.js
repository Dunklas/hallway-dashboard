import * as actionTypes from './actionTypes';
import { getObject } from '../../util/s3';

export const getWeather = () => {
	return dispatch => {
			dispatch(getWeatherStart());
			return getObject("weather")
				.then(data => {
					dispatch(getWeatherSuccess(JSON.parse(data.Body)));
				}).catch(err => {
					dispatch(getWeatherFail(err));
				});
	}
};

const getWeatherStart = () => {
	return {
		type: actionTypes.GET_WEATHER_START,
	};
};

const getWeatherFail = (error) => {
	return {
		type: actionTypes.GET_WEATHER_FAIL,
		payload: error,
	}
}

const getWeatherSuccess = (weather) => {
	return {
		type: actionTypes.GET_WEATHER_SUCCESS,
		payload: weather,
	}
}