import React, { Component } from 'react';
import moment from 'moment';

import TofuClock from '../../component/TofuClock/TofuClock';

class Clock extends Component {

	state = {
		currentTime: moment(),
	};

	componentDidMount() {
		setInterval(() => {
			this.setState({
				currentTime: moment(),
			});
		}, 1000);
	}

	render() {
		return <TofuClock
			time={this.state.currentTime} />;
	}
}

export default Clock;