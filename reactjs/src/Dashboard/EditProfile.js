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
    changePhoto: function() {
        $.ajax({
            url: Constant.SERVER_API + 'api/account/change_photo/',
            dataType: 'json',
            type: 'PUT',
            data: {

            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                console.log("ChangePass: ", data);
            }.bind(this),
            error: function(xhr, status, error) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },

    componentWillMount() {
        $.ajax({
            url: Constant.SERVER_API + 'api/account/profile/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {

                this.setState({ profile: data });

                console.log("scan result: ", data);
            }.bind(this),
            error: function(xhr, status, error) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
        $.ajax({
            url: Constant.SERVER_API + 'api/account/change_photo/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {

                this.setState({ photo: data });

                console.log("photo: ", photo);
            }.bind(this),
            error: function(xhr, status, error) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },

    componentDidMount() {
    },
    render: template
});
