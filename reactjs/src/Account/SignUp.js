import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './SignUp.rt'
import $ from 'jquery'
import validate from 'jquery-validation';
require('../Constant.js');
var SignUp = React.createClass({
	getInitialState() {
	    return {userName: '', password: '', firstName:'', lastName:'', email:'', phoneLandline:'',
	    		phoneMobile:'', jobPosition:'', department:'', company:'', country:'', city:'',
	    		termsAndConditions: false, useSSO:false, messageUnAgree:''
		};
	},
	userNameChange(event) {
    	this.setState({userName: event.target.value});
    	
  	},
  	passwordChange(event) {
	    this.setState({password: event.target.value});
  	},
  	firstNameChange(event) {
    	this.setState({firstName: event.target.value});
  	},
  	lastNameChange(event) {
    	this.setState({lastName: event.target.value});
  	},
  	emailChange(event) {
    	this.setState({email: event.target.value});
  	},
  	phoneLandlineChange(event) {
    	this.setState({phoneLandline: event.target.value});
  	},
  	phoneMobileChange(event) {
    	this.setState({phoneMobile: event.target.value});
  	},
  	departmentChange(event) {
    	this.setState({department: event.target.value});
  	},
  	companyChange(event) {
    	this.setState({company: event.target.value});
  	},
  	countryChange(event) {
    	this.setState({country: event.target.value});
  	},
  	cityChange(event) {
    	this.setState({city: event.target.value});
  	},

  	
  	agreeChange(event) {
	    this.setState({agree: event.target.checked});
	    if(this.state.agree){	
	    	this.setState({messageUnAgree: "Please accept our policy"});    	
	    }else{
	    	this.setState({messageUnAgree: ""});
	    }
  	},
  	validate:function(){
	    $('#submitForm').validate({
	        // Specify the validation rules
	        errorElement: 'span',
            focusInvalid: false,
	        rules: {
	            userName: {
	                required: true,
	                minlength: 6
	            },
	            password: {
	                required: true,
	                minlength: 6
	            },
	            pwd_confirm: {
            		required: true,
			      	equalTo: "#password"
			    },
	            first_name: {
	                required: true
	            },
	            last_name: {
	                required: true
	            },
	            email: {
	                required: true,
	                email: true
	            },
	            company:{
	            	required: true
	            },
	            agree:"required"
	        },
	        // Specify the validation error messages
	        messages: {
	        	userName: {
	        		required:"Please enter your user name",
	        		minlength:"Your userName must be at least 6 characters long"
	        	},
	            first_name: "Please enter your first name",
	            last_name: "Please enter your last name",
	            password: {
	                required: "Please provide a password",
	                minlength: "Your password must be at least 6 characters long"
	            },
	            pwd_confirm:{
	            	required:"Please enter the same value again"
	            },
	            email: "Please enter a valid email address",
	            company :"Please enter your company name",
	            agree: "Please accept our policy"	            
	        },
	        submitHandler: function()
	        {
			   	$.ajax({
				    url: SERVER_API + 'api/account/registration/',
				    dataType: 'json',
				    type: "POST",
				    data: {
		                "company_name": this.state.company,
		                "first_name":this.state.firstName,
		                "last_name":this.state.lastName,
		                "username":this.state.userName,
		                "email":this.state.email,
		                "password":this.state.password
		            },
				   	success: function(data) 
				   	{
				        browserHistory.push('/Account/SignIn');
			     	}.bind(this),
			      	error: function(xhr, status, err) {
			      		console.log(xhr);
			      		var jsonResponse = JSON.parse(xhr.responseText);
			      		console.log(jsonResponse.email);
			      		console.log(jsonResponse.username);
				        if(xhr.status === 400)
				        {
				        	if(jsonResponse.email)
				        	{
								$("#emailExits").text(jsonResponse.email);
								$("#email").addClass('error');
				        	}
				        	if(jsonResponse.username)
				        	{
								$("#usernameExits").text(jsonResponse.username);
								$("#userName").addClass('error');
				        	}
				        }

			      	}.bind(this)
		    	});
			    //return false;
	        }.bind(this)
	    });
  	},
  	componentDidMount() {
  		this.validate();
  	},
  	
	render:template
});

module.exports = SignUp;

