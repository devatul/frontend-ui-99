import React, {Component} from 'react';
import {render} from 'react-dom';
import {browserHistory, Router, Route, Link, Redirect, IndexRoute} from 'react-router';

let App = require('./App'),
    SignIn = require('./Account/SignIn'),
    SignUp = require('./Account/SignUp'),
    PasswordNew = require('./Account/PasswordNew'),
    ResetConfirmation = require('./Account/ResetConfirmation'),
    EmailSend = require('./Account/EmailSend'),
    RecoverPassword = require('./Account/RecoverPassword'),
    Dashboard = require('./Dashboard/Dashboard'),
    OverView = require('./Dashboard/OverView'),
    Profile = require('./Dashboard/Profile'),
    MyTeam = require('./Dashboard/MyTeam'),
    AnomalyDetection = require('./Dashboard/AnomalyDetection'),
    EditProfile = require('./Dashboard/EditProfile'),
    ReviewValidation = require('./Review/ReviewValidation'),
    Review = require('./Review/Review'),
    OrphanReview = require('./Review/OrphanReview'),
    GroupReview = require('./Review/GroupReview'),
    UserAssignment = require('./Review/UserAssignment'),
    ClassificationReview = require('./Review/ClassificationReview'),
    Notification = require('./Dashboard/Notification'),
    DocumentReview = require('./Review/DocumentReview'),
    Insight = require('./Insight/Insight'),
    Identity = require('./Insight/Identity'),
    DataRisk = require('./Insight/DataRisk'),
    DataLoss = require('./Insight/DataLoss'),
    ClassificationCheck = require('./Insight/ClassificationCheck'),
    Admin = require('./Admin/Admin');

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
        <Route path="/Admin" component={Admin}/>


        <Route path="/Review/Review" component={Review}>
          <Route path="/Review/OrphanReview" component={OrphanReview}/>
          <Route path="/Review/GroupReview" component={GroupReview}/>
          <Route path="/Review/UserAssignment" component={UserAssignment}/>
          <Route path="/Review/ClassificationReview" component={ClassificationReview}/>
          <Route path="/Review/DocumentReview" component={DocumentReview}/>
          <Route path="/Review/ReviewValidation" component={ReviewValidation}/>
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
), document.getElementById('root'));