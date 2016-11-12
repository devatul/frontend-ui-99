import React, {Component, propTypes} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import _ from 'lodash';
import 'jquery';
import template from './Admin_Step4.rt';
import 'jquery';

var Admin_Step4 = React.createClass({
  getInitialState() {
    return {
      complete: 0,
      cycleProgress: 'progress-radial progress-0',
      readOnly: false,
      readOnly1: false,
      readOnly2: false,
      add_DomainDetails: [''],
      count: 0
    }
  },

  componentDidMount() {
  },

  nextStep() {
    this.props.nextStep(5);
  },

  render: template
});

module.exports = Admin_Step4;
