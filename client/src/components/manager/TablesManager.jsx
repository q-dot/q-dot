import React from 'react';

class TablesManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auditHistory: [],
      modalClear: false,
      tables: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      // console.log(nextProps);
      // var b = nextProps.replace(/'/g, '"');
      // console.log(b);
      let tables = JSON.parse(nextProps.tables);
      console.log(tables);
      this.setState({tables: tables}, () => {

        console.log(this.state.tables);
      });
    }
  }

  getAuditHistory() {
    var self = this;
    $.ajax({
      url: '/manager/history',
      method: 'GET',
      success: function(data) {
        self.setState({
          auditHistory: data
        });
      },
      failure: function(err) {
        console.log(err);
      }
    });
  }

  clearAuditHistory() {
    var self = this;
    $.ajax({
      url: '/manager/history',
      method: 'DELETE',
      success: function(data) {
        console.log(data);
        self.setState({
          auditHistory: []
        });
      },
      failure: function(err) {
        console.log(err);
      }
    });
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
                  <th>#</th>
                  <th>2-Seats</th>
                  <th>4-Seats</th>
                  <th>8-Seats</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td><button className="btn-success btn-sm">2</button></td>
                  <td><button className="btn-success btn-sm">4</button></td>
                  <td><button className="btn-success btn-sm">8</button></td>
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
