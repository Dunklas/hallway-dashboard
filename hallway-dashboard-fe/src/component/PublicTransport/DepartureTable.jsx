import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { departure } from '../../util/common.proptypes';

import Departure from './Departure';

import styles from './DepartureTable.module.css';

const DepartureTable = (props) => {
	const { departures, currentTime } = props;

	const departureRows = departures
		.map(departure => (
			<Departure
				departure={departure}
				currentTime={currentTime}
				key={departure.number + departure.time.valueOf()} />
		));

	return (
		<div className={styles.main}>
			{departureRows}
		</div>
	);
};

DepartureTable.propTypes = {
	departures: PropTypes.arrayOf(
		departure
	).isRequired,
	currentTime: PropTypes.instanceOf(moment),
}

export default DepartureTable;