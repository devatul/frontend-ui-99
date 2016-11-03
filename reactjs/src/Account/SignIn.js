import React, {Component} from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router'
import template from './SignIn.rt';
import Constant from '../Constant.js';
import javascript from '../script/javascript.js';
import 'jquery';

var Signin = React.createClass({
  getInitialState() {
    return {
      email: '',
      password: '',
      isRemember: false,
      err: ''
    };
  },

  emailChange(event) {
    this.setState({email: event.target.value});
  },

  passwordChange(event) {
    this.setState({password: event.target.value});
  },

  isRememberChange(event) {
    this.setState({isRemember: event.target.checked});
  },

  handleSubmit(e) {
    e.preventDefault();

    let email = this.state.email.trim(), //'root@dathena.io';//
        password = this.state.password.trim(); //'dathenaiscool';//

    if (email.length <= 0 || password.length <= 0) {
      console.log('please wrote some text');
      return;
    }

    $.ajax({
      url: Constant.SERVER_API + 'api/token/api-token-auth/',
      dataType: 'json',
      type: 'POST',
      timeout: 15000,
      data: {
        username: email,
        password: password
      },
      success: function (data) {
        sessionStorage.setItem('token', data.token);
        browserHistory.push('/Dashboard/OverView');
      }.bind(this),
      error: function (xhr) {
        if(xhr.status === 400) {
          this.setState({err: "The username and password you entered don't match"});
          $('#password').addClass("has-error");
          $('#username').addClass("has-error");
        } else if(xhr.status >= 500 && xhr.status <= 599) {
          this.setState({err: "Connection failed. Please retry later."});
        } else {
          this.setState({err: "An error occurred"});
        }
      }.bind(this)
    });

    // this.serverRequest = $.post('http://54.251.148.133/api/token/api-token-auth/', function (result) {
    // 	let lastGist = result[0];
    //
    // 	this.setState({
    // 		username: lastGist.owner.login,
    // 		lastGistUrl: lastGist.html_url
    // 	});
    // }.bind(this));
  },

  componentDidMount() {
    console.log("token");

    // $(function () {
    //   jQuery("#signIn").validate({
    //     // Specify the validation rules
    //     rules: {
    //       username: {
    //         required: true,
    //         minlength: 6
    //       },
    //       password: {
    //         required: true,
    //         minlength: 6
    //       }
    //     },
    //     // Specify the validation error messages
    //     messages: {
    //       userName: {
    //         required: "Please enter your user name",
    //         minlength: "Your userName must be at least 6 characters long"
    //       },
    //
    //       password: {
    //         required: "Please provide a password",
    //         minlength: "Your password must be at least 6 characters long"
    //       }
    //     },
    //     submitHandler(form) {
    //       $.ajax({
    //         url: 'http://54.169.106.24/api-token-auth/',
    //         dataType: 'json',
    //         type: 'POST',
    //         data: {
    //           email: this.state.email,
    //           password: this.state.password
    //         },
    //         success: function (data) {
    //           if (this.state.isRemember) {
    //             sessionStorage.setItem('token', data.token);
    //           }
    //           browserHistory.push('/Dashboard/OverView');
    //         }.bind(this),
    //         error: function (xhr, status, err) {
    //           this.setState({err: 'Wrong username or password'});
    //           $('#pwd').addClass("has-error");
    //           $('#username').addClass("has-error");
    //           console.log(err);
    //         }.bind(this)
    //       });
    //       return false;
    //     }
    //   });
    // });
  },

  componentWillMount(){
  },

  render: template
});

module.exports = Signin;
