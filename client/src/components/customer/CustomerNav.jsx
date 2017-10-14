import React from 'react';

// nav bar
const CustomerNav = () => (
  <div className="customer-nav-bar">
    <ul className="nav-content">
      <li className="nav-li-right"><a className="waves-effect waves-light btn" href="/">Home</a></li>
      <li className="nav-li"><a className="waves-effect waves-light btn" href="../manager">Restaurant Manager</a></li>
      <li className="nav-li"><a className="waves-effect waves-light btn" href="../createrestaurant">Add a Restaurant</a></li>
    </ul>
  </div>
);

export default CustomerNav;

