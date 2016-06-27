import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, Redirect } from 'react-router'
var App = require('./App');
var SignIn = require('./Account/SignIn');
var SignUp = require('./Account/SignUp');
var PasswordNew = require('./Account/PasswordNew');
var ResetConfirmation = require('./Account/ResetConfirmation');
var EmailSend = require('./Account/EmailSend');
var RecoverPassword = require('./Account/RecoverPassword');
var Dashboard = require('./Dashboard/Dashboard');
var DashboardIndex = require('./Dashboard/DashboardIndex');
var OverView = require('./Dashboard/OverView');
var Review = require('./Dashboard/Review');
var Admin = require('./Dashboard/Admin');
var Profile = require('./Dashboard/Profile');
var EditProfile = require('./Dashboard/EditProfile');

render((
  	<Router history={browserHistory}>
    	<Route path="/" component={App}>
		  	<Route path="/Account/signIn" component={SignIn} />
		  	<Route path="/Account/signUp" component={SignUp} />
		  	<Route path="/Account/passwordNew" component={PasswordNew} />
		  	<Route path="/Account/resetConfirmation" component={ResetConfirmation} />
		  	<Route path="/Account/emailSend" component={EmailSend} />
	  		<Route path="/Account/recoverPassword" component={RecoverPassword} />
		  	<Route path="/Dashboard/Dashboard" component={Dashboard}>
			  	<Route path="/Dashboard/DashboardIndex" component={DashboardIndex} />
			  	<Route path="/Dashboard/OverView" component={OverView} />
				<Route path="/Dashboard/Review" component={Review} />
				<Route path="/Dashboard/Admin" component={Admin} />
				<Route path="/Dashboard/Profile" component={Profile} />
				<Route path="/Dashboard/EditProfile" component={EditProfile} />
	  		</Route>
    	</Route>
  	</Router>
), document.getElementById('root'))
