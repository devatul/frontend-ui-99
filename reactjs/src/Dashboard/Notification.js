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
                var today = [];
                var yesterday = [];
                var last_7_days = [];
                var last_30_days = [];
                var older = [];
                for (var i = 0; i < data.length; i++) {
                    var date1 = new Date();
                    var date2 = new Date();
                    var date3 = new Date();
                    var date4 = new Date();
                    var created = new Date(data[i].created);
                    date2.setDate(date2.getDate()-1);
                    date3.setDate(date3.getDate()-7);
                    date4.setMonth(date4.getMonth()-1);
                    if(date1.getDate() == created.getDate() && date1.getMonth() == created.getMonth() && date1.getFullYear() == created.getFullYear()  ) {
                        //today
                        today.push(data[i]);
                    } else if(date2.getDate() == created.getDate() && date2.getMonth() == created.getMonth() && date2.getFullYear() == created.getFullYear()  ) {
                        //yesterday
                        yesterday.push(data[i]);
                    } else if(created >= date3) {
                        //7 days
                        last_7_days.push(data[i]);
                    } else if(created >= date4) {
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
