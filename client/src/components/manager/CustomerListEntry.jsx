import React from 'react';

const CustomerListEntry = (props) => {
  return (
    <div className="row panel-body">
      <div className="col-md-7">
        <h3 className="customer-entry-title">{props.queue.customer.name}</h3>
        <div className="row">
          <p className="col-md-6"><i className="fa fa-mobile fa-fw" aria-hidden="true"></i> {props.queue.customer.mobile}</p>
          {props.queue.customer.email ? <p><i className="fa fa-envelope-o fa-fw" aria-hidden="true"></i> {props.queue.customer.email}</p> : null}
        </div>
        <div className="row">
          <p className="col-md-6"><i className="fa fa-users fa-fw" aria-hidden="true"></i> {props.queue.size}</p>
          <p><i className="fa fa-clock-o fa-fw" aria-hidden="true"></i> {props.queue.wait} mins</p>
        </div>
      </div>
      <div className="col-md-5 row">
        <button className="btn-primary btn-sm entry-button" data-dismiss="modal" onClick={() => props.showModal(props.queue)}><i className="fa fa-user-times fa-fw" aria-hidden="true"></i>Remove</button>
        <button className="btn-success btn-sm entry-button" onClick={() => props.notiCustomer(props.queue.id, props.queue.customer)}><i className="fa fa-bullhorn fa-fw" aria-hidden="true"></i>Ready </button>
      </div>
    </div>
  );
};

export default CustomerListEntry;
