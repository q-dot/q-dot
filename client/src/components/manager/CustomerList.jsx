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
    this.entries = [];
  }

  componentWillReceiveProps(newProps) {
    if (newProps.queueId) {
      this.initiateTimer(newProps.queueId);
    }
  }

  initiateTimer(queueId) {
    for (let i in this.entries) {
      if (!this.entries[i]) {
        continue;
      }
      if (this.entries[i].props.queue.id === queueId) {
        this.entries[i].setState({startTimer: true});
      }
    }
    this.entries = [];
  }

  showModal(queue) {
    this.setState({ modalQueue: queue });
    // everytime the state changed, modal needs to initialize.
    // so put the modal toggle in the next runloop of modal initialize
    setTimeout(() => $('#remove-warning').modal('toggle'), 0);
  }

  render() {
    let notiCustomer = this.props.notiCustomer.bind(this);
    let entries = this.props.queues ? _.map(this.props.queues, (queue, index) => {
      return <CustomerListEntry ref={queue => {
        if (queue) {
          this.entries.push(queue);
        }
      }} timer={false} key={index} queue={queue} notiCustomer={notiCustomer} showModal={this.showModal.bind(this)}/>;
    }) : <div>Nobody In Queue</div>;
    
    let removeCustomer = () => {

      for (let i in this.entries) {
        if (!this.entries[i]) {
          continue;
        }
        if (this.entries[i].props.queue.id === this.state.modalQueue.id) {
          this.entries[i].setState({removeTimer: true, shouldHinge: true});
        }
      }
      setTimeout(() => {   
        this.props.removeCustomer(this.state.modalQueue.id);
        this.entries = [];
      }, 2500);
    };
    return (
      <div>
        <div className="row">
          <h3 className="customer-list-head col-md-8">Customers in Queue</h3>
          <AddToQueue className="col-md-4" addCustomer={this.props.addCustomer.bind(this)}/>
        </div>
     
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
                  <p className="warning-content"><b>Remove {this.state.modalQueue.customer.name}</b> From Queue?</p>
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