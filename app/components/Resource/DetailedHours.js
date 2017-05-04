import React, { Component } from 'react';
import { timeToString, sortScheduleDays } from '../../utils/index';

export default class DetailedHours extends Component {
  render() {
    let { schedule } = this.props;
    schedule = sortScheduleDays(schedule);
    let hoursList = schedule.map((item,i) =>
      item.opens_at == 0 && item.closes_at >= 2359 ?
      <div key={i}>{`${item.day}: 24 Hours`}</div> :
      <div key={i}>{`${item.day}: ${timeToString(item.opens_at)} - ${timeToString(item.closes_at)}`}</div>

    );
    return (
      <div>
        {hoursList}
      </div>
    );
  }
}
