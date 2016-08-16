import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DataRisk.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'
import javascriptOver from '../script/javascript-overview.js'
import javascript from '../script/javascript.js'

 var DataRisk= React.createClass({
  	mixins: [LinkedStateMixin],
  	getInitialState() {
	    return {
	    	
	    };
	},
	componentDidMount() 
	{
		javascript();
		javascriptOver();
	},
    render:template
});
 module.exports = DataRisk;