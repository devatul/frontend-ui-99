import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link, IndexLink, browserHistory} from 'react-router';
import template from './MyTeam.rt';
import Constant from '../App/Constant.js';
import $, {JQuery} from 'jquery';
import _ from 'lodash';
import update from 'react-addons-update';
import {makeRequest} from '../utils/http';
import {getRole, getMyTeam} from '../utils/function';

module.exports = React.createClass({
  getInitialState() {
    return {
      role: '',
      content: '',
      teams: []
    };
  },

  getTeam() {
    getMyTeam({
      success: (res) => {
        console.log(res);

        _.forEach(res, (object) => {
          let minimum = 1,
              maximum = 999,
              progressMin = 0,
              progressMax = 100;

          object.inSLA = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
          object.outSLA = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
          object.SLA = object.inSLA + object.outSLA;
          object.progress = Math.floor(Math.random() * (progressMax - progressMin + 1)) + progressMin;
        });

        this.setState({ teams: res });
      }
    });
  },

  componentDidMount() {
    getRole({
      success: function (data) {
        if (data.role == Constant.role.IS_2ND) {
          this.setState({content: 'Your team is comprised of all the reviewers which you have currently assigned.'})
        } else {
          this.setState({content: 'Your team is comprised of all the reviewers which you have currently the same category assigned.'})
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
      }.bind(this)
    });

    this.getTeam();
  },

  render: template
});
