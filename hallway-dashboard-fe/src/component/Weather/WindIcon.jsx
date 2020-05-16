import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as Wind } from './icons/wi-wind-deg.svg'

const WindIcon = (props) => {
	const { windBearing } = props;

	let rotation = 0;
	if (windBearing >= 0 && windBearing <= 179) {
		rotation = windBearing + 180;
	} else if (windBearing === 180) {
		rotation = 0;
	} else if (windBearing >= 181 && windBearing <= 360) {
		rotation = windBearing - 180;
	} else {
		console.warn(`Unexpected windbearing: ${windBearing}`);
	}

	const style = {
		transform: `rotate(${rotation}deg)`
	}

	return (
		<div className={props.className}>
			<Wind
				style={style} />
		</div>
	);
}

WindIcon.propTypes = {
	windBearing: PropTypes.number.isRequired,
	className: PropTypes.string,
}

export default WindIcon;