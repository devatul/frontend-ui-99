import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Dashboard.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'
import Constant from '../Constant.js';
//const ACTIVE = {background-color: '#0088cc'}
module.exports = React.createClass({
  	mixins: [LinkedStateMixin],
  	getInitialState() {
	    return {
	    	newsfeed: {},
            notification: {
                total: 0,
                list: []
            },
            role:''
	    };
	},
    propTypes: {
        noti: React.PropTypes.shape({
            total: React.PropTypes.number.isRequired,
            list: React.PropTypes.array
        })
    },
    getDefaultProps() {
        return {
              noti: {
                total: 0,
                list: []
              }
        };
    },
  	logOut(){
		//console.log(localStorage.getItem('token'));
		localStorage.removeItem('token');
		browserHistory.push('/Account/SignIn');
	},
	componentDidMount() 
	{
        console.log("Didcmoit");
        $.ajax({
            url: Constant.SERVER_API + 'api/account/role/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({role: data.role});
                console.log("role: ", this.state.role);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
		
	},
    getNotification() {
        $.ajax({
            url: Constant.SERVER_API + 'api/notification/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var update_notification = update(this.state, {
                    notification: {
                        total: {$set: data.length},
                        list: {$set: data}
                    } 
                });
                this.setState(update_notification);
                console.log("notification: ", this.state.notification);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
    },
    hideMenu() {
        // close notification-menu when changes route
        $('.dropdown-backdrop').click()
    },
    notificationHandle() {
        $("#total_notification").hide();
    },
    render:template
});
