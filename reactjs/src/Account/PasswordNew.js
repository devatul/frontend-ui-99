import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import template from './PasswordNew.rt';
import $ from 'jquery'
import { setTokenAuth } from '../utils/function'

var PasswordNew = React.createClass({
  getInitialState() {
    return {
      password: '',
    };
  },

  passwordChange(event) {
    this.setState({password: event.target.value});
  },

  componentDidMount() {
    $(function () {
      jQuery("#submitForm").validate({
        focusInvalid: false,
        rules: {
          password: {
            required: true,
            minlength: 6
          },
          pwd_confirm: {
            required: true,
            equalTo: "#password"
          },
        },
        // Specify the validation error messages
        messages: {
          password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 6 characters long"
          },
          pwd_confirm: {
            required: "Please enter the same value again"
          },
        },
	        submitHandler(form) 
	        {
            setTokenAuth({
              params: {},
              success: function(data) {
                  browserHistory.push('/Account/resetConfirmation');
              }.bind(this),
              error: function(xhr, status, err) {			      		
                $('#err').text("Wrong ");
                browserHistory.push('/Account/resetConfirmation');
              }.bind(this)
            });

            return false;
          }
	    	});
	    });
  	},

  	render: template

});

module.exports = PasswordNew;