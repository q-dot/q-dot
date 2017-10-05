import React from 'react';

const StatusSwitch = (props) => {
  
  return (
    <div className="nav navbar-nav">
      <a className="active">Status: {props.status === 'Open' ? 'Open' : 'Close'}Queue</a>
      <button type="button" className="btn btn-primary navbar-btn" data-toggle="modal" data-target="#close-queue-warning">{props.status === 'Open' ? 'Close' : 'Open'} Queue</button>

      <div id="close-queue-warning" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h2 className="modal-title"></h2>
            </div>
            <div className="modal-body">
              <p className="warning-content"><b>{props.status === 'Open' ? 'Close' : 'Open'}</b>Queue?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={props.switchStatus.bind(this)} data-dismiss="modal">Confirm</button>
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSwitch;