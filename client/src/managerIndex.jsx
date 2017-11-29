import React from 'react';
import ReactDOM from 'react-dom';
import ManagerApp from './components/manager/ManagerApp.jsx';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../dist/manager/style.css';

ReactDOM.render((<ManagerApp />), document.getElementById('app'));