import React from 'react';
import CustomerListEntry from './CustomerListEntry.jsx';
import _ from 'lodash';
import $ from 'jquery';
import AddToQueue from './AddToQueue.jsx';

class CustomerList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      modalQueue: undefined
    };
  }

  showModal(queue) {
    this.setState({ modalQueue: queue });
    setTimeout(() => $('#remove-warning').modal('toggle'), 0);
  }

  render() {
    let notiCustomer = this.props.notiCustomer.bind(this);
    let entries = this.props.queues ? _.map(this.props.queues, (queue, index) => {
      return <CustomerListEntry key={index} queue={queue} notiCustomer={notiCustomer} showModal={this.showModal.bind(this)}/>;
    }) : <div>Nobody In Queue</div>;
    
    let removeCustomer = () => this.props.removeCustomer(this.state.modalQueue.id);
    return (
      <div>
        <h3 className="customer-list-head">Customers in Queue</h3>
        <AddToQueue addCustomer={props.addCustomer.bind(this)}/>
        <div className="panel panel-default">
          {entries}
        </div>
        { this.state.modalQueue
          ? <div id="remove-warning" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h2 className="modal-title">Statement</h2>
                </div>
                <div className="modal-body">
                  <p className="warning-content"><b>Remove</b> Customer: {this.state.modalQueue.customer.name} In Queue</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-warning" data-dismiss="modal" onClick={removeCustomer}>No Show</button>
                  <button className="btn btn-success" data-dismiss="modal" onClick={removeCustomer}>Seated</button>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          : []
        }
      </div>
    );
  }

}

export default CustomerList;