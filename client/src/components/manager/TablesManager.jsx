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
        <h3>Tables Manager</h3>
        <div className="panel panel-default">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>2-Seat</th>
                  <th>4-Seat</th>
                  <th>8-Seat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>{this.state.tables['2']}</td>
                  <td>{this.state.tables['4']}</td>
                  <td>{this.state.tables['8']}</td>
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
