import React from 'react';
import ReactDOM from 'react-dom';
import CustomerNav from './CustomerNav.jsx';
import CustomerBanner from './CustomerBanner.jsx';
import SelectedRestaurant from './SelectedRestaurant.jsx';
import RestaurantCard from './RestaurantCard.jsx';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import $ from 'jquery';
import './lib/jquery-ui.min.css';
import './lib/jquery-ui.min.js';

class CustomerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRestaurant: false,
      currentRestaurant: {},
      restaurantList: [],
      filteredList: [],
      filter: ''
    };

    this.updateFilteredList = _.debounce(this.updateFilteredList, 800);
  }

  componentDidMount() {
    this.getRestaurantList();
  }

  componentWillUnmount() {
    $('#filterBar').autocomplete('destroy');
  }

  applyAutocomplete(data) {
    let restaurantList = data.map((ele) => {
      return ele.name;
    });
    let self = this;
    $(function() {
      var availableTags = restaurantList;
      $('#filterBar').autocomplete({
        source: availableTags,
        select: (event, ui) => {
          self.state.filter = ui.item.value;
          self.updateFilteredList();
        }
      });
    });
  }

  getRestaurantList() {
    $.ajax({
      method: 'GET',
      url: '/restaurants',
      success: (data) => {
        console.log('successfully grabbed restaurant data', data);
        this.state.filteredList = data;
        this.setState({ restaurantList: data });
        this.applyAutocomplete(data);
      },
      error: (error) => {
        console.log('failed to grab restaurant data', error);
      }
    });
  }

  updateFilter (e) {
    this.setState({filter: e.target.value});
  }

  updateFilteredList () {
    if (this.state.filter === '') {
      this.setState({filteredList: this.state.restaurantList});
      return;
    }
    this.setState({filteredList: this.state.restaurantList.filter((ele) => {
      //return true to signify match if a regex match !== null?
      return (ele.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1);
    })});
  }

  render() {
    return (
      <div className="customer-home" ref="top">
        <CustomerBanner />
        <div className="select-restaurant-container">
          <h4>Help me queue up at...</h4>
          <div style={{textAlign: 'center'}}>
            <input id="filterBar" type="text" placeholder="Filter..." onChange={(event) => {
              this.updateFilter(event);
              this.updateFilteredList();
            }} style={{width: '60%', textAlign: 'center'}}></input>
          </div>
          {this.state.filteredList.map(restaurant => {
            return (
              <div key={restaurant.id}>
                <Link to={`/restaurant/${restaurant.name}/${restaurant.id}`}><RestaurantCard restaurant={restaurant}/></Link>
              </div>
            );
          }
          )}
          <button className='btn btn-lg btn-primary btn-block' style={{margin: 'auto', marginTop: '50px'}} onClick={() => {
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
