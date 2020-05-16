import PropTypes from 'prop-types';
import moment from 'moment';

const departureCommon = {
	direction: PropTypes.string.isRequired,
	number: PropTypes.string.isRequired,
	stop: PropTypes.string.isRequired,
}

export const departure = PropTypes.shape({
	...departureCommon,
	time: PropTypes.instanceOf(moment).isRequired,
	realTime: PropTypes.instanceOf(moment),
});

export const departureRaw = PropTypes.shape({
	...departureCommon,
	time: PropTypes.string.isRequired,
	realTime: PropTypes.string,
});

const weatherForecastCommon = {
	icon: PropTypes.string.isRequired,
	latitude: PropTypes.number.isRequired,
	longitude: PropTypes.number.isRequired,
	temperature: PropTypes.number.isRequired,
	precipIntensity: PropTypes.number,
	precipProbability: PropTypes.number,
	precipType: PropTypes.string,
	windBearing: PropTypes.number,
	windGust: PropTypes.number,
	windSpeed: PropTypes.number,
}

export const weatherForecast = PropTypes.shape({
	...weatherForecastCommon,
	time: PropTypes.instanceOf(moment).isRequired,
});

export const weatherForecastRaw = PropTypes.shape({
	...weatherForecastCommon,
	time: PropTypes.string.isRequired,
})