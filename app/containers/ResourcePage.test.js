import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';

import ResourcePage from './ResourcePage';
import LoadingIndicator from '../components/LoadingIndicator';
import Resource from '../components/Resource/Resource.js';

describe('ResourcePage', () => {
  var store;

  beforeEach(() => {
    store = configureStore()();
  });

  it('should render a loading indicator if resource is not yet loaded', () => {
    const rendered = mount(<ResourcePage
                           store={store}
                           params={{ id: 42}} />);
    expect(rendered.contains(<LoadingIndicator />)).toEqual(true);
    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0]).toEqual({
      type: 'FETCH_RESOURCE',
      id: 42
    });
  });

  it('should render the resource if the resource is loaded', () => {
    const resource = {
    };
    store = configureStore()({
      resources: {
        byId: {
          42: resource
        }
      }
    });
    const rendered = mount(<ResourcePage
                           store={store}
                           params={{ id: 42}} />);
    expect(rendered.contains(<Resource resource={resource} />)).toEqual(true);
  });
});
