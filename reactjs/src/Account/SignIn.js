import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './signin.rt';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import $ from 'jquery';

import Constant from '../Constant.js';
var Signin = React.createClass
({
	getInitialState() {
	    return {email: '', password: '', isRemember:false, err:''
	};

	},
	emailChange(event) {
    	this.setState({email: event.target.value});
  	},
  	passwordChange(event) {
	    this.setState({password: event.target.value});
  	},
  	isRememberChange(event) {
	    this.setState({isRemember: event.target.checked});
  	},
  	
	handleSubmit() {
	    //e.preventDefault();
	    var email = this.state.email.trim();//'root@dathena.io';//
	    var password = this.state.password.trim();//'dathenaiscool';//
	    if (email.length <= 0 || password.length <= 0) {
	      return;
	    }else{
    		$.ajax({
		      url: Constant.SERVER_API + 'api/token/api-token-auth/',
		      dataType: 'json',
		      type: 'POST',
		      data:{
		      	username:email,
		      	password: password
		      },
		      success: function(data) {
		      	console.log(data.token);

	    		localStorage.setItem('token', data.token);
		        browserHistory.push('/Dashboard/OverView');
		      }.bind(this),
		      error: function(xhr, status, err) {
		      	var jsonResponse = JSON.parse(xhr.responseText);
	      		console.log(jsonResponse);
	      		console.log(this);
		        this.setState({err: "The username and password you entered don't match"});
		        $('#password').addClass("has-error");
		        $('#username').addClass("has-error");
		        console.log(err);
		      }.bind(this)
		    });
		    /*this.serverRequest = $.post('http://54.251.148.133/api/token/api-token-auth/', function (result) {
			    var lastGist = result[0];
			    this.setState({
				    username: lastGist.owner.login,
			        lastGistUrl: lastGist.html_url
			    });
		    }.bind(this));*/
	    }
	},
	componentDidMount() {

		console.log("token");
		/*$(function () {
		    jQuery("#signIn").validate({
		        // Specify the validation rules
		        rules: {
		            username: {
		                required: true,
		                minlength: 6
		            },
		            password: {
		                required: true,
		                minlength: 6
		            }
		        },
		        // Specify the validation error messages
		        messages: {
		        	userName: {
		        		required:"Please enter your user name",
		        		minlength:"Your userName must be at least 6 characters long"
		        	},
		            
		            password: {
		                required: "Please provide a password",
		                minlength: "Your password must be at least 6 characters long"
		            }        
		        },
		        submitHandler(form) {
				   	$.ajax({
				      url:'http://54.169.106.24/api-token-auth/',
				      dataType: 'json',
				      type: 'POST',
				      data:{
				      	email:this.state.email,
				      	password: this.state.password
				      },
				      success: function(data) {
				        if(this.state.isRemember)
				        {
					    	localStorage.setItem('token', data.token);
			    		}
				        browserHistory.push('/Dashboard/OverView');
				      }.bind(this),
				      error: function(xhr, status, err) {
				        this.setState({err: 'Wrong username or password'});
				        $('#pwd').addClass("has-error");
				        $('#username').addClass("has-error");
				        console.log(err);
				      }.bind(this)
				    });
				    return false;
		        }
		    });
		});*/
  	},
  	componentWillMount(){
  		
  	},
	render:template
});
module.exports = Signin;