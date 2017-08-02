import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import ChangeRequest from '../ChangeRequest';

describe('checks that a change request renders correctly', () => {
  it('checks for cheese', () => {
    const el = React.createElement(ChangeRequest, {
      actionHandler: () => {},
      changeRequest: {},
    });
  });
});
