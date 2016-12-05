import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import template from './Admin.rt';
import update from 'react-addons-update';
import $ from 'jquery';

module.exports = React.createClass({
  getInitialState() {
    return {
      step: 1,
      data: {
        data_step1: null,
        data_step2: null,
        data_step3: null,
        data_step4: null
      }
    };
  },

  getDataPage1(data) {
    this.setState({data_step1: data});
  },

  getDataPage2(data) {
    this.setState({data_step2: data});
  },

  getDataPage3(data) {
    this.setState({data_step3: data});
  },

  getDataPage4(data) {
    this.setState({data_step4: data});
  },

  changeStep(value) {
    this.setState({step: value});
  },

  nextStep(value) {
    this.setState({step: value});
  },

  render: template
});
