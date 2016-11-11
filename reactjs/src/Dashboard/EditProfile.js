import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Link, IndexLink, browserHistory } from 'react-router'
import template from './EditProfile.rt'
import Constant from '../Constant.js';
import { makeRequest } from '../utils/http'
import $, { JQuery } from 'jquery';
import update from 'react/lib/update';

module.exports = React.createClass({
    propTypes: {
        changeImage: PropTypes.func,
    },
    getInitialState() {
        return {
            photo: {},
            profile: {},

        };
    },
    getProfile(){
         return makeRequest({
            path: 'api/account/profile/',
            success: (data) => {
                this.setState({ profile: data })
            }
        });
    },
    getPhoto(){
        return makeRequest({
            path: 'api/account/change_photo/',
            success: (data) => {
                this.setState({ photo: data })
            }
        });
    },
    componentDidMount() {
        this.getProfile() ,
        this.getPhoto()
    },
    render: template
});
