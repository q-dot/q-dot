import React from 'react';
import CustomerListEntry from './CustomerListEntry.jsx';
import _ from 'lodash';

const CustomerList = (props) => {
  let entries = props.queues ? _.map(props.queues, (queue, index) => {
    return <CustomerListEntry key={index} queue={queue} removeCustomer={props.removeCustomer.bind(this)} notiCustomer={props.notiCustomer.bind(this)}/>;
  }) : <div>Nobody In Queue</div>;

  return (
    <div>
      <h2>Customers in Queue</h2>
      <div className="panel panel-default">
        {entries}
      </div>
    </div>
  );
};

export default CustomerList;