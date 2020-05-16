import React from 'react';

import Clock from './container/Clock/ClockContainer';
import WeatherContainer from './container/Weather/WeatherContainer';
import PublicTransportContainer from './container/PublicTransport/PublicTransportContainer';
import TofuImage from './component/TofuImage/TofuImage';

import styles from './Dashboard.module.css';

function App() {
	return (
		<div className={styles.container}>
			<Clock />
			<WeatherContainer />
			<PublicTransportContainer />
			<TofuImage />
		</div>
	);
}

export default App;

