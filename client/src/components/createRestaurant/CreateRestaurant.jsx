import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import ResultList from './ResultList.jsx';
import SubNav from '../customer/subNavBar.jsx';

class CreateRestaurant extends React.Component {
  constructor() {
    super();

    this.state = {
      searchQuery: '',
      location: '',
      username: '',
      password: '',
      results: [],
      selectedRestaurant: {name: '', location: {address1: '', city: ''}}
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.selectRestaurant = this.selectRestaurant.bind(this);
    this.createRestaurant = this.createRestaurant.bind(this);
  }

  handleQueryChange(e) {
    this.setState({searchQuery: e.target.value});
  }

  handleLocChange(e) {
    this.setState({location: e.target.value});
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  submitSearch(e) {
    let options = {
      url: '../../yelp',
      method: 'POST',
      data: {
        query: this.state.searchQuery,
        location: this.state.location
      }
    };

    $.ajax(options)
      .then((data) => {
        this.setState({results: data});
      })
      .fail((data) => { console.log(data); });
  }

  selectRestaurant(index) {
    this.setState({
      selectedRestaurant: this.state.results[index]
    }, () => {
      console.log(this.state.selectedRestaurant);
      setTimeout(() => {
        const elem = ReactDOM.findDOMNode(this.refs.readyButton);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  createRestaurant(index) {
    let options = {
      url: '../../restaurants',
      method: 'POST',
      data: {
        restaurant: {
          name: this.state.selectedRestaurant.name,
          address: `${this.state.selectedRestaurant.location.address1}, ${this.state.selectedRestaurant.location.city}, ${this.state.selectedRestaurant.location.state}, ${this.state.selectedRestaurant.location.zip_code}`,
          phone: this.state.selectedRestaurant.phone,
          image: this.state.selectedRestaurant.image_url,
          status: 'Open', // should prob be closed
          'average_wait': 10,
          'total_wait': 10,
          open: this.state.selectedRestaurant.hours
        },
        manager: {
          username: this.state.username,
          password: this.state.password
        }
      }
    };

    $.ajax(options)
      .then((data) => {
        window.location.href = '/managerlogin';
      })
      .fail((data) => { console.log(data); });
  }

  render() {
    return (
      <div>
        <SubNav/>
        <div className='createPaneContainer'>
          <div className='innerPane fixedPane'>
            <h2 className='form-signin-heading'>New Manager:</h2>
            <div>Username: <input className='form-control' type="text" value={this.state.username} onChange={this.handleUsernameChange}/></div>
            <div>Password: <input className='form-control' type="password" value={this.state.password} onChange={this.handlePasswordChange}/></div>

            <h4>Search for your restaurant</h4>
            <div>Restaurant Name: <input className='form-control' type="text" value={this.state.searchQuery} onChange={this.handleQueryChange}/></div>
            <div>Restaurant Location: <input className='form-control' type="text" value={this.state.location} onChange={this.handleLocChange}/></div>
            <div className='buffer'></div>
            <button className='btn btn-lg btn-primary btn-block' onClick={this.submitSearch}>Submit</button>
            <br/>
            <div className='horLine' />
            <br/>
            {this.state.selectedRestaurant.name !== ''
              ? <div>
                <h4>Selected:</h4>
                <div className='restaurant-thumbnail' style={{backgroundImage: `url(${this.state.selectedRestaurant.image_url})`}}>
                </div>
                {this.state.selectedRestaurant.name}<br />
                <span className='address'>{this.state.selectedRestaurant.location.address1}, {this.state.selectedRestaurant.location.city}</span>
              </div>
              : null}
          </div>
          <div className='innerPane'>

            <div ref='searchList'></div>
            {this.state.results.length > 0 ? <div><ResultList results={this.state.results} select={this.selectRestaurant}/></div>
              : null}
            <div ref='readyButton' className='buffer' />

            {this.state.selectedRestaurant.name !== ''
              ? <button className='btn btn-lg btn-primary btn-block' onClick={this.createRestaurant}>Create Restaurant</button>
              : null}
          </div>
        </div>
      </div>  
    );
  }
}

export default CreateRestaurant;
