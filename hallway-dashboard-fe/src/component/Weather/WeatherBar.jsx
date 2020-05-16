import React from 'react';
import PropTypes from 'prop-types';
import { weatherForecast } from '../../util/common.proptypes';

import WeatherForecast from './WeatherForecast';

import styles from './WeatherBar.module.css';

const WeatherBar = (props) => {

	const weatherForecasts = props.weather
		.map(weatherForecast => (
			<WeatherForecast
				key={weatherForecast.time.valueOf()}
				weatherForecast={weatherForecast} />

		))

	return (
		<div className={styles.main}>
			{weatherForecasts}
		</div>
	);
}

WeatherBar.propTypes = {
	weather: PropTypes.arrayOf(
		weatherForecast
	).isRequired,
}

export default WeatherBar;