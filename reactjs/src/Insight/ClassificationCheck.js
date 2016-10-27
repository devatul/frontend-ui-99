import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ClassificationCheck.rt'
import $ from 'jquery'
var ClassificationCheck = React.createClass({
  	getInitialState() {
	    return {

	    };
	},
	componentDidMount()
	{
	},
    render:template
});
module.exports = ClassificationCheck;