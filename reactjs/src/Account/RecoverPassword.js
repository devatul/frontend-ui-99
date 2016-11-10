import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import template from './RecoverPassword.rt';
import $ from 'jquery';

var RecoverPassword = React.createClass({
  getInitialState() {
    return {
      userName: '',
      err: ''
    };
  },

  userNameChange(event) {
    this.setState({userName: event.target.value});
  },

  componentDidMount() {
    $(function () {
      jQuery("#submitForm").validate({
        focusInvalid: false,
        rules: {
          userName: {
            required: true
          }
        },
        // Specify the validation error messages
        messages: {
          userName: {
            required: "Please enter your email address or windows login"
          }
        },
        submitHandler(form) {
          $.ajax({
            type: "POST",
            url: 'http://54.169.106.24/api-token-auth/',
            dataType: 'json',
            data: {},
            success: function (data) {
              browserHistory.push('/Dashboard/OverView');
            }.bind(this),
            error: function (xhr, status, err) {
              $('#err').text("Wrong email address or windows login");
              $('#userName').addClass('has-error');
              browserHistory.push('/Account/passwordNew');
            }.bind(this)
          });

          return false;
        }
      });
    })
  },

  render: template
});

module.exports = RecoverPassword;
