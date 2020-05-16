import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { weatherForecastRaw } from '../../util/common.proptypes';

import moment from 'moment';

import { getWeather } from '../../store/actionCreators/weather';
import WeatherBar from '../../component/Weather/WeatherBar';

class WeatherContainer extends Component {

	componentDidMount() {
		this.fetchWeatherAtInterval(60 * 10);
	}

	fetchWeatherAtInterval(intervalInSec) {
		this.props.doGetWeather();
		setInterval(() => {
			this.props.doGetWeather();
		}, intervalInSec * 1000);
	}

	transformWeather(weather) {
		return weather.map(weatherForecast => {
			return {
				...weatherForecast,
				time: moment.unix(weatherForecast.time),
			};
		});
	};

	render() {
		const { loading, error, weather } = this.props.weather;
		return (
			<WeatherBar
				weather={this.transformWeather(weather)}
				loading={loading}
				error={error} />
		);
	};
};

const mapStateToProps = state => {
	return {
		weather: state.weather,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		doGetWeather: () => dispatch(getWeather()),
	}
};

WeatherContainer.propTypes = {
	weather: PropTypes.shape({
		weather: PropTypes.arrayOf(
			weatherForecastRaw
		).isRequired,
		error: PropTypes.bool.isRequired,
		loading: PropTypes.bool.isRequired,
	}).isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherContainer);