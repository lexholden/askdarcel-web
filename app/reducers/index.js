import { fetchResourceSuccess } from '../actions';
import { loop, Effects } from 'redux-loop';

const resourcesInitialState = { byId: {} };

function doFetchResource(id) {
  return new Promise((resolve) => {
    fetch('/api/resources/' + id)
      .then(r => r.json())
      .then(data => {
        resolve(fetchResourceSuccess());
      });
  }
}

export function resourcesReducer(state = resourcesInitialState, action) {
  switch (action.type) {
  case 'FETCH_RESOURCE':
    return loop(
      state,
      Effects
    );
  case 'FETCH_RESOURCE_SUCCESS':
    return state.merge({
      resources: {
        byId: {
          action.resource.id: action.resource
        }
      }
    })
  default:
    return state;
  }
}
