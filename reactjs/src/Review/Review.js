import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Review.rt'
import $ from 'jquery'
module.exports = React.createClass({
  	getInitialState() {
	    return {
	    	
	    };
	},
	componentDidMount() 
	{
	},

	title() {
		let paths = window.location.pathname.split('/');

		switch(paths[paths.length - 1]) {
			case 'ReviewValidation':
				return 'Document Classification Challenge - Coordinator’s Review Validation';
			case 'UserAssignment':
				return 'Document Classification - User Assignment';
			default:
				return 'Document Categorisation and Classification Review'
		}
	},

    render:template
});