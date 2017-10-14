import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import MapContainer from './MapContainer.jsx';
import $ from 'jquery';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';


class QueueInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poly: '',
      distance: '',
      duration: '',
      userAddress: '',
      restaurantAddress: '',
      currentCustomer: {
        restaurant: {
          name: ''
        }
      },
      ready: false,
      timer: ''
    };
    this.socket = io();
    this.socket.on('noti', (message) => {
      window.alert(message);
      this.playReadySound();
      this.startTimer();
      this.setState({ ready: true });
    });

    this.getCurrentCustomerId = this.getCurrentCustomerId.bind(this);
  }

  playReadySound() {
    let audio = new Audio('./Table-ready.mp3');
    audio.play();
  }


  getCurrentCustomerId() {
    // CAUTION!!!! any changes in url structure will break this
    let windowUrl = window.location.href;
    let id = windowUrl.slice(windowUrl.lastIndexOf('=') + 1);


    $.ajax({
      method: 'GET',
      url: `/queues?queueId=${id}`,
      success: (data) => {
        this.setState({
          currentCustomer: data,
          userAddress: data.address,
          restaurantAddress: data.restaurant.address
        });
        this.socket.emit('customer report', id);

      },
      error: (error) => {
        console.log('failed to grab queue data for customer', error);
      }
    });
  }


  clickedBack() {
    $.get({
      url: '/endsession',
      success: () => {
        window.location.href = '/customer';
      }
    });
  }

  componentDidMount() {
    this.getCurrentCustomerId();
  }

  startTimer() {
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

  printTime(ms) {
    let time = ms / 1000;
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    sec = ('0' + sec).slice(-2);
    return min.toString() + ':' + sec.toString();
  }

  render() {
    return (
      <div className="customer-queue-info-container">
        <CustomerBanner customer={this.state.currentCustomer}/>
        <div className="divider"/>
        <div className="row">
          <div className="col s6">
            <h5>YOUR QUEUE NUMBER IS</h5>
            {
              this.state.ready
                ? <div>
                  <a href="/customer">
                    <h3 className="ready-noti" onClick={this.clickedBack}>Your table is ready!</h3>
                  </a>
                  <h3>{this.state.timer}</h3>
                </div>
                : <div className="queue-position-display">
                  <span className="position-number">{this.state.currentCustomer.position}</span>
                  <h6>your approximate wait time is:</h6>
                  <span className="wait-time-indicator">{this.state.currentCustomer.wait}</span>
                  <p className="groups-in-front-indicator">There are currently {this.state.currentCustomer.queueInFrontCount} groups in front of you</p>
                </div>
            }
          </div>
          <div className="col s6">
            <MapContainer user={this.state.currentCustomer.address} restaurant={this.state.currentCustomer.restaurant.address}/>
          </div>
        </div>
      </div>
    );
  }
}

export default QueueInfo;
