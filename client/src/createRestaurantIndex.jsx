import React from 'react';
import ReactDOM from 'react-dom';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import '../dist/createRestaurant/styles.css';
import CreateRestaurant from './components/createRestaurant/CreateRestaurant.jsx';

ReactDOM.render((<CreateRestaurant />), document.getElementById('app'));
//
