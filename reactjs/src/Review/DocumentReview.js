import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DocumentReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import chart from '../script/chart-group-review.js'
import Constant from '../Constant.js'
import undo from '../script/Undo.js'
import javascript_todo from '../script/javascript.todo.js'
import 'jquery'

var DocumentReview = React.createClass({
    render:template
});
module.exports = DocumentReview;