import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Review.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'
module.exports = React.createClass({
  	mixins: [LinkedStateMixin],
  	getInitialState() {
	    return {
	    	
	    };
	},
	componentDidMount() 
	{
	},
    render:template
});