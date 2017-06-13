import React from 'react';
import ChangeRequest from './ChangeRequest';
import * as ChangeRequestTypes from './ChangeRequestTypes';
import ProposedService from './ProposedService';
import Actions from './Actions';
import * as _ from 'lodash/fp/object';

class ChangeRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceToCollapsed: {}
    };
    this.props.changeRequests.forEach((changeRequest) => {
      let resourceID = changeRequest.resource.id;
      this.state.resourceToCollapsed[resourceID] = true;
    });
    this.props.services.forEach((service) => {
      let resourceID = service.resource.id;
      this.state.resourceToCollapsed[resourceID] = true;
    });

  }

  toggleCollapsed(resourceID) {
    let resourceToCollapsed = _.extend({}, this.state.resourceToCollapsed);
    resourceToCollapsed[resourceID] ^= true;
    this.setState({
      resourceToCollapsed: resourceToCollapsed
    });
  }

  render() {
    return (
      <div className="change-requests">
        <h1 className="page-title">{`Change Requests (${this.props.changeRequests.length})`}</h1>
        {this.renderChangeRequests(this.props.changeRequests, this.props.services, this.props.actionHandler)}
      </div>
    );
  }

  renderChangeRequests(changeRequests, services, actionHandler) {
    let resourceToChangeRequests = {};
    let resourceObjects = {};
    let changeRequestWrappers = [];
    changeRequests.forEach((changeRequest) => {
      let resourceID = changeRequest.resource.id;

      if (!resourceToChangeRequests.hasOwnProperty(resourceID)) {
        resourceToChangeRequests[resourceID] = [];
      }

      resourceToChangeRequests[resourceID].push(changeRequest);
      resourceObjects[resourceID] = changeRequest.resource;
    });

    let resourceToServices = {};
    services.forEach((service) => {
      let resourceID = service.resource.id;
      if (!resourceToServices.hasOwnProperty(resourceID)) {
        resourceToServices[resourceID] = [];
      }
      resourceToServices[resourceID].push(service);
      resourceObjects[resourceID] = service.resource;
    });

    for (let resourceID in resourceObjects) {
      let collapsed = this.state.resourceToCollapsed[resourceID] ? "collapsed" : "";
      changeRequestWrappers.push(
        <div key={resourceID} className={`group-container ${collapsed}`}>
          <h2 onClick={() => this.toggleCollapsed(resourceID)}>
            {resourceObjects[resourceID].name}
            <span className={`material-icons expander ${collapsed} right`}>expand_less</span>
          </h2>
          <div className={`group-content ${collapsed}`}>
            {renderProposedServices(resourceToServices[resourceID], actionHandler)}
            {renderIndividualRequests(resourceToChangeRequests[resourceID], actionHandler)}
          </div>
        </div>
      );
    }

    return changeRequestWrappers;
  }
}

function renderProposedServices(services, actionHandler) {
  if (!services) {
    return;
  }
  return services.map((service) => {
    return (
      <div key={'svc'+service.id}>
        <p>Proposed Service</p>
        <div className="request-container">
          <ProposedService service={service} actionHandler={actionHandler} />
        </div>
      </div>
    );
  });
}

function renderIndividualRequests(changeRequests, actionHandler) {
  if (!changeRequests) { return; }
  let resourceInfoToRender = [];
  let requestsToRender = [];
  changeRequests.forEach((changeRequest) => {
    switch (changeRequest.type) {
      case 'ResourceChangeRequest':
        resourceInfoToRender.push(
          <div key={'cr'+changeRequest.id}>
            { renderRequestWrapper(changeRequest, actionHandler) }
          </div>
        )
        break;
      default:
        requestsToRender.push(
          <div key={'cr'+changeRequest.id}>
            <p>{changeRequest.type}</p>
            { renderRequestWrapper(changeRequest, actionHandler) }
          </div>
        )
    }
  });

  return resourceInfoToRender.concat(requestsToRender);
}

function renderRequestWrapper(changeRequest, actionHandler) {
  return (
    <div className="request-container">
      <ChangeRequest changeRequest={changeRequest} actionHandler={actionHandler} />
    </div>
  )
}

export default ChangeRequests;
