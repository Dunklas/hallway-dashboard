import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { departureRaw } from '../../util/common.proptypes';

import moment from 'moment';

import DepartureTable from '../../component/PublicTransport/DepartureTable';

import { getDepartures } from '../../store/actionCreators/publicTransport';

class PublicTransportContainer extends Component {

	state = {
		currentTime: moment(),
	}

	componentDidMount() {
		this.fetchDeparturesAtInterval(60 * 2);
		this.updateCurrentTimeAtInterval(10);
	}

	updateCurrentTimeAtInterval(intervalInSec) {
		setInterval(() => {
			this.setState({
				currentTime: moment(),
			});
		}, intervalInSec * 1000);
	}

	fetchDeparturesAtInterval(intervalInSec) {
		this.props.doGetDepartures();
		setInterval(() => {
			this.props.doGetDepartures();
		}, intervalInSec * 1000);
	}

	transformDepartures(departures) {
		return departures.map(departure => {
			return {
				...departure,
				time: moment(departure.time),
				realTime: departure.realTime ? moment(departure.realTime) : null,
			};
		});
	}

	render() {
		const { loading, error, departures } = this.props.publicTransport;
		return (
			<DepartureTable
				departures={this.transformDepartures(departures)}
				currentTime={this.state.currentTime}
				loading={loading}
				error={error} />
		);
	};
};

const mapStateToProps = state => {
	return {
		publicTransport: state.publicTransport
	};
};

const mapDispatchToProps = dispatch => {
	return {
		doGetDepartures: () => dispatch(getDepartures()),
	}
}

PublicTransportContainer.propTypes = {
	publicTransport: PropTypes.shape({
		departures: PropTypes.arrayOf(
			departureRaw
		).isRequired,
		error: PropTypes.bool.isRequired,
		loading: PropTypes.bool.isRequired,
	})
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicTransportContainer);