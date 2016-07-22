import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './App.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'
import validate from 'jquery-validation';
import javascript from './script/javascript.js';
import javascript_todo from './script/javascript.todo.js';
const TIMEVALIDTOKEN = 300000;
module.exports = React.createClass({
    mixins: [LinkedStateMixin],
    componentWillMount() 
    {
    	console.log("app");
    	if(localStorage.getItem('token'))
		{
			console.log("havetoken");
			setInterval(function()
    		{
    			var token = localStorage.getItem('token');
    			if(localStorage.getItem('token')){
    				$.ajax({
			            url:'http://54.251.148.133/api/token/api-token-refresh/',
			            dataType: 'json',
			            type: 'POST',
			            data:{
			            	token:token
			            },
			            success: function(data) 
			            {
			            	localStorage.setItem('token', data.token);
			            }.bind(this),
			            error: function(xhr, status, err) 
			            {
			            	browserHistory.push('/Account/Signin');
			            }.bind(this)
		        	});
    			}
    			
	    	}, TIMEVALIDTOKEN);
	    	
			//browserHistory.push('/Dashboard/OverView');	
		}else
		{
			console.log("noToken");
			browserHistory.push('/Account/Signin');	
		}
    },
    componentDidMount() {
    },
    
    componentDidUpdate(prevProps, prevState) {
        console.log("update app");
    },
    render:template

});
