import * as actionTypes from '../actionCreators/actionTypes';

const initialState = {
	departures: [],
	loading: false,
	error: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_DEPARTURES_START:
			return getDeparturesStart(state, action);
		case actionTypes.GET_DEPARTURES_FAIL:
			return getDeparturesFail(state, action);
		case actionTypes.GET_DEPARTURES_SUCCESS:
			return getDeparturesSuccess(state, action);
		default: return state;
	};
};

const getDeparturesStart = (state, action) => {
	return {
		...state,
		loading: true,
	};
};

const getDeparturesFail = (state, action) => {
	return {
		...state,
		loading: false,
		error: true,
	};
};

const getDeparturesSuccess = (state, action) => {
	return {
		...state,
		loading: false,
		departures: action.payload.slice(0, 7),
	};
};

export default reducer;