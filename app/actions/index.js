export function fetchResource(id) {
  return {
    type: 'FETCH_RESOURCE',
    id: id
  };
};

export function fetchResourceSuccess(resource) {
  return {
    type: 'FETCH_RESOURCE_SUCCESS',
    resource: resource
  };
};

export function fetchResourceFailure(error) {
  return {
    type: 'FETCH_RESOURCE_ERROR',
    error: error
  };
};
