
import React, { PropTypes } from 'react';
import {AddressInfo, BusinessHours, PhoneNumber, Website, Languages} from './ResourceInfos';
import CommunicationBoxes from './CommunicationBoxes';
import Services from './Services.js';

class Resource extends React.Component {
	constructor() {
		super();
		this.state = {resource: {}};
	}

  loadResourceFromServer() {
    let resourceID = this.props.location.pathname.match(
	/resource\/([^/]+)/)[1];
		let url = '/api/resources/' + resourceID;
		fetch(url).then(r => r.json())
		.then(data => {
			this.setState({resource: data.resource});
		})
		;
	}

	componentDidMount() {
		this.loadResourceFromServer();
	}

	render() {
		return (
      <div className="org-container">
        <article className="org">
          <div className="main-column">
            <section className="org-summary">
              <header>
                <img className="org-img" src="http://lorempixel.com/100/100/city/" />
                <div className="org-info">
                  <h1>{this.state.resource.name}</h1>
                  <h4>Category 1, Category 2, Category 3</h4>
                  <p><AddressInfo addresses={this.state.resource.addresses} /></p>
                </div>
              </header>
              <div className="rating-summary-container">
                <div className="rating-summary excellent">
                  <i className="material-icons">sentiment_very_satisfied</i>
                  <span>{Math.floor(Math.random()*10)%6}/5</span>
                </div>
                <div className="rating-summary-details">
                  <a href="#reviews">12 reviews</a>
                </div>
              </div>
              <div className="org-desc">
                <p>This is an organisation's long description{this.props.description}</p>
              </div>
              <ul className="org-details">
                <BusinessHours schedule_days={this.state.resource.addresses} />
                <PhoneNumber phones={this.state.resource.phones} />
                <Website website={this.state.resource.website} />
                <Languages />
              </ul>
              <div className="org-actions">
                <a href="#" className="button">Make Edits</a>
              </div>
            </section>

            <Services description={this.state.resource.long_description} services={this.state.resource.services}/>
          </div>

          <aside className="org-map">
            <div className="map-container"></div>
          </aside>

        </article>
      </div>
		);
	}
}

// Resource.propTypes = {
//   news: PropTypes.arrayOf(PropTypes.shape({
//     title: PropTypes.string.isRequired,
//     link: PropTypes.string.isRequired,
//     contentSnippet: PropTypes.string,
//   })).isRequired,
// };

export default Resource;

