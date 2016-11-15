import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './SignUp.rt'
import $ from 'jquery'
import { assignIn } from 'lodash';
import validate from 'jquery-validation';
import Constant from '../Constant.js';
import { registration } from '../utils/function'

var SignUp = React.createClass({
    getInitialState() {
        return {
            messageUnAgree: '',
            messageEqual: '',
            agree: false,
            equal_pass: false,
            data: [],
            data_submit: {},
            check: false,
        };
    },
    getValueInput(event, name) {
        let datas = _.cloneDeep(this.state.data),
            data_submit = _.cloneDeep(this.state.data_submit),
            value = typeof event === 'string' ? event : event.target.value;
        data_submit = _.assignIn(data_submit, {
                [name]: value,
            }),
            this.setState({ data: datas, data_submit: data_submit })
    },
    agreeChange(event) {
        this.setState({ agree: event.target.checked });
        event.target.checked ?  this.setState({ messageUnAgree: '' }) :  false;
    },
    checkEqualPass(event) {
        let value = event.target.value
        if (this.state.data_submit) {
            this.state.data_submit.password == value ? this.setState({ messageEqual: "" , equal_pass : true}) : this.setState({ messageEqual: "Please enter the same value again", equal_pass : false })
        }
    },
    submitHandler() {
        if (this.state.check) {
            this.setState({ check: false })
        } else {
            this.setState({ check: true })
        }
        if (this.state.equal_pass) {
            this.setState({ messageEqual: ""})
            if (_.size(this.state.data_submit) == 6) {
                if (this.state.agree) {
                    this.setState({ messageUnAgree: "" });
                    return registration({
                        path: Constant.urls.REGISTRATION,
                        params: JSON.stringify(this.state.data_submit),
                        success: (data) => {
                            browserHistory.push('/Account/SignIn');
                        },
                        error: (xhr) => {}
                    });
                } else {
                    this.setState({ messageUnAgree: "Please accept our policy" });
                }

            }
        } else {
            this.setState({ messageEqual: "Please enter the same value again" })
        }
    },
    componentDidMount() {
        /*this.validate();*/
    },

    render: template
});

module.exports = SignUp;
