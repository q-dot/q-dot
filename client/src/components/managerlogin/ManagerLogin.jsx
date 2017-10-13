import React from 'react';
import $ from 'jquery';

class ManagerLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      unauthorised: false
    };
  }

  updateInputFields(event, field) {
    if (field === 'username') {
      this.setState({
        username: event.target.value
      });
    } else {
      this.setState({
        password: event.target.value
      });
    }
  }

  submitHandler(event) {
    event.preventDefault();
    var self = this;
    $.ajax({
      url: `/managerlogin?username=${this.state.username}&password=${this.state.password}`,
      method: 'POST',
      success: (data) => {
        self.setState({
          unauthorised: false
        });
        window.location.href = data;
      },
      error: (err) => {
        console.log('failed to load page', err);
      },
      statusCode: {
        401: function() {
          self.setState({
            unauthorised: true
          });
        }
      }
    });
  }

  render() {
    return (
      <div className='container'>
        <form className='form-signin' onSubmit={this.submitHandler.bind(this)}>
          <h2 className='form-signin-heading'>Please sign in</h2>
          <label className='sr-only'>Email address</label>
          <input
            value={this.state.username}
            type='username'
            className='form-control'
            placeholder='username'
            required autoFocus
            onChange={(e) => this.updateInputFields(e, 'username')}
          />
          <label className='sr-only'>Password</label>
          <input
            value={this.state.password}
            type='password'
            className='form-control'
            placeholder='Password'
            required
            onChange={(e) => this.updateInputFields(e, 'password')}
          />
          <button className='btn btn-lg btn-primary btn-block' type='submit'>Sign in</button>
          <br />
          {
            this.state.unauthorised ?
              <div className="alert alert-danger">
              invalid credentials - please try again!
              </div>
              : null
          }
        </form>

      </div>
    );
  }
}

export default ManagerLogin;
