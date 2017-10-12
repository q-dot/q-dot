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
      userAddress: '',
      restaurantAddress: '',
      currentCustomer: {
        restaurant: {
          name: ''
        }
      },
      ready: false
    };
    // socket initialize
    this.socket = io();
    // dynamically update if table is ready
    this.socket.on('noti', (message) => {
      console.log(message);
      window.alert(message);
      this.playReadySound();
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
        //console.log('successfully grabbed queue data for customer', data);
        console.log('this is the data: ', data);
        //this.googeldirections();
        this.setState({ 
          currentCustomer: data, 
          userAddress: data.address,
          restaurantAddress: data.restaurant.address
        });
        // report queueId to server socket
        this.socket.emit('customer report', id);

      },
      error: (error) => {
        console.log('failed to grab queue data for customer', error);
      }
    });
  }


  clickedBack() {
    $.get({
      url: '/redirect',
      success: () => {
        window.location.href = '/customer';
      }
    });
  }  

  componentDidMount() {
    this.getCurrentCustomerId();
  }

  render() {
    return (
      <div className="customer-queue-info-container">
        <CustomerBanner customer={this.state.currentCustomer}/>
        <div className="queue-body">
          <h5>YOUR QUEUE NUMBER IS</h5>
          {
            this.state.ready
              ? <div><a href="/customer"><h3 className="ready-noti" onClick={this.clickedBack}>Your table is ready!</h3></a></div>
              : <div className="queue-position-display">
                <span className="position-number">{this.state.currentCustomer.position}</span>
                <h6>your approximate wait time is:</h6>
                <span className="wait-time-indicator">{this.state.currentCustomer.wait}</span>
                <p className="groups-in-front-indicator">There are currently {this.state.currentCustomer.queueInFrontCount} groups in front of you</p>
              </div>
          }
        </div>  
        <div className="queue-map">  
          <br/>
          <br/>
          <MapContainer user={this.state.userAddress} restaurat={this.state.restaurantAddress}/>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>  
      </div>
    );
  }
}

export default QueueInfo;

