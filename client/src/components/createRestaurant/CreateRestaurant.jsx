import React from 'react';
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
      results: []
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  handleQueryChange(e) {
    this.setState({searchQuery: e.target.value});
  }

  handleLocChange(e) {
    this.setState({location: e.target.value});
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
      .then((data) => {this.setState({results: data})})
      .fail((data) => {console.log(data)});
  }

  render() {
    return (
      <div>
        Restaurant Name: <input type="text" value={this.state.searchQuery} onChange={this.handleQueryChange}/>
        Restaurant Location: <input type="text" value={this.state.location} onChange={this.handleLocChange}/>
        <button onClick={this.submitSearch}>Submit</button> 
         {this.state.results.length > 0 ? <ResultList results={this.state.results}/> : null}  

      </div>
    );
  }
}

export default CreateRestaurant;