import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, Redirect, IndexRoute  } from 'react-router'

var path = require('path');
var Admin = require('./Admin/Admin');
var AdvancedAnalytics = require('./Insight/AdvancedAnalytics');
var AnomalyDetection = require('./Dashboard/AnomalyDetection');
var App = require('./App/App');
var ClassificationCheck = require('./Insight/ClassificationCheck');
var ClassificationReview = require('./Review/ClassificationReview');
var Dashboard = require('./Dashboard/Dashboard');
var DataLoss = require('./Insight/DataLoss');
var DataRisk = require('./Insight/DataRisk');
var DocumentReview = require('./Review/DocumentReview');
var EditProfile = require('./Dashboard/EditProfile');
var EmailSend = require('./Account/EmailSend');
var GroupReview = require('./Review/GroupReview');
var Identity = require('./Insight/Identity');
var Insight = require('./Insight/Insight');
var MyTeam = require('./Dashboard/MyTeam');
var Notification = require('./Dashboard/Notification');
var OrphanReview = require('./Review/OrphanReview');
var OverView = require('./Dashboard/OverView');
var PasswordNew = require('./Account/PasswordNew');
var Profile = require('./Dashboard/Profile');
var RecoverPassword = require('./Account/RecoverPassword');
var ResetConfirmation = require('./Account/ResetConfirmation');
var Review = require('./Review/Review');
var ReviewStatus = require('./Review/ReviewStatus');
var ReviewValidation = require('./Review/ReviewValidation');
var SignIn = require('./Account/SignIn');
var SignUp = require('./Account/SignUp');
var UserAssignment = require('./Review/UserAssignment');


/**
 * Import CSS files in oder to concat and minify css files using Webpack
 */
// Web Font
require("../assets/stylesheets/font/dathena.css");

// Head Libs
require("../assets/vendor/bootstrap/css/bootstrap.css");
require("../assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.css");
require("../assets/vendor/bootstrap-multiselect/bootstrap-multiselect.css");
//require("../assets/stylesheets/sass/pages/_reviewer.scss");
//require("../assets/stylesheets/sass/theme-custom.scss");
// require("../assets/stylesheets/sass/pages/_exception.css");
require("../assets/vendor/font-awesome/css/font-awesome.css");
require("../assets/vendor/select2/css/select2.min.css");
require("../assets/vendor/bootstrap-toggle-master/css/bootstrap-toggle.min.css");
require("../assets/vendor/jqcloud/jqcloud.css");
require("../assets/stylesheets/theme.css");

// Skin CSS
require("../assets/stylesheets/skins/default.css")

// Theme Custom CSS
require("../assets/stylesheets/theme-custom.css")

// My CSS Fix
require("../assets/stylesheets/dathena-reactjs.css")
require("../assets/stylesheets/style-dathena.css")
require("../assets/stylesheets/style_reactjs.css")
require("../assets/stylesheets/my_profile.css")

/**
 * Rooter
 */
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
              <Route path="/Insight/AdvancedAnalytics" component={AdvancedAnalytics}/>
            </Route>
          </Route>
        </Route>
      </Router>
      ), document.getElementById('root'))

      if (module.hot) {
        module.hot.accept();
      }
