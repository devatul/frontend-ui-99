import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DataRisk.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'

 var DataRisk= React.createClass({
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
 module.exports = DataRisk;