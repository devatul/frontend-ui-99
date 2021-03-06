import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import template from './SignIn.rt';
import { assignIn, isNull } from 'lodash';
import Constant from '../App/Constant.js';
import { setTokenAuth, setVerifyToken } from '../utils/function'

var Signin = React.createClass({
    getInitialState() {
        return {
            err: '',
            data: {},
            is_Error_400: false
        };
    },

    getValueInput(event) {
        let datas = _.cloneDeep(this.state.data),
            value = event.target.type == 'checkbox' ? event.target.checked : event.target.value.trim();

        datas = _.assignIn(datas, {
            [event.target.name]: value });

        this.setState({ data: datas })
    },

    handleSubmit(e) {
        e.preventDefault();
        let data = this.state.data ;
        if(!_.isNull(data)){
            return setTokenAuth({
                timeout: 15000,
                params : JSON.stringify({
                        username: this.state.data.username,
                        password: this.state.data.password
                    }),
                success: (data) => {
                    sessionStorage.setItem('token', data.token);
                    browserHistory.push('/Dashboard/OverView');
                },
                error: (xhr) => {
                    if (xhr.status === 400) {
                        this.setState({ err: Constant.messagesError_SignIn.ERROR_400, is_Error_400: true });
                    } else if (xhr.status >= 500 && xhr.status <= 599) {
                        this.setState({ err: Constant.messagesError_SignIn.ERROR_500_599 });
                    } else {
                        this.setState({ err: Constant.messagesError_SignIn.ERROR_ });
                    }
                }
            });
        }
    },

    componentDidMount() {
    },

  componentWillMount() {
    let token = sessionStorage.getItem('token');
    if (token != undefined)
      setVerifyToken({
        timeout: 5000,
        params : JSON.stringify({
          token: token,
        }),
        success: (data) => {
          browserHistory.push('/Dashboard/OverView');
        },
        error: (xhr) => {
        }
      });
  },

    render: template
});

module.exports = Signin;
