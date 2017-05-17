import React, { Component } from 'react';
import DetailedHours from './DetailedHours';
import { timeToString, daysOfTheWeek, buildHoursText} from '../../utils/index';

export default class Hours extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetailedHours: false,
    };

    this.toggleDetailedHours = this.toggleDetailedHours.bind(this);
  }

  toggleDetailedHours() {
    this.setState({ showDetailedHours: !this.state.showDetailedHours });
  }
  render() {
    let { schedule } = this.props;
    let { showDetailedHours } = this.state;

    return (
      <li className="hours">
        <i className="material-icons">schedule</i>
          <div className="current-hours" onClick={this.toggleDetailedHours}>
            <p>{buildHoursText(schedule)}</p>
            <span>{showDetailedHours ?
              <i className="material-icons">keyboard_arrow_up</i> :
              <i className="material-icons">keyboard_arrow_down</i>}</span>
          </div>
          <div className="weekly-hours">
            {showDetailedHours ? <DetailedHours schedule={schedule} /> : null}
          </div>
      </li>
    );
  }
}
