import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import { expect } from 'chai';
import sinon from 'sinon';

import ManagerApp from '../client/src/components/manager/ManagerApp.jsx';

sinon.spy(ManagerApp.prototype, 'componentDidMount');

describe('<ManagerApp/>', function () {

  // needs to be called first! calls once for each shallow test also
  it('calls componentDidMount once', () => {
    const wrapper = Enzyme.mount(<ManagerApp />);
    expect(ManagerApp.prototype.componentDidMount.calledOnce).to.equal(true);
  });
  it('should render TablesManager', function () {
    const wrapper = Enzyme.shallow(<ManagerApp/>);
    expect(wrapper.find('TablesManager')).to.have.length(1);
  });
});