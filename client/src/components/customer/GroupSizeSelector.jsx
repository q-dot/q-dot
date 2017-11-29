import React from 'react';

class GroupSizeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.getGroupSize = this.getGroupSize.bind(this);
    this.state = {
      currentGroupSize: 'Select your group size'
    };
  }

  getGroupSize(event) {
    let size = parseInt(event.target.value);

    this.setState({
      currentGroupSize: size
    });

    this.props.getGroupSize(size);
  }

  render() {
    return (
      <div className="customer-group-selector-container">
        <div className="select-wrapper">
          <select className="browser-default" value={this.state.currentGroupSize} onChange={this.getGroupSize} required>
            <option value="Select your group size" disabled>Select group size</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>
    );
  }
}

export default GroupSizeSelector;
// <div className="customer-group-buttons">
// <a className="waves-effect waves-light btn-large"><i className="material-icons left">person</i>solo</a>
// <a className="waves-effect waves-light btn-large"><i className="material-icons left">people</i>2</a>
// <a className="waves-effect waves-light btn-large"><i className="material-icons left">people</i>3 - 4</a>
// <a className="waves-effect waves-light btn-large"><i className="material-icons left">person_add</i>5 +</a>