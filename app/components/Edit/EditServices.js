import React, { Component } from 'react';
import Loader from '../Loader';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import { createTemplateSchedule } from '../../utils/index';
import MultiSelectDropdown from './MultiSelectDropdown';

class EditServices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      services: {},
      existingServices: props.services ? props.services.map((service) => {
        let newService = service;
        newService.key = service.id;
        return newService;
      }) : [],
      uuid: -1
    };

    this.renderServices = this.renderServices.bind(this);
    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.addService = this.addService.bind(this);
  }

  handleServiceChange(key, service) {
    let services = this.state.services;
    services[key] = service;
    this.setState({
      services: services
    }, function() {
      this.props.handleServiceChange(this.state);
    });
  }

  addService() {
    let existingServices = this.state.existingServices;
    let newUUID = this.state.uuid - 1;
    existingServices.unshift({
      key: newUUID,
      notes: [],
      schedule: {
        schedule_days: createTemplateSchedule()
      }
    });
    this.setState({ existingServices: existingServices, uuid: newUUID });
  }

  renderServices() {
    let servicesArray = [];

    for (let i = 0; i < this.state.existingServices.length; i++) {
      let service = this.state.existingServices[i];
      servicesArray.push(
        <EditService key={service.key} index={i} service={service} handleChange={this.handleServiceChange} handleDeactivation={this.props.handleDeactivation}/>
      );
    }

    return servicesArray;
  }

  render() {
    return (
      <li className="edit--section--list--item">
			<button className="edit--section--list--item--button" onClick={this.addService}><i className="material-icons">add_box</i>Add Service</button>
				<ul className="edit--section--list--item--sublist edit--service--list">
					{this.renderServices()}
				</ul>
			</li>
    );
  }
}

class EditService extends Component {
	constructor(props) {
		super(props);
		this.state = {
			service: {}
		};
		this.handleFieldChange = this.handleFieldChange.bind(this);
		this.handleNotesChange = this.handleNotesChange.bind(this);
		this.handleScheduleChange = this.handleScheduleChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.renderCategories = this.renderCategories.bind(this);
    this.handleElgibilityChange = this.handleElgibilityChange.bind(this);
	}

	handleFieldChange(e) {
		let service = this.state.service;
		service[e.target.dataset.field] = e.target.value;
		this.setState({service: service});
		this.props.handleChange(this.props.service.key, service);
	}

	handleNotesChange(notesObj) {
		let service = this.state.service;
		service.notesObj = notesObj;
		this.setState({service: service});
		this.props.handleChange(this.props.service.key, service);
	}

	handleScheduleChange(scheduleObj) {
		let service = this.state.service;
		service.scheduleObj = scheduleObj;
		this.setState({service: service});
		this.props.handleChange(this.props.service.key, service);
	}

	handleCategoryChange(categories) {
		let service = this.state.service;
		service.categories = categories;
		this.setState({service: service}, () => {
			this.props.handleChange(this.props.service.key, service);
		});
	}
  handleElgibilityChange(eligibilities) {
    let service = this.state.service;
    service.eligibilities = eligibilities;
    this.setState({service: service}, () => {
      this.props.handleChange(this.props.service.key, service);
    });
  }
	renderCategories() {
		if(this.props.service.key < 0) {
			return (<CategoriesDropdown handleCategoryChange={this.handleCategoryChange}/>);
		}
	}

	render() {
    let serviceId = this.props.service.id;

		return (
			<li className="edit--service edit--section">
				<header className="edit--section--header">
      		<h4>Service {this.props.index+1}: {this.props.service.name}</h4>
      	</header>

				<ul className="edit--section--list">
					<li className="edit--section--list--item">
						<label>Service name</label>
						<input placeholder='Name' data-field='name' defaultValue={this.props.service.name} onChange={this.handleFieldChange} />
					</li>

					<li key="email" className="edit--section--list--item email">
						<label>Service E-Mail</label>
						<input type="email" defaultValue={this.props.service.email} data-field='email' onChange={this.handleFieldChange}/>
					</li>

					<li className="edit--section--list--item">
						<label>Service description</label>
						<textarea placeholder='Description' data-field='long_description' defaultValue={this.props.service.long_description} onChange={this.handleFieldChange} />
					</li>

					<li className="edit--section--list--item">
						<label>How do you apply for this service</label>
						<textarea placeholder='Application Process' data-field='application_process' defaultValue={this.props.service.application_process} onChange={this.handleFieldChange} />
					</li>

					<li className="edit--section--list--item">
						<label>Old Elgibility (not editable)</label>
						<textarea disabled placeholder='Please use the Eligibility field below' data-field='eligibility' defaultValue={this.props.service.eligibility} onChange={this.handleFieldChange} />
            <MultiSelectDropdown
              selectedItems={this.props.service.eligibilities}
              handleSelectChange={this.handleElgibilityChange}
              label={"Elgibility"}
              optionsRoute={"eligibilities"}
            />
					</li>

					<li className="edit--section--list--item">
						<label>How much does this service cost</label>
						<input placeholder='Fee' data-field='fee' defaultValue={this.props.service.fee} onChange={this.handleFieldChange} />
					</li>

					<li className="edit--section--list--item">
						<label>What documents do you need to bring to apply</label>
						<textarea placeholder='Required Documents' data-field='required_documents' defaultValue={this.props.service.required_documents} onChange={this.handleFieldChange} />
					</li>

					<EditSchedule schedule={this.props.service.schedule} handleScheduleChange={this.handleScheduleChange} />

					<EditNotes notes={this.props.service.notes} handleNotesChange={this.handleNotesChange} />

					<MultiSelectDropdown 
            selectedItems={this.props.service.categories}
            handleSelectChange={this.handleCategoryChange}
            label={"Categories"}
            optionsRoute={"categories"}
          />
          <li className="edit--section--list--item">
            <button
              className="edit--section--list--item"
              id="service--deactivation"
              disabled={this.state.submitting}
              onClick={() => this.props.handleDeactivation('service', serviceId)}>
              Deactivate
            </button>
          </li>
				</ul>
			</li>
    );
  }
}

export default EditServices;
