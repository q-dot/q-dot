import React from 'react';
import ReactDOM from 'react-dom';
import ManagerLogin from './components/managerlogin/ManagerLogin.jsx';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import '../dist/managerlogin/styles.css';

ReactDOM.render((<ManagerLogin />), document.getElementById('login'));
