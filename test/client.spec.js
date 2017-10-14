import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import { expect } from 'chai';

import ManagerApp from '../client/src/components/manager/ManagerApp.jsx';

describe('<ManagerApp/>', function () {
  it('should render TablesManager', function () {
    const wrapper = Enzyme.shallow(<ManagerApp/>);
    expect(wrapper.find('TablesManager')).to.have.length(1);
  });

  // it('should have props for email and src', function () {
  //   const wrapper = shallow(<Avatar/>);
  //   expect(wrapper.props().email).to.be.defined;
  //   expect(wrapper.props().src).to.be.defined;
  // });
});