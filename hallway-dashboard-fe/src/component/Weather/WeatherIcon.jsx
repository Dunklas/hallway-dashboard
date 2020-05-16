import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { ReactComponent as ClearDay } from './icons/wi-day-sunny.svg'
import { ReactComponent as ClearNight } from './icons/wi-night-clear.svg';
import { ReactComponent as RainDay } from './icons/wi-day-rain.svg';
import { ReactComponent as RainNight } from './icons/wi-night-rain.svg';
import { ReactComponent as SnowDay } from './icons/wi-day-snow.svg';
import { ReactComponent as SnowNight } from './icons/wi-night-snow.svg';
import { ReactComponent as SleetDay } from './icons/wi-day-sleet.svg';
import { ReactComponent as SleetNight } from './icons/wi-night-sleet.svg';
import { ReactComponent as WindDay } from './icons/wi-day-cloudy-windy.svg';
import { ReactComponent as WindNight } from './icons/wi-night-cloudy-windy.svg';
import { ReactComponent as FogDay } from './icons/wi-day-fog.svg';
import { ReactComponent as FogNight } from './icons/wi-night-fog.svg';
import { ReactComponent as CloudyDay } from './icons/wi-day-cloudy.svg';
import { ReactComponent as CloudyNight } from './icons/wi-night-cloudy.svg';
import { ReactComponent as PartlyCloudyDay } from './icons/wi-day-sunny-overcast.svg';
import { ReactComponent as PartlyCloudyNight } from './icons/wi-night-partly-cloudy.svg';

const WeatherIcon = (props) => {

	const renderWeatherIcon = () => {
		const { time, icon } = props;
		if (isDay(time)) {
			return renderDayWeatherIcon(icon);
		}
		return renderNightWeatherIcon(icon);
	}

	const renderDayWeatherIcon = (icon) => {
		switch (icon) {
			case 'clear-day':
			case 'clear-night':
				return <ClearDay />;
			case 'rain':
				return <RainDay />;
			case 'snow':
				return <SnowDay />;
			case 'sleet':
				return <SleetDay />;
			case 'wind':
				return <WindDay />;
			case 'fog':
				return <FogDay />;
			case 'cloudy':
				return <CloudyDay />;
			case 'partly-cloudy-day':
			case 'partly-cloudy-night':
				return <PartlyCloudyDay />;
			default:
				console.warn(`Unexpected icon: ${icon}`);
				return null;
		}
	}

	const renderNightWeatherIcon = (icon) => {
		switch (icon) {
			case 'clear-day':
			case 'clear-night':
				return <ClearNight />;
			case 'rain':
				return <RainNight />;
			case 'snow':
				return <SnowNight />;
			case 'sleet':
				return <SleetNight />;
			case 'wind':
				return <WindNight />;
			case 'fog':
				return <FogNight />;
			case 'cloudy':
				return <CloudyNight />;
			case 'partly-cloudy-day':
			case 'partly-cloudy-night':
				return <PartlyCloudyNight />;
			default:
				console.warn(`Unexpected icon: ${icon}`);
				return null;
		}
	}

	const isDay = (time) => {
		const hour = time.get('hour');
		return hour > 5 && hour < 23;
	}

	return (
		<div className={props.className}>
			{renderWeatherIcon()}
		</div>
	);

};

WeatherIcon.propTypes = {
	time: PropTypes.instanceOf(moment).isRequired,
	icon: PropTypes.string.isRequired,
	className: PropTypes.string,
}

export default WeatherIcon;