import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import SignupPage from './components/SignupPage/SignupPage';
import LoginPage from './components/LoginPage/LoginPage';
import HomePage from './components/HomePage/HomePage';
import FindPercentChangePage from './components/FindPercentChangePage/FindPercentChangePage';
import GetTargetPricePage from './components/GetTargetPricePage/GetTargetPricePage';
import CalculateRoiPage from './components/CalculateRoiPage/CalculateRoiPage';
import WalletPage from './components/WalletPage/WalletPage';
import NewEntryTradePage from './components/NewEntryTradePage/NewEntryTradePage';
import EntryTradeLogPage from './components/EntryTradeLogPage/EntryTradeLogPage';
import ExitTradeLogPage from './components/ExitTradeLogPage/ExitTradeLogPage';

// If there is a valid token, automatically set headers with Auth bearer token for axios requests
if (localStorage.getItem('id_token')) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('id_token')}`;
};

ReactDOM.render(
    <Router>
        <Route exact path='/' component={App} />
        <Route exact path='/signup' component={SignupPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/home' component={HomePage} />
        <Route exact path='/find-percent-change' component={FindPercentChangePage} />
        <Route exact path='/get-target-price' component={GetTargetPricePage} />
        <Route exact path='/calculate-roi' component={CalculateRoiPage} />
        <Route exact path='/wallet' component={WalletPage} />
        <Route exact path='/new-entry-trade' component={NewEntryTradePage} />
        <Route exact path='/entry-trades' component={EntryTradeLogPage} />
        <Route exact path='/exit-trades' component={ExitTradeLogPage} />
    </Router>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
