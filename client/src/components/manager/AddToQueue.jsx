import React from 'react';

class AddToQueue extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      email: '',
      size: ''
    };
  }

  addToQueue () {
    let queueInfo = {
      name: this.state.name,
      mobile: this.state.mobile,
      size: this.state.size
    };

    if (this.state.email) {
      queueInfo.email = this.state.email;
    }
    this.resetValues();
    this.props.addCustomer(queueInfo);
  }

  getName (e) {
    this.setState({name: e.target.value});
  }

  getMobile (e) {
    this.setState({mobile: e.target.value});
  }

  getEmail (e) {
    this.setState({email: e.target.value});
  }

  getSize (e) {
    this.setState({size: e.target.value});
  }

  resetValues () {
    this.state.name = '';
    this.state.mobile = '';
    this.state.size = '';
    this.state.email = '';
  }

  render () {
    return (
      <div>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#add-to-queue"><i className="fa fa-plus fa-fw" aria-hidden="true"></i>  Add To Queue</button>
        <div id="add-to-queue" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h2 className="modal-title">Customer Info</h2>
              </div>
              <div className="modal-body">
                <label>Name: 
                  <input type="text" placeholder="name.." value={this.state.name} onChange={this.getName.bind(this)}/>
                </label>
                <label>Mobile: 
                  <input type="text" placeholder="mobile number.."value={this.state.mobile} onChange={this.getMobile.bind(this)}/>
                </label>
                <label>Email: 
                  <input type="text" placeholder="email.." value={this.state.email} onChange={this.getEmail.bind(this)}/>
                </label>
                <label>Size: 
                  <input type="text" placeholder="size of group.." value={this.state.size} onChange={this.getSize.bind(this)}/>
                </label>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" data-dismiss="modal" onClick={this.addToQueue.bind(this)}>Add</button>
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.resetValues}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddToQueue;