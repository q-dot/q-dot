import React from 'react';
import $ from 'jquery';

class CreateRestaurant extends React.Component {
  constructor() {
    super();

    this.state = {
      searchQuery: '',
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  handleChange(e) {
    this.setState({searchQuery: e.target.value});
    console.log(this.state.searchQuery);
  }

  submitSearch(e) {
    let options = {
      url: '../../yelp',
      data: JSON.stringify({
        query: this.state.searchQuery
      })
    }

    console.log(options.url);

    $.ajax(options)
      .then((data) => {console.log(data)})
      .fail((data) => {console.log(data)});
  }



  render() {
    return (
      <div>
        Restaurant Name: <input type="text" value={this.state.searchQuery} onChange={this.handleChange}/>
        <button onClick={this.submitSearch}>Submit</button> 
      </div>
    );
  }
}

export default CreateRestaurant;