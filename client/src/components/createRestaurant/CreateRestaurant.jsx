import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import ResultList from './ResultList.jsx';

class CreateRestaurant extends React.Component {
  constructor() {
    super();

    this.state = {
      searchQuery: '',
      location: '',
      username: '',
      password: '',
      results: [],
      selectedRestaurant: ''
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.selectRestaurant = this.selectRestaurant.bind(this);
    this.createRestaurant = this.createRestaurant.bind(this);
    // this.createManager = this.createManager.bind(this);
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
    }

    $.ajax(options)
      .then((data) => {
        this.setState({results: data});
        const elem = ReactDOM.findDOMNode(this.refs.searchList);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
      })
      .fail((data) => {console.log(data)});
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
        name: this.state.selectedRestaurant.name,
        address: `${this.state.selectedRestaurant.location.address1}, ${this.state.selectedRestaurant.location.city}, ${this.state.selectedRestaurant.location.state}, ${this.state.selectedRestaurant.location.zip_code}`,
        phone: this.state.selectedRestaurant.phone,
        image: this.state.selectedRestaurant.image_url,
        status: 'Open', // should prob be closed
        'average_wait': 10,
        'total_wait': 10
      }
    }

// TODO: handle serverside too! comment out post to manager endpoint

// divide req.body into rest. data object and manager data
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
          'total_wait': 10
        },
        manager: {
          username: this.state.username,
          password: this.state.password
        }
      }
    }

    $.ajax(options)
      .then((data) => {console.log(data)})
      .fail((data) => {console.log(data)});
  }

  // createManager() {
  //   let options = {
  //     url: '../../manager',
  //     method: 'POST',
  //     data:
  //   }

  //   $.ajax(options)
  //     .then((data) => {console.log(data)})
  //     .fail((data) => {console.log(data)});
  // }

  render() {
    return (
      <div className='form-signin'>
        <h2 className='form-signin-heading'>New Manager:</h2>
        <div>Username: <input className='form-control' type="text" value={this.state.username} onChange={this.handleUsernameChange}/></div>
        <div>Password: <input className='form-control' type="password" value={this.state.password} onChange={this.handlePasswordChange}/></div>

        <h4>Search for your restaurant</h4>
        <div>Restaurant Name: <input className='form-control' type="text" value={this.state.searchQuery} onChange={this.handleQueryChange}/></div>
        <div>Restaurant Location: <input className='form-control' type="text" value={this.state.location} onChange={this.handleLocChange}/></div>
        <button className='btn btn-lg btn-primary btn-block' onClick={this.submitSearch}>Submit</button>
        <div ref='searchList' className='buffer'></div>
          {this.state.results.length > 0 ? <div><ResultList results={this.state.results} select={this.selectRestaurant}/></div>
          : null}
        <div ref='readyButton' className='buffer' />

        {this.state.selectedRestaurant
          ? <button className='btn btn-lg btn-primary btn-block' onClick={this.createRestaurant}>Create Restaurant</button>
          : null}



      </div>
    );
  }
}

export default CreateRestaurant;
