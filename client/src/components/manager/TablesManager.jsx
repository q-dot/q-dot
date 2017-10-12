import React from 'react';

class TablesManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.selectCustomer = this.selectCustomer.bind(this);
  }

  selectCustomer(size) {
    let intSize = parseInt(size.target.value);
    let queues = this.props.queues;

    for (let i in queues) {
      if (queues[i].size <= intSize) {
        console.log('next customer is ', queues[i]);
        this.props.notiCustomer(queues[i].id, queues[i].customer);
        break;
      }
    }
  }

  render () {
    return (
      <div>
        <h3>Select Table Size Available</h3>
        <div className="panel panel-default">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>2-Seats</th>
                  <th>4-Seats</th>
                  <th>8-Seats</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><button value="2" className="btn-success btn-sm" onClick={(value) => this.selectCustomer(value)}>2</button></td>
                  <td><button value="4" className="btn-success btn-sm" onClick={(value) => this.selectCustomer(value)}>4</button></td>
                  <td><button value="8" className="btn-success btn-sm" onClick={(value) => this.selectCustomer(value)}>8</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default TablesManager;
