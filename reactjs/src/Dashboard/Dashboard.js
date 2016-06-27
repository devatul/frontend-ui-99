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
	    	todo:{},
	    	noti:{}
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
	showAllNoti(){
		$.ajax({
            url:'http://54.169.106.24/notification/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({noti:data});
                console.log(this.state.noti);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
	},
    render:template
});
