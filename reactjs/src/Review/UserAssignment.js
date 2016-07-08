import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './UserAssignment.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import dropdown from '../script/drop-down.js'
import Constant from '../Constant.js'
import chart from '../script/chart-user-assignment.js'
import 'jquery'

var UserAssignment = React.createClass({
    displayName: 'UserAssignment',
    componentDidMount() {
        chart();  
    },
    render:template
});

module.exports = UserAssignment;