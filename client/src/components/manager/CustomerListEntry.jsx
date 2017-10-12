import React from 'react';

class CustomerListEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startTimer: false,
      timer: '',
      runningTimer: false,
    };
    this.handleClick = this.handleClick.bind(this);


  }

  componentDidUpdate() {
    if (this.state.startTimer) {
      this.startTimer();
    }
  }

  handleClick() {
    this.startTimer();
    this.props.notiCustomer(this.props.queue.id, this.props.queue.customer);
  }

  startTimer() {
    if (this.state.runningTimer) {
      return;
    } else {
      this.setState({runningTimer: true});
    }
    let maxTime = 180000;

    for (let i = 0; i <= 180000; i += 1000) {
      setTimeout(() => {
        let time = (maxTime - i) / 1000;
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        sec = ('0' + sec).slice(-2);
        let timeStr = min.toString() + ':' + sec.toString();

        this.setState({timer: timeStr});
        
      }, i);
    }
  }

  render() {


    return (
      <div className="row panel-body">
        <div className="col-md-7">
          <div className="customer-entry-head">
            <h3 className="customer-entry-text">{this.props.queue.customer.name}</h3>
            <p className="customer-entry-text timer">{this.state.timer}</p>
            <div className="led-box">
              <div className="led-yellow"></div>
              <p>Yellow LED</p>
            </div>
          </div>
          <div className="row">
            <p className="col-md-6"><i className="fa fa-mobile fa-fw" aria-hidden="true"></i> {this.props.queue.customer.mobile}</p>
            {this.props.queue.customer.email ? <p><i className="fa fa-envelope-o fa-fw" aria-hidden="true"></i> {this.props.queue.customer.email}</p> : null}
          </div>
          <div className="row">
            <p className="col-md-6"><i className="fa fa-users fa-fw" aria-hidden="true"></i> {this.props.queue.size}</p>
            <p><i className="fa fa-clock-o fa-fw" aria-hidden="true"></i> {this.props.queue.wait} mins</p>
          </div>
        </div>
        <div className="col-md-5 row">
          <button className="btn-primary btn-sm entry-button" data-dismiss="modal" onClick={() => this.props.showModal(this.props.queue)}><i className="fa fa-user-times fa-fw" aria-hidden="true"></i>Remove</button>
          <button className="btn-success btn-sm entry-button" onClick={this.handleClick}><i className="fa fa-bullhorn fa-fw" aria-hidden="true"></i>Ready </button>
        </div>
      </div>
    );
  }
}

export default CustomerListEntry;






