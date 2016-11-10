import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import template from './SignUp.rt';
import $ from 'jquery';
import {assignIn} from 'lodash';
import validate from 'jquery-validation';
import Constant from '../Constant.js';

var SignUp = React.createClass({
  getInitialState() {
    return {
      messageUnAgree: '',
      agree: '',
      data: {}
    };
  },

  getValueInput(event) {
    let datas = _.cloneDeep(this.state.data),
        value = event.target.type == 'checkbox' ? event.target.checked : event.target.value.trim();

    datas = _.assignIn(datas, {
      [event.target.name]: value
    });

    this.setState({data: datas})
  },

  agreeChange(event) {
    this.setState({agree: event.target.checked});

    if (this.state.agree) {
      this.setState({messageUnAgree: "Please accept our policy"});
    } else {
      this.setState({messageUnAgree: ""});
    }
  },

  validate() {
    $('#submitForm').validate({
      // Specify the validation rules
      errorElement: 'span',
      focusInvalid: false,
      rules: {
        userName: {
          required: true,
          minlength: 6
        },
        password: {
          required: true,
          minlength: 6
        },
        pwd_confirm: {
          required: true,
          equalTo: "#password"
        },
        first_name: {
          required: true
        },
        last_name: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        company: {
          required: true
        },
        agree: "required"
      },
      // Specify the validation error messages
      messages: {
        userName: {
          required: "Please enter your user name",
          minlength: "Your userName must be at least 6 characters long"
        },
        first_name: "Please enter your first name",
        last_name: "Please enter your last name",
        password: {
          required: "Please provide a password",
          minlength: "Your password must be at least 6 characters long"
        },
        pwd_confirm: {
          required: "Please enter the same value again"
        },
        email: "Please enter a valid email address",
        company: "Please enter your company name",
        agree: "Please accept our policy"
      },
      submitHandler: function () {
        return makeRequest({
          path: 'api/account/registration/',
          method: 'POST',
          params: JSON.stringify(this.state.data),
          success: (data) => {
            browserHistory.push('/Account/SignIn');
          },
          error: (xhr) => {
            /*var jsonResponse = JSON.parse(xhr.responseText);
             if (xhr.status === 400) {
             if (jsonResponse.email) {
             $("#emailExits").text(jsonResponse.email);
             $("#email").addClass('error');
             }
             if (jsonResponse.username) {
             $("#usernameExits").text(jsonResponse.username);
             $("#userName").addClass('error');
             }
             }*/
          }
        });
      }.bind(this)
    });
  },

  componentDidMount() {
    this.validate();
  },

  render: template
});

module.exports = SignUp;
