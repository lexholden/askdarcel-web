import React from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';

import * as DataService from '../../utils/DataService';
import { getAuthRequestHeaders } from '../../utils/index';

class ChangeRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = { existingRecord: {}, changeRequestFields: {} };
  }

  componentDidMount() {
    this.retrieveModifiedObject();
    const fields = this.props.changeRequest.field_changes;
    const tempChangeRequestFields = {};
    fields.forEach((field) => {
      tempChangeRequestFields[field.field_name] = field.field_value;
    });

    this.setState({ changeRequestFields: tempChangeRequestFields });
  }

  getExistingValueFromChangeRequest(changeRequest, fieldName, fieldValue) {
    let { resource } = changeRequest;
    switch (changeRequest.type) {
      case 'ResourceChangeRequest':
      case 'AddressChangeRequest':
      case 'PhoneChangeRequest':
        // console.log(resource, changeRequest);
        object = resource.phones.filter(phone => phone.id === changeRequest.object_id)[0];
        break;
      case 'NoteChangeRequest':
        return resource[fieldName] ? resource[fieldName] : false;
      case 'ScheduleDayChangeRequest':
        return 'date change';
      case 'ServiceChangeRequest':
        return resource.services.find(service => service.id === changeRequest.object_id)[fieldName];
      default:
        console.log('Unknown Change Request Type', objectType);
    }
    this.setState({ existingRecord: object });
  }

  findNoteFromServices(services, noteID) {
    for (let i = 0; i < services.length; i++) {
      let notes = services[i].notes;
      for (let j = 0; j < notes.length; j++) {
        let note = notes[j];
        if (note.id === noteID) {
          return note;
        }
      }
    }
  }

  changeFieldValue(key, value) {
    const tempChangeRequestFields = this.state.changeRequestFields;
    tempChangeRequestFields[key] = value;
    this.setState({ changeRequestFields: Object.assign({}, tempChangeRequestFields) });
  }

  getExistingValueFromChangeRequest(changeRequest, fieldName, fieldValue) {
    let { resource } = changeRequest
    switch (changeRequest.type) {
      case 'ResourceChangeRequest':
        return resource[fieldName] ? resource[fieldName] : '[NEW]';
      case 'ServiceChangeRequest':
        return resource.services.find(service => service.id === changeRequest.object_id)[fieldName]
      case 'PhoneChangeRequest':
        // console.log(resource.phones)
        return 'phone';
      default:
        console.log('unknown type', changeRequest, fieldName, fieldValue)
        return 'Some Change';
    }
  }

  renderChangeRequest(changeRequest) {
    return changeRequest.field_changes.map(fieldChange => {
      let { field_name, field_value } = fieldChange
      return (
        <div key={field_name} className="change-wrapper">
          <label htmlFor={field_name}>{field_name.replace(/_/g, ' ')}</label>
          <div key={field_name} className="request-fields">
            <div className="request-entry">
              <TextareaAutosize
                value={field_value}
                onChange={e => this.changeFieldValue(field_name, e.target.value)}
                className="request-cell value"
              ></TextareaAutosize>
            </div>
            <div className="request-entry">
              <p className="request-cell value existing">
                { this.getExistingValueFromChangeRequest(changeRequest, field_name, field_value)}
              </p>
            </div>
          </div>
        </div>
      )
    });
    // const changedFields = [];
    // const existingRecord = this.state.existingRecord;
    // const changeRequestFields = this.state.changeRequestFields;

    // // TODO: existingRecord && existingRecord[field], need to fix this still
    // for (let field in changeRequestFields) {
    //   console.log(field, existingRecord, changeRequestFields)
    //   changedFields.push(
    //     <div key={field} className="change-wrapper">
    //       <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
    //       <div key={field} className="request-fields">
    //         <div className="request-entry">
    //           <TextareaAutosize
    //             value={changeRequestFields[field]}
    //             onChange={e => this.changeFieldValue(field, e.target.value)}
    //             className="request-cell value">
    //           </TextareaAutosize>
    //         </div>
    //         <div className="request-entry">
    //           <p className="request-cell value existing">{existingRecord[field] || '{ NEW }'}</p>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    // return changedFields;
  }

  render() {
    return (
      <div className="change-request">

        <h4>{ this.props.title || '' }</h4>

        <div className="changes">
          {
            this.props.changeRequest.field_changes.map(f => (
              <div key={f.field_name}>
                {this.renderFieldChange(f)}
              </div>
            ))
          }
        </div>

        <div className="actions request-cell btn-group">
          <button onClick={() => this.approve()}>
            <i className="material-icons">done</i>
            Approve
          </button>

          <button onClick={() => this.reject()} className="danger">
            <i className="material-icons">delete</i>
            Reject
          </button>
        </div>
      </div>
    );
  }
}

ChangeRequest.propTypes = {
  actionHandler: PropTypes.func.isRequired,
  changeRequest: PropTypes.object.isRequired,
};

export default ChangeRequest;
