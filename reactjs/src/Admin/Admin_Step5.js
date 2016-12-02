import React, {Component, propTypes} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import _ from 'lodash';
import template from './Admin_Step5.rt';
import 'jquery';

var Admin_Step5 = React.createClass({
  getInitialState() {
    return {
      complete: 0,
      cycleProgress: 'progress-radial progress-0',
      readOnly: false,
      readOnly1: false,
      readOnly2: false,
      add_DomainDetails: [''],
      count: 0,
      data: null
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.dataBlock != nextProps.dataBlock;
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dataBlock != prevProps.dataBlock) {
      let updatedata = update(this.state, {
        data: {$set: this.props.dataBlock}
      });
      this.setState(updatedata);
    }
  },

  getValue(arr, key) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == key) {
        return arr[i].value;
      }
    }
  },

  componentDidMount() {
  },

  render: template
});

module.exports = Admin_Step5;
