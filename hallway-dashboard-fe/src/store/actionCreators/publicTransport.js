import * as actionTypes from './actionTypes';
import { getObject } from '../../util/s3';

export const getDepartures = () => {
	return dispatch => {
			dispatch(getDeparturesStart());
			return getObject("public_transport")
				.then(data => {
					dispatch(getDeparturesSuccess(JSON.parse(data.Body)));
				}).catch(err => {
					dispatch(getDeparturesFail(err));
				});
	};
};

const getDeparturesStart = () => {
	return {
		type: actionTypes.GET_DEPARTURES_START,
	};
};

const getDeparturesFail = (error) => {
	return {
		type: actionTypes.GET_DEPARTURES_FAIL,
		payload: error,
	};
};

const getDeparturesSuccess = (departures) => {
	return {
		type: actionTypes.GET_DEPARTURES_SUCCESS,
		payload: departures,
	};
};