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
        <button className="btn-primary btn-sm" data-toggle="modal" data-target="#remove-warning">Remove</button>
        <button className="btn-success btn-sm" onClick={() => props.notiCustomer(props.queue.id)}>Noti</button>
        <div id="remove-warning" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body">
                <p className="warning-content">Reason to remove from queue?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-warning" data-dismiss="modal" onClick={() => props.removeCustomer(props.queue.id)}>No Show</button>
                <button className="btn btn-success" data-dismiss="modal" onClick={() => props.removeCustomer(props.queue.id)}>Seated</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerListEntry;