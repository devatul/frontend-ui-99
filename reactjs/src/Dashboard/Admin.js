import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Admin.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'

//const ACTIVE = {background-color: '#0088cc'}
module.exports = React.createClass({
  	mixins: [LinkedStateMixin],
  	getInitialState() {
	    return {
	    	name:'', region:'', country:'', state:'', requiedName:false,
	    	nameTeam:'', jobtitleTeam:'', emailTeam:'', roleTeam:'',requiedNameTeam:false,requiedEmailTeam:false
	    };
	},
	nameChange(event) {
    	this.setState({name: event.target.value});
    	this.setState({requiedName: false });
  	},
  	regionChange(event) {
	    this.setState({region: event.target.value});
  	},
  	countryChange(event) {
	    this.setState({country: event.target.value});
  	},
  	stateChange(event) {
	    this.setState({state: event.target.value});
  	},
  	nameTeamChange(event) {
	    this.setState({nameTeam: event.target.value});
	    this.setState({requiedNameTeam: false });
  	},
  	jobtitleTeamChange(event) {
	    this.setState({jobtitleTeam: event.target.value});
  	},
  	emailTeamChange(event) {
	    this.setState({emailTeam: event.target.value});
	    this.setState({requiedEmailTeam: false });
  	},
	componentDidMount() 
	{
		/*$(function () {
			$('select.detail-select').select2({
	        	minimumResultsForSearch: Infinity
	    	}).select2('val', null);;
		});*/
	},
	postOrganisation(){
		$.ajax({
		    url:'http://54.251.148.133/api/settings/organization/',
		    dataType: 'json',
		    type: "POST",
		    data: {
	            "name": this.state.name,
	            "region":this.state.region,
	            "country":this.state.country,
	            "state":this.state.state
	        },
	        beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({
                	name: null,
                	region: null,
                	country: null,
                	state: null,
                	requiedName: false

                });
            }.bind(this),

	      	error: function(xhr, status, err) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
                if(xhr.status === 400)
                {
                	if(jsonResponse.name)
		        	{
						this.setState({requiedName: jsonResponse.name });
		        	}
                    
                }
	      	}.bind(this)
		});
	},
	postTeamRiskLead(){
		$.ajax({
		    url:'http://54.251.148.133/api/settings/team/',
		    dataType: 'json',
		    type: "POST",
		    data: {
	            "name": this.state.nameTeam,
	            "jobtitle":this.state.jobtitleTeam,
	            "email":this.state.emailTeam,
	            "role":'risk_lead'
	        },
	        beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({
                	nameTeam: null,
                	jobtitleTeam: null,
                	emailTeam: null,
                	requiedNameTeam: false,
                	requiedEmailTeam: false
                });
            }.bind(this),

	      	error: function(xhr, status, err) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
                if(xhr.status === 400)
                {
                	if(jsonResponse.name)
		        	{
						this.setState({requiedNameTeam: jsonResponse.name });
		        	}
		        	if(jsonResponse.email)
		        	{
						//this.setState({requiedEmailTeam: true });
						this.setState({requiedEmailTeam: jsonResponse.email });
		        	}
                    
                }
	      	}.bind(this)
		});
	},
	postTeamRiskOfficers(){
		$.ajax({
		    url:'http://54.251.148.133/api/settings/team/',
		    dataType: 'json',
		    type: "POST",
		    data: {
	            "name": this.state.nameTeam,
	            "jobtitle":this.state.jobtitleTeam,
	            "email":this.state.emailTeam,
	            "role":'risk_officer'
	        },
	        beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({
                	nameTeam: null,
                	jobtitleTeam: null,
                	emailTeam: null,
                	requiedNameTeam: false,
                	requiedEmailTeam: false
                });
            }.bind(this),

	      	error: function(xhr, status, err) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
                if(xhr.status === 400)
                {
                	if(jsonResponse.name)
		        	{
						this.setState({requiedNameTeam: jsonResponse.name });
		        	}
		        	if(jsonResponse.email)
		        	{
						//this.setState({requiedEmailTeam: true });
						this.setState({requiedEmailTeam: jsonResponse.email });
		        	}
                    
                }
	      	}.bind(this)
		});
	},
	postTeamAudit(){
		$.ajax({
		    url:'http://54.251.148.133/api/settings/team/',
		    dataType: 'json',
		    type: "POST",
		    data: {
	            "name": this.state.nameTeam,
	            "jobtitle":this.state.jobtitleTeam,
	            "email":this.state.emailTeam,
	            "role":'audit'
	        },
	        beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({
                	nameTeam: null,
                	jobtitleTeam: null,
                	emailTeam: null,
                	requiedNameTeam: false,
                	requiedEmailTeam: false
                });
            }.bind(this),

	      	error: function(xhr, status, err) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
                if(xhr.status === 400)
                {
                	if(jsonResponse.name)
		        	{
						this.setState({requiedNameTeam: jsonResponse.name });
		        	}
		        	if(jsonResponse.email)
		        	{
						//this.setState({requiedEmailTeam: true });
						this.setState({requiedEmailTeam: jsonResponse.email });
		        	}
                    
                }
	      	}.bind(this)
		});
	},
    render:template
});
