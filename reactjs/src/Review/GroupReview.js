import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './GroupReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import chart from '../script/chart-review.js'
import Constant from '../Constant.js'
require('jquery');

var GroupReview = React.createClass({
    displayName: 'GroupReview',
    componentDidMount() {
        chart();  
    },
    render:template
});

module.exports = GroupReview;