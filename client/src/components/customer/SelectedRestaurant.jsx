import React from 'react';
import RestaurantLogoBanner from './RestaurantLogoBanner.jsx';
import CustomerInfoForm from './CustomerInfoForm.jsx';
import QueueInfo from './QueueInfo.jsx';
import RestaurantInformation from './RestaurantInformation.jsx';
import { Link } from 'react-router-dom';

class SelectedRestaurant extends React.Component {
  constructor(props) {
    super(props);
    this.customerInfoSubmitted = this.customerInfoSubmitted.bind(this);
    this.state = {
      currentRestaurant: {queues: [], status: 'Open'},
      infoSubmitted: false,
      queueId: 0,
      queuePosition: 0,
      ready: false
    };
  }

  componentDidMount() {
    this.getRestaurant();
  }

  getRestaurant() {
    let windowUrl = window.location.href;
    let id = windowUrl.slice(windowUrl.lastIndexOf('/') + 1);

    $.ajax({
      method: 'GET',
      url: `/restaurants?restaurantId=${id}`,
      success: (data) => {
        this.setState({ currentRestaurant: data });
        if (data.status !== 'Open') {
          window.alert('This restaurant\'s queue is closed!');
          window.location.replace('/customer');
        }
      },
      error: (error) => {
        console.log('failed to grab current restaurant data', error);
      }
    });
  }

  customerInfoSubmitted(id, position) {
    this.setState({
      infoSubmitted: true,
      queueId: id,
      queuePosition: position
    });
  }

  render() {
    const restaurantImg = {
      backgroundImage: `url(${this.state.currentRestaurant.image})`
    };

    return (
      <div className="selected-restaurant">
        <RestaurantLogoBanner style={restaurantImg} />
        <RestaurantInformation restaurant={this.state.currentRestaurant}/>
        <CustomerInfoForm restStatus={this.state.currentRestaurant.status} customerInfoSubmitted={this.customerInfoSubmitted}/>
      </div>
    );
  }
}

export default SelectedRestaurant;
