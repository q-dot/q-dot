import React from 'react';


// nav bar
const CustomerBanner = (props) => {

  let welcomeMessage;
  let queueMessage;
  (props.customer) ? welcomeMessage = `Welcome back, ${props.customer.name}!` : welcomeMessage = 'Welcome!';
  (props.customer) ? queueMessage = <p className="restaurant-queued-at">You are currently queued at {props.customer.restaurant.name.toUpperCase()}</p> : queueMessage = null;

  let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  let d = new Date();

  let currDate = d.getDate();
  let currMonth = d.getMonth();
  let dateNow = (currDate + ' ' + months[currMonth]);

  return (
    <div>
      <div className="gradient-banner-container">
        <div className="banner-content">
          <p className="banner-title">{welcomeMessage}</p>
          {queueMessage}
        </div>
        <div className="date-container">
          <p className="date-info">Today is {dateNow}</p>
        </div>
      </div>
    </div>  
  );
};

export default CustomerBanner;
