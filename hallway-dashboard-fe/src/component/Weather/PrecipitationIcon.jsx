import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as Rain } from './icons/wi-raindrop.svg'
import { ReactComponent as Snow } from './icons/wi-snowflake-cold.svg';
import { ReactComponent as Sleet } from './icons/wi-sleet.svg';

const PrecipitationIcon = (props) => {

	const renderPrecipitationIcon = () => {
		switch (props.precipType) {
			case 'rain':
				return <Rain />;
			case 'snow':
				return <Snow />;
			case 'sleet':
				return <Sleet />;
			default:
				console.warn(`Unexpected precipType: ${props.precipType}`);
				return null;
		}
	}

	return (
		<div className={props.className}>
			{renderPrecipitationIcon()}
		</div>
	)
}

PrecipitationIcon.propTypes = {
	precipType: PropTypes.string.isRequired,
	className: PropTypes.string,
}

export default PrecipitationIcon;