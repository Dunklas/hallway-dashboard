import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import styles from './TofuClock.module.css';

const TofuClock = (props) => {

	const timeFormat = 'HH:mm:ss'

	return (
		<div className={styles.main}>
			<p>{props.time.format(timeFormat)}</p>
		</div>
	);
};

TofuClock.propTypes = {
	time: PropTypes.instanceOf(moment),
}

export default TofuClock;