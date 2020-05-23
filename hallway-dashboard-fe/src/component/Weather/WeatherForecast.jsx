import React from 'react';
import { weatherForecast } from '../../util/common.proptypes';

import WeatherIcon from './WeatherIcon';
import PrecipitationIcon from './PrecipitationIcon';
import WindIcon from './WindIcon';

import styles from './WeatherForecast.module.css';

const WeatherForecast = (props) => {

	const formatPrecipitation = (intensity, probability) => {
		return `${intensity.toFixed(2)} mm/h (${Math.round(probability * 100)}%)`;
	}

	const formatTemperature = (temp) => {
		return `${Math.round(temp)} ℃`;
	}

	const formatWindSpeed = (windSpeed) => {
		return `${windSpeed.toFixed(2)} m/s`
	}

	const renderPrecipitation = () => {
		const { precipType, precipIntensity, precipProbability } = props.weatherForecast;
		if (!precipIntensity || precipIntensity === 0) {
			return null;
		}

		return (
			<div className={styles.details}>
				<PrecipitationIcon
					className={styles.precipitationIcon}
					precipType={precipType} />
				<div>{formatPrecipitation(precipIntensity, precipProbability)}</div>
			</div>
		)
	}

	const renderWind = () => {
		const { windSpeed, windBearing } = props.weatherForecast;
		return (
			<div className={styles.details}>
				<WindIcon
					windBearing={windBearing}
					className={styles.windIcon} />
				<div>{formatWindSpeed(windSpeed)}</div>
			</div>
		);
	}

	const { weatherForecast: { time, icon, temperature } } = props;

	return (
		<>
			<div className={styles.separator} />
			<div className={styles.main}>
				<div className={styles.overviewContainer}>
					<div className={styles.weatherIconContainer}>
						<WeatherIcon
							className={styles.weatherIcon}
							time={time}
							icon={icon} />
					</div>
					<div className={styles.overview}>
						<span className={styles.timeLabel}>{time.format('HH:mm')}</span>
						<span data-test={'weather-temperature'}>{formatTemperature(temperature)} </span>
					</div>
				</div>
				<div className={styles.detailsContainer}>
					<div>
						{renderWind()}
						{renderPrecipitation()}
					</div>
				</div>
			</div>
		</>
	);
};

WeatherForecast.propTypes = {
	weatherForecast: weatherForecast.isRequired,
}

export default WeatherForecast;