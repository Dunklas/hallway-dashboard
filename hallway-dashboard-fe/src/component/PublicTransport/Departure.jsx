import React from 'react';
import PropTypes from 'prop-types';
import { departure } from '../../util/common.proptypes';

import moment from 'moment';

import styles from './Departure.module.css';

const Departure = (props) => {

	const renderNumber = (departure) => {
		let transportClasses = [styles.number];
		switch (departure.number) {
			case '6':
				transportClasses.push(styles.numberSix);
				break;
			case '5':
				transportClasses.push(styles.numberFive);
				break;
			default:
				transportClasses.push(styles.numberDefault);
		}

		return <div className={transportClasses.join(' ')}>
			{props.departure.number}
		</div>
	}

	const renderTimeLeft = (departure, currentTime) => {
		const { time, realTime } = departure;

		let timeToQuery = realTime ? realTime : time;

		const timeLeft = timeToQuery.diff(currentTime, 'minutes');
		if (timeLeft < 0) {
			return <div className={styles.timeLeft}>-</div>;
		}
		return <div className={styles.timeLeft}>{`${timeLeft}min`}</div>;
	}

	const renderTime = (departure) => {
		const { time, realTime } = departure;

		if (!realTime) {
			return <div className={styles.time}>{time.format('HH:mm')}</div>
		}

		const deviationDiff = realTime.diff(time, 'minutes');
		if (deviationDiff === 0) {
			return <div className={styles.time}>{time.format('HH:mm')}</div>
		}

		const deviationDiffDisplay = deviationDiff < 0 ? "-" : "+" + deviationDiff;
		return <div className={styles.time}>
			<p>{time.format('HH:mm')} ({deviationDiffDisplay})</p>
		</div>
	};

	const { departure, currentTime } = props;
	return (
		<div className={styles.main}>
			{renderNumber(departure)}
			{renderTimeLeft(departure, currentTime)}
			{renderTime(departure)}
			<div className={styles.direction}>{departure.direction}</div>
		</div>
	)
};

Departure.propTypes = {
	departure: departure.isRequired,
	currentTime: PropTypes.instanceOf(moment),
}

export default Departure;