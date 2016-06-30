import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchResource } from '../actions';

import LoadingIndicator from '../components/LoadingIndicator';
import Resource from '../components/Resource/Resource.js';

class ResourcePage extends React.Component {
  componentWillMount() {
    if (this.props.resource == null) {
      this.props.fetchResource(this.props.resourceId);
    }
  }

  render() {
    if (this.props.resource == null) {
      return <LoadingIndicator />;
    } else {
      return <Resource />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  const resourceId = ownProps.params.id;
  return { resourceId, resource: state.resource };
}

export default connect(
  mapStateToProps,
  { fetchResource }
)(ResourcePage);
