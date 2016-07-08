import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ReviewValidation.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
var dropdown = require('../script/drop-down.js');
var Constant = require('../Constant.js');
import 'jquery'

var ReviewValidation = React.createClass({
    displayName: 'ReviewValidation',
    render:template
});

module.exports = ReviewValidation;