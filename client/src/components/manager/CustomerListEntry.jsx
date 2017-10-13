import React from 'react';
import { hinge } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const styles = {
  hinge: {
    animation: 'x 2.4s',
    animationName: Radium.keyframes(hinge, 'hinge')
  }
};

class CustomerListEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startTimer: false,
      timer: '',
      runningTimer: false,
      removeTimer: false,
      shouldHide: true,
      shouldHinge: false
    };
    this.handleClick = this.handleClick.bind(this);
    let timer;

  }

  componentDidUpdate() {
    if (this.state.startTimer && !this.state.runningTimer) {
      this.setState({shouldHide: false});
      this.startTimer();
    }

    if (this.state.removeTimer) {
      clearInterval(this.timer);
      this.setState({timer: '', runningTimer: true, removeTimer: false, shouldHide: true});
    }
  }

  handleClick() {
    if (this.state.startTimer) {
      clearInterval(this.timer);
      this.setState({timer: '', startTimer: false, runningTimer: false, shouldHide: true});
    } else {
      this.setState({startTimer: true, shouldHide: false});
      this.startTimer();
      this.props.notiCustomer(this.props.queue.id, this.props.queue.customer);
    }
  }
  
  printTime(ms) {
    let time = ms / 1000;
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    sec = ('0' + sec).slice(-2);
    return min.toString() + ':' + sec.toString();
  }
  
  startTimer() {
    this.setState({runningTimer: true});
    //clearInterval(this.timer);
    let i = 180000;
    this.setState({timer: this.printTime(i)});
    let interval = 1000;
    this.timer = setInterval(() => {
      this.setState({timer: this.printTime(i)});
      if (i > 0) {
        i -= 1000;
      }
    }, interval);
  }

  render() {


    return (
      <StyleRoot>
        <div className="row panel-body" style={this.state.shouldHinge ? styles.hinge : null}>
          <div className="col-md-7">
            <div className="customer-entry-head">
              <h3 className="customer-entry-text">{this.props.queue.customer.name}</h3>
              <p className="customer-entry-text timer">{this.state.timer}</p>
              <div className={this.state.shouldHide ? 'hidden' : 'led-yellow'}></div>
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
      </StyleRoot>
    );
  }
}

export default CustomerListEntry;






