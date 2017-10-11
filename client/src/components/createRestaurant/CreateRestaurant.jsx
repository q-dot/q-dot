import React from 'react';
import $ from 'jquery';

class CreateRestaurant extends React.Component {
  constructor() {
    super();

    this.state = {
      searchQuery: '',
      location: '',
      username: '',
      password: ''
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  handleQueryChange(e) {
    this.setState({searchQuery: e.target.value});
    console.log(this.state.searchQuery);
  }

  handleLocChange(e) {
    this.setState({location: e.target.value});
    console.log(this.state.location);
  }

  submitSearch(e) {
    let options = {
      url: '../../yelp',
      data: JSON.stringify({
        query: this.state.searchQuery
      })
    }

    $.ajax(options)
      .then((data) => {console.log(data)})
      .fail((data) => {console.log(data)});
  }

  render() {
    return (
      <div>
        Restaurant Name: <input type="text" value={this.state.searchQuery} onChange={this.handleQueryChange}/>
        Restaurant Location: <input type="text" value={this.state.location} onChange={this.handleLocChange}/>
        <button onClick={this.submitSearch}>Submit</button> 
      </div>
    );
  }
}

export default CreateRestaurant;