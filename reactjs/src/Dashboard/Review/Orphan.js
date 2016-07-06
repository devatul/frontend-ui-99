import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Orphan.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'

//const ACTIVE = {background-color: '#0088cc'}
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