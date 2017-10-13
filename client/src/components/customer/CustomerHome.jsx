import React from 'react';
import ReactDOM from 'react-dom';

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
      error: (error) => {
        console.log('failed to grab restaurant data', error);
      }
    });
  }

  render() {
    return (
      <div className="customer-home" ref="top">
        <CustomerBanner />
        <div className="select-restaurant-container">
          <h4>Help me queue up at...</h4>
          <div style={{textAlign: 'center'}}>
            <input type="text" placeholder="Filter..." style={{width: '60%', textAlign: 'center'}}></input>
          </div>
          {this.state.restaurantList.map(restaurant => {
            return (
              <div key={restaurant.id}>
                <Link to={`/restaurant/${restaurant.name}/${restaurant.id}`}><RestaurantCard restaurant={restaurant}/></Link>
              </div>
            )
          }
          )}
          <button className='btn btn-lg btn-primary btn-block' style={{margin: 'auto'}} onClick={() => {
            const elem = ReactDOM.findDOMNode(this.refs.top);
            if (elem) {
              elem.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
          }}>Back to Top</button>
        </div>
      </div>
    );
  }

}

export default CustomerHome;
