import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import {max} from 'lodash';
import template from './DataRisk.rt';
import update from 'react/lib/update';
import 'jquery';
import Constant, {fetching} from '../App/Constant.js';
import Demo from '../Demo.js';
import javascriptOver from '../script/javascript-overview.js';
import javascript from '../script/javascript.js';
import { getDataRisk } from '../utils/function'

var DataRisk = React.createClass({
  getInitialState() {
    return {
      dataRisk: {},
      chart:{
        duplicated: {},
        twins: {},
        stale_files: {},
        storage_cost_saving_opportunity: {},
        unreadable_files: {},
        volume_of_client: {},
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
shouldComponentUpdate(){
  console.log(this.state)
  return true
},
  getData() {
    this.setState({
      xhr: update(this.state.xhr, {
        isFetching: {
          $set: fetching.START
        }
      })
    });

    getDataRisk({
      number_users: 5,
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

        /* assign data to this.state.chart */

        let chart = this.state.chart;

        let dataArray = [] ;
        data.duplicated.value = 4508,
        data.twins.value = 1555,
        data.stale_files.value = 5832,
        data.storage_cost_saving_opportunity.size = 155;

        dataArray.push(data.duplicated.value);
        dataArray.push(data.twins.value);
        dataArray.push(data.stale_files.value);
        dataArray.push(data.storage_cost_saving_opportunity.size);

        let maxNum = max(dataArray);
        let height = maxNum/70*100;

        chart.duplicated.config = {name: 'Documents', colors: [ '#0FABE6'], colorsHover: '#0FABE6', height: height}
        chart.duplicated.data = [data.duplicated.value];

        chart.twins.config = {name: 'Documents', colors: [ '#359CA1'], colorsHover: '#359CA1', height: height}
        chart.twins.data = [data.twins.value];

        chart.stale_files.config = {name: 'Documents', colors: [ '#ED9C27'], colorsHover: '#DFF2F8', height: height}
        chart.stale_files.data = [data.stale_files.value];

        chart.storage_cost_saving_opportunity.config = {name: 'Documents', colors: [ '#DF625A'], colorsHover: '#DF625A', height: height}
        chart.storage_cost_saving_opportunity.data = [data.storage_cost_saving_opportunity.size];

        chart.unreadable_files.config = {name: 'Documents', colors: [ '#DF625A'], colorsHover: '#DF625A', height: 1000}
        chart.unreadable_files.data = [200];

        // chart.storage_cost_saving_opportunity.config = {name: 'Documents', colors: [ '#DF625A'], colorsHover: '#DF625A', height: height}
        // chart.storage_cost_saving_opportunity.data = [data.storage_cost_saving_opportunity.size];

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

    getDataRisk({
      number_users: value,
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
