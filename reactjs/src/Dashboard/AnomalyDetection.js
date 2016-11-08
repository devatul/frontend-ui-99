import React, {Component} from 'react'
import {render} from 'react-dom'
import template from './AnomalyDetection.rt'
import update from 'react/lib/update'
import Constant, {fetching} from '../Constant.js'
import _ from 'lodash'
import {makeRequest} from '../utils/http'
import 'jquery'

var AnomalyDetection = React.createClass({
    getInitialState() {
        return {
            anomaly_rick: {},
            check_anomaly: 0,
            display_anomaly: [null],
            user_Client : null,
            active_Directory_Group : null ,
            user_Access  : null ,
        }
    },

  componentWillUnmount() {
    this.setState({
      xhr: update(this.state.xhr, {
        isAnomalyRiskFetching: {
          $set: fetching.SUCCESS
        },
        isUserClientFetching: {
          $set: fetching.SUCCESS
        }
      })
    });
  },

  upperFirst(value) {
    let sp = _.split(value, ' '),
        rt = '';

    for (let i = 0; i < sp.length; i++) {
      (i == sp.length - 1) ? rt += _.upperFirst(sp[i]) : rt += _.upperFirst(sp[i]) + ' ';
    }

    return rt;
  },

  getRickType(value) {
    switch (value) {
      case 0:
        return { color: ' bg-quartenary-3', info: 'This details the number of access rights anomalies that have been detected at the file level. These anomalies detail users who have access to a range of data categories that do not align to their job type, or present a logical pattern based on organisational role types.' };
      case 1:
        return { color: ' bg-secondary', info: 'This details the number of data repository anomalies that have been detected at the file level. These anomalies detail files from a range of data categories are present in a single repository, indicating that sensitive data may be co-mingling, meaning the current data repository structure may be ineffective.' };
      case 2:
        return { color: ' bg-secondary-2', info: 'This details a subset of the document and access rights anomalies, focusing on the highest value data, which is classified as client identifying.' };
      case 3:
        return { color: 'bg-quartenary-2', info: 'This details the number of users who have access to a range of data categories that do not align to their job type, or present an incorrect access pattern based on organisational role types.' };
      case 4:
        return { color: 'bg-tertiary-3', info: 'This details the number of documents that have been detected by Dathena 99 as being at risk.' };
      case 5:
        return { color: ' bg-quartenary-3', info: 'This details the number of active directory group at risk that have been detected at the file level. These anomalies detail users who have access to a range of data categories that do not align to their job type, or present an incorrect pattern based on organisational role types.' };
    }
  },

  componentDidMount() {
    let data = [{
          name: 'Transaction',
          y: 60,
          color: '#FF503F'
        }, {
          name: 'Legal/Compliance',
          y: 15,
          color: '#9295D7'
        }, {
          name: 'Accounting/Tax',
          y: 12,
          color: '#09B3B5'
        }, {
          name: 'Corporate Entity',
          y: 8,
          color: '#FBAC08'
        }, {
          name: 'Employees',
          y: 5,
          color: '#4FCFE9'
        }];

    var start = 0,
        series = [];

    for (var i = 0; i < data.length; i++) {
      var end = start + 360 * data[i].y / 100;


            series.push({
                type: 'pie',
                size: 120 - 12 * i,
                innerSize: 0,
                startAngle: start,
                endAngle: end,
                data: [data[i]]
            });
            start = end;
        };
        $('.anomaly-pie-chart').highcharts({
            series: series,
            chart: {
                type: 'pie',
                height: 160,
                spacing: [0, 0, 0, 0],
                backgroundColor: 'rgba(255, 255, 255, 0)'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            plotOptions: {
                pie: {
                    borderWidth: 0,
                    dataLabels: {
                        distance: -15,
                        color: 'white',
                        useHTML: true,
                        style: { fontFamily: '\'Roboto\', sans-serif', fontSize: '10px', "fontWeight": "300" },
                        formatter: function() {
                            return this.y >= 15 ? this.y + '%' : this.y;
                        }
                    }
                }
            },
            tooltip: {
                enabled: false
            }
        });
         this.getAnomaylyRick() ;
         this.getUserClient() ;
         this.getActiveDirectory();
         this.getUserAccess();
    },

  // Get data form APIs
  getAnomalyRick() {
    return makeRequest({
      path: 'api/anomaly/risk/',
      success: (data) => {
        this.setState({
          anomaly_rick: data,
          xhr: update(this.state.xhr, {
            isFetching: {
              $set: fetching.SUCCESS
            },
            isAnomalyRiskFetching: {
              $set: fetching.SUCCESS
            }
          })
        });
      }
    });
  },

  getUserClient(){
    return makeRequest({
      path: 'api/anomaly/iam/user-client',
      success: (data) => {
        this.setState({
          user_Client: data,
          xhr: update(this.state.xhr, {
            isFetching: {
              $set: fetching.SUCCESS
            },
            isUserClientFetching: {
              $set: fetching.SUCCESS
            }
          })
        });
      },
    })
  },
    getActiveDirectory(){
        return makeRequest({
            path: 'api/anomaly/iam/active-directory',
            success: (data) => {
                this.setState({ active_Directory_Group: data })
            }
        });
    },
    getUserAccess(){
        return makeRequest({
            path: 'api/anomaly/iam/user-access',
            success: (data) => {
                this.setState({ user_Access: data })
            }
        });
    },
    render: template
});

module.exports = AnomalyDetection;
