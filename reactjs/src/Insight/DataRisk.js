import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import template from './DataRisk.rt';
import update from 'react/lib/update';
import 'jquery';
import Constant, {fetching} from '../Constant.js';
import Demo from '../Demo.js';
import javascriptOver from '../script/javascript-overview.js';
import javascript from '../script/javascript.js';

var DataRisk = React.createClass({
  getInitialState() {
    return {
      dataRisk: {},
      chart:{
        duplicated: {},
        stale_files: {},
        storage_cost_saving_opportunity: {},
        twins: {},
      },
      xhr: {
        status: "Report is loading",
        message: "Please wait!",
        timer: 20,
        loading: 0,
        isFetching: fetching.STARTED
      }
    };
  },

  componentWillUnmount() {
    this.setState({
      xhr: update(this.state.xhr, {
        isFetching: {
          $set: fetching.SUCCESS
        }
      })
    });
  },

  getData() {
    this.setState({
      xhr: update(this.state.xhr, {
        isFetching: {
          $set: fetching.START
        }
      })
    });

    $.ajax({
      url: Constant.SERVER_API + 'api/insight/data-risk?number_users=5',
      dataType: 'json',
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
      },
      success: function (data) {
        // FIXME: Demo fix
        if (Demo.MULTIPLIER != 1) {
          data.duplicated.value *= Demo.MULTIPLIER;
          for (let i = 0, len = data.file_identification_risk.length; i < len; ++i) {
            data.file_identification_risk[i].num_files *= Demo.MULTIPLIER;
          }
          data.stale_files.value *= Demo.MULTIPLIER;
          data.twins.value *= Demo.MULTIPLIER;
        }

        let chart = this.state.chart;
        chart.duplicated.config = {name: 'Documents', colors: [ '#0FABE6'], colorsHover: '#0FABE6'}
        chart.duplicated.data = [data.duplicated.value];

        chart.stale_files.config = {name: 'Documents', colors: [ '#ED9C27'], colorsHover: '#DFF2F8'}
        chart.stale_files.data = [data.stale_files.value];

        chart.storage_cost_saving_opportunity.config = {name: 'Documents', colors: [ '#DF625A'], colorsHover: '#DF625A'}
        chart.storage_cost_saving_opportunity.data = [data.storage_cost_saving_opportunity.size];

        chart.twins.config = {name: 'Documents', colors: [ '#359CA1'], colorsHover: '#359CA1'}
        chart.twins.data = [data.twins.value];

        this.setState({
          xhr: update(this.state.xhr, {
            isFetching: {
              $set: fetching.SUCCESS
            }
          })
        });
        this.setState(Object.assign({}, this.state, {dataRisk: data}));
      }.bind(this),
      error: function (xhr, error) {
        this.setState({
          xhr: update(this.state.xhr, {
            isFetching: {
              $set: fetching.ERROR
            }
          })
        });
        if (xhr.status === 401) {
          browserHistory.push('/Account/SignIn');
        }
      }.bind(this)
    });
  },

  handleFilter(bodyRequest) {
    let value = bodyRequest.number_users;

    if (value == 'Top 5') {
      value = 5;
    }
    if (value == 'Top 15') {
      value = 15;
    }
    if (value == 'Top 25') {
      value = 25;
    }
    if (value == 'Top 50') {
      value = 50;
    }

    this.setState(Object.assign({}, this.state, {numberUser: value}));

    $.ajax({
      url: Constant.SERVER_API + 'api/insight/data-risk?number_users=' + value,
      dataType: 'json',
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
      },
      success: function (data) {
        this.setState(Object.assign({}, this.state, {dataRisk: data}));
      }.bind(this),
      error: function (xhr, error) {
        if (xhr.status === 401) {
          browserHistory.push('/Account/SignIn');
        }
      }.bind(this)
    });
  },

  formatNumber(number){
    if (number == null) {
      return 0
    } else {
      let n = parseFloat(number);
      return Math.round(n * 1000) / 1000;
    }
  },

  floor(number){
    return Math.floor(number)
  },

  componentDidMount(){
    this.getData();
    javascript();
    javascriptOver();
  },

  render: template
});

module.exports = DataRisk;
