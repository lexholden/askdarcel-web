import React from 'react';

class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      change_requests: [],
      changeRequestsLoaded: false,
      pendingServicesLoaded: false,
    };
  }

  componentDidMount() {
    this.getChangeRequests();
    this.getPendingServices();
  }

  getPendingServices() {
    dataService.get('/api/services/pending', getAuthRequestHeaders()).then((json) => {
      this.setState({
        services: json.services,
        pendingServicesLoaded: true,
      });
    });
  }

  getChangeRequests() {
    dataService.get('/api/change_requests', getAuthRequestHeaders())
      .then((json) => {
        this.setState({
          change_requests: json.change_requests,
          changeRequestsLoaded: true,
        });
      })
      .catch((err) => {
        console.log('wrong', err)
      });
  }

  bulkActionHandler(action, changeRequests) {
    return Promise.all(
      changeRequests.map((changeRequest) => { // Create an action handler for each CR
        const changeRequestFields = changeRequest.field_changes.reduce((a, c) => {
          if (a[c.field_name] !== undefined) {
            console.warn('Discarding duplicate field name in action handler: ', { current: a[c.field_name], duplicate: c });
            return a;
          }

          a[c.field_name] = c.field_value;
          return a;
        }, {});

        return this.actionHandler(changeRequest.id, action, changeRequestFields);
      }),
    );
  }

  // bulkActionHandler(action, changeRequests) {
  //   return Promise.all(
  //     changeRequests.map((changeRequest) => { // Create an action handler for each CR
  //       const changeRequestFields = changeRequest.field_changes.reduce((a, c) => {
  //         if (a[c.field_name] !== undefined) {
  //           console.warn('Discarding duplicate field name in action handler: ', { current: a[c.field_name], duplicate: c });
  //           return a;
  //         }

  //         a[c.field_name] = c.field_value;
  //         return a;
  //       }, {});

  removeChangeRequest(changeRequestID) {
    this.setState({
      change_requests: this.state.changeRequests
        .filter(changeRequest => changeRequest.id !== changeRequestID),
    });
  }

  removeService(serviceID) {
    this.setState({
      services: this.state.services.filter(service => service.id !== serviceID),
    });
  }

  render() {
    // console.log(this.state.change_requests)
    return (!(this.state.pendingServicesLoaded && this.state.changeRequestsLoaded)
      ? <Loader />
      : <div className="admin">
        <ChangeRequests
          changeRequests={this.state.change_requests}
          services={this.state.services}
          bulkActionHandler={this.bulkActionHandler}
          actionHandler={this.actionHandler} />
      </div>
    );
  }
}

export default Admin;
