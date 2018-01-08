import React, { Component } from 'react';
import { Link } from 'react-router';
import Rating from './Rating'
import { timeToString, stringToTime, daysOfTheWeek } from '../../utils/index';
import moment from 'moment';

class ResourcesRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dest: {lat: props.resource.address.latitude, lng: props.resource.address.longitude},
      walkTime: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    //TODO: The Link class has a bunch of validations, etc. We should wrap that all in a service and just
    //call that.
    // Location.push("/resource/" + this.props.resource.id);
  }

  getWalkTime(dest, cb) {
    let directionsService = new google.maps.DirectionsService();
    let myLatLng = new google.maps.LatLng(this.props.location.lat, this.props.location.lng);
    let destLatLang = new google.maps.LatLng(dest.lat, dest.lng);
    let preferences = {
      origin: myLatLng,
      destination: destLatLang,
      travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(preferences, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        cb(result.routes[0].legs[0].duration.text);
      }
    });
  }

  getOpenTime(schedule) {
    let date = new Date();
    let day = date.getDay();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let currTime = moment().format("HH:mm").replace(':', '');
    let closingOpeningTimes = {};
    let currDay = days[day];
    let result = { open: false };
    let resource = this.props.resource;

    if (resource.isOpen) {
      return {
        open: true,
        time: timeToString(resource.openUntil),
      };
    }

    schedule.forEach(item => {
      closingOpeningTimes[item.day.replace(/,/g, '')] = {
        open: item.opens_at,
        close: item.closes_at
      };
    });


    let remainingDays = days.splice(day+1);
    remainingDays.some(d => {
      if(closingOpeningTimes[d]) {
        result = {
          open: false,
          time: `${timeToString(closingOpeningTimes[d].open)} ${d}`
        };
        return true;
      }
    });

    if(result.time) return result;

    days.some(d => {
      if(closingOpeningTimes[d]) {
        result =  {
          open: false,
          time: `${timeToString(closingOpeningTimes[d].open)} ${d}`
        };
        return true;
      }
    })

    return result;
  }

  getReview() {
    let placeHolderReviews = [
      "safe and friendly",
      "clean place",
      "great if you can get in",
      "okay",
      "not the best"
    ];

    return placeHolderReviews[Math.floor(Math.random() * placeHolderReviews.length)];
  }

  componentDidMount() {
    var num = this.props.number;
    this.getWalkTime(this.state.dest, (duration) => {
      this.setState({
        walkTime: duration
      });
    });
  }

  render() {
    let categoryId = this.props.categoryId;

    let services = this.props.resource.services;
    let service = this.props.resource.services[0];

    services.forEach(item => {
      item.categories.forEach(category => {
        if(category.id === categoryId) {
          service = item;
        }
      })
    });

    let serviceName = service && service.name;

    let resourceDescription = this.props.resource.long_description ||
          this.props.resource.short_description ||
          (service && service.long_description);
    let hiddenStyle = {visibility: 'hidden'};

    let schedule = this.props.resource.schedule ? this.props.resource.schedule.schedule_days : [];
    let { open, time } = this.getOpenTime(schedule);

    return (
        <li className="results-table-entry">
          <Link to={{ pathname: "resource", query: { id: this.props.resource.id, time: this.state.walkTime } }}>
            <header>
              <div className="entry-details">
                <h4 className="entry-headline">{this.props.number}. {this.props.resource.name}</h4>
                <div className="entry-subhead">
                  <Rating ratings={this.props.resource.ratings} />
                  <p className="entry-distance">{buildAddressCell(this.props.resource.address)} &bull; {this.state.walkTime || "unknown"} walking</p>
                </div>
              </div>
              <img className="entry-photo entry-img" src={buildImgURL(this.props.resource.address)} />
            </header>
            <div className="entry-meta">
              <p className="entry-organization">{serviceName}</p>
              <p className="entry-description">{resourceDescription}</p>
              <p className="entry-hours">{open ? `Open until ${time}` : time ? `Closed` : 'No hours found for this location'}</p>
            </div>
          </Link>
        </li>
    );
  }
}

function buildAddressCell(address) {
  let addressString = "";
  addressString += address.address_1;
  if(address.address_2) {
    addressString += ", " + address.address_2;
  }


  return <span>{addressString}</span>
}

function buildImgURL(address) {
  if(address) {
    let url = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
      address.latitude + "," + address.longitude +
      "&fov=90&heading=235&pitch=10";
    if(CONFIG.GOOGLE_API_KEY) {
      url += '&key=' + CONFIG.GOOGLE_API_KEY;
    }
    return url;
  } else {
    return "http://lorempixel.com/200/200/city/";
  }
}

export default ResourcesRow;
