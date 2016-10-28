import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, Redirect, IndexRoute  } from 'react-router'
var App = require('./App');
var SignIn = require('./Account/SignIn');
var SignUp = require('./Account/SignUp');
var PasswordNew = require('./Account/PasswordNew');
var ResetConfirmation = require('./Account/ResetConfirmation');
var EmailSend = require('./Account/EmailSend');
var RecoverPassword = require('./Account/RecoverPassword');
var Dashboard = require('./Dashboard/Dashboard');
var OverView = require('./Dashboard/OverView');
var Profile = require('./Dashboard/Profile');
var MyTeam = require('./Dashboard/MyTeam');
var AnomalyDetection = require('./Dashboard/AnomalyDetection');
var EditProfile = require('./Dashboard/EditProfile');
var ReviewValidation = require('./Review/ReviewValidation');
var Review = require('./Review/Review');
var OrphanReview = require('./Review/OrphanReview');
var GroupReview = require('./Review/GroupReview');
var UserAssignment = require('./Review/UserAssignment');
var ClassificationReview = require('./Review/ClassificationReview');
var ReviewStatus = require('./Review/ReviewStatus');
var Notification = require('./Dashboard/Notification');
var DocumentReview = require('./Review/DocumentReview');
var Insight = require('./Insight/Insight');
var Identity = require('./Insight/Identity');
var DataRisk = require('./Insight/DataRisk');
var DataLoss = require('./Insight/DataLoss');
var ClassificationCheck = require('./Insight/ClassificationCheck');
var Admin = require('./Admin/Admin')

render((
  	<Router history={browserHistory}>
    	<Route path="/" component={App}>
		  	<Route path="/Account/signIn" component={SignIn}/>
		  	<Route path="/Account/signUp" component={SignUp}/>
		  	<Route path="/Account/passwordNew" component={PasswordNew}/>
		  	<Route path="/Account/resetConfirmation" component={ResetConfirmation}/>
		  	<Route path="/Account/emailSend" component={EmailSend}/>
	  		<Route path="/Account/recoverPassword" component={RecoverPassword}/>
		  	<Route path="/Dashboard/Dashboard" component={Dashboard}>
		  		<Route path="/Dashboard/Notification" component={Notification}/>
			  	<Route path="/Dashboard/OverView" component={OverView}/>
				<Route path="/Dashboard/Profile" component={Profile}/>
				<Route path="/Dashboard/MyTeam" component={MyTeam}/>
				<Route path="/Dashboard/EditProfile" component={EditProfile}/>
				<Route path="/AnomalyDetection" component={AnomalyDetection}/>
				<Route path="/Admin" component={Admin} />


				<Route path="/Review/Review" component={Review}>
					<Route path="/Review/OrphanReview" component={OrphanReview}/>
					<Route path="/Review/GroupReview" component={GroupReview}/>
					<Route path="/Review/UserAssignment" component={UserAssignment}/>
					<Route path="/Review/ClassificationReview" component={ClassificationReview}/>
					<Route path="/Review/DocumentReview" component={DocumentReview}/>
					<Route path="/Review/ReviewValidation" component={ReviewValidation}/>
                    <Route path="/Review/ReviewStatus" component={ReviewStatus}/>
				</Route>
				<Route path="/Insight/Insight" component={Insight}>
					<Route path="/Insight/Identity" component={Identity}/>
					<Route path="/Insight/DataRisk" component={DataRisk}/>
					<Route path="/Insight/DataLoss" component={DataLoss}/>
                    <Route path="/Insight/ClassificationCheck" component={ClassificationCheck}/>
				</Route>
	  		</Route>
    	</Route>
  	</Router>
), document.getElementById('root'))
