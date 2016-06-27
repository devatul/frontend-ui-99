import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DashboardIndex.rt';
import $ from 'jquery'
var DashboardIndex = React.createClass
({
	getInitialState() {
	    return {
	    	detailLastScan: {}, 
		};
	},
	componentDidMount() {
	    
	    $.ajax({
            url:'http://54.169.106.24/hadoop/last/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) 
            {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) 
            {
                this.setState({detailLastScan: data});
            }.bind(this),
            error: function(xhr, status, err) 
            {
            }.bind(this)
        }); 
	   
  	},
	componentWillUnmount() {
        //clearInternal(this.state.detailLastScan);
        //this.setState({detailLastScan: null});
       // delete this.state.detailLastScan;
       //this.setState({detailLastScan: _.reject(this.state.detailLastScan)});
  
  	},
	
	render:template
});
module.exports = DashboardIndex;