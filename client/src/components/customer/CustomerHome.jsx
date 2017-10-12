import React from 'react';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import SelectedRestaurant from './SelectedRestaurant.jsx';
import RestaurantCard from './RestaurantCard.jsx';
import $ from 'jquery';
import { Link } from 'react-router-dom';

class CustomerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRestaurant: false,
      currentRestaurant: {},
      restaurantList: []
    };
  }

  componentDidMount() {
    this.getRestaurantList();
  }

  getRestaurantList() {
    $.ajax({
      method: 'GET',
      url: '/restaurants',
      success: (data) => {
        console.log('successfully grabbed restaurant data', data); 
        this.setState({ restaurantList: data });
      },
      failure: (error) => {
        console.log('failed to grab restaurant data', error);
      }
    });
  }

  render() {
    return (
      <div className="customer-home">
        <CustomerBanner />
        <div className="select-restaurant-container">
          <h4>Help me queue up at...</h4>
          {this.state.restaurantList.map(restaurant => {
            return (
              <div key={restaurant.id}>
                <Link to={`/restaurant/${restaurant.name}/${restaurant.id}`}><RestaurantCard restaurant={restaurant}/></Link>
              </div>
            )
          }
          )}
        </div>
      </div>
    );
  }

}

export default CustomerHome;

