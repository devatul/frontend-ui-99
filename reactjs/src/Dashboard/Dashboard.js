import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Dashboard.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'

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
		/*
        $.ajax({
            url:'http://54.251.148.133/newsfeed/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({newsfeed:data});
                console.log(this.state.newsfeed);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
        
        
        $.ajax({
            url:'http://54.169.106.24/todo/5',
            dataType: 'json',
            type: 'DELETE',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                //this.setState({todo:data});
                console.log(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
        
        $.ajax({
            url:'http://54.169.106.24/todo/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({todo:data});
                console.log(this.state.todo);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
        */
		
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
    notificationHandle() {
        $("#total_notification").hide();
    },
    render:template
});
