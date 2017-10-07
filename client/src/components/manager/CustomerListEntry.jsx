import React from 'react';

const CustomerListEntry = (props) => {
  

  return (
    <div className="row panel-body">
      <div className="col-md-9">
        <h4>{props.queue.customer.name}</h4>
        <p>Contact: {props.queue.customer.mobile}</p>
        {props.queue.customer.email ? <p>Email: {props.queue.customer.email}</p> : null}
        <p>Group Size: {props.queue.size}</p>
        <p>Wait Time: {props.queue.wait} mins</p>
      </div>
      <div className="col-md-3">
        <button className="btn-primary btn-sm" data-dismiss="modal" onClick={() => props.showModal(props.queue)}>Remove</button>
        <button className="btn-success btn-sm" onClick={() => props.notiCustomer(props.queue.id)}>Noti</button>
      </div>
    </div>
  );
};

export default CustomerListEntry;