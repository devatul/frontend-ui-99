import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Notification.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import Constant from '../Constant.js'

var Notification = React.createClass
({
	getInitialState() {
	    return {
	        notification: {
                total: 0,
                Today: {
                	total: 0,
                	list: []
                },
                yesterday: {
                	total: 0,
                	list: []
                },
                last_7_days: {
                	total: 0,
                	list: []
                },
                older: {
                	total: 0,
                	list: []
                }
            },  
	    };
	},
	componentDidMount() {
		this.getNotification();
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
                    	older: {
                    		total: {$set: data.length},
            	        	list: {$set: data}
                    	}
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
    render:template
});

module.exports = Notification;
