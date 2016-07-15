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
                Today: [],
                yesterday: [],
                last_7_days: [],
                last_30_days: [],
                older: []
            }  
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
                var date = new Date();
                //var day = date.getDate();
                //var month = date.getMonth();
                //var year = date.getFullYear();
                var today = [];
                var yesterday = [];
                var last_7_days = [];
                var last_30_days = [];
                var older = [];
                for (var i = 0; i < data.length; i++) {
                    var created = new Date(data[i].created);
                    if((date == created)) {
                        //today
                        today.push(data[i]);
                    } else if(date.setDate(created.getDate()-1) == created) {
                        //yesterday
                        yesterday.push(data[i]);
                    } else if(date.setDate(created.getDate()-7) == created) {
                        //7 days
                        last_7_days.push(data[i]);
                    } else if(date.setMonth(created.getMonth()-1) == created) {
                        //30 days
                        last_30_days.push(data[i]);
                    } else {
                        //older
                        older.push(data[i]);
                    }
                }
                var update_notification = update(this.state, {
                    notification: {
                    	today: {$set: today},
                        yesterday: {$set: yesterday },
                        last_7_days: {$set: last_7_days },
                        last_30_days: {$set: last_30_days },
                        older: {$set: older }
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
