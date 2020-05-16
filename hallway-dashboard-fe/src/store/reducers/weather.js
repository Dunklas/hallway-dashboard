import * as actionTypes from '../actionCreators/actionTypes';

const initialState = {
	weather: [],
	loading: false,
	error: false,
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_WEATHER_START:
			return getWeatherStart(state, action);
		case actionTypes.GET_WEATHER_FAIL:
			return getWeatherFail(state, action);
		case actionTypes.GET_WEATHER_SUCCESS:
			return getWeatherSuccess(state, action);
		default: return state;
	}
};

const getWeatherStart = (state, action) => {
	return {
		...state,
		loading: true,
	};
};

const getWeatherFail = (state, action) => {
	return {
		...state,
		loading: false,
		error: true,
	};
};

const getWeatherSuccess = (state, action) => {
	return {
		...state,
		loading: false,
		weather: action.payload.slice(0, 16).filter((val, index) => index % 2 === 0),
	};
};

export default reducer;