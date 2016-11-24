import React, {Component} from 'react';
import {render} from 'react-dom';
import template from './AnomalyDetection.rt';
import update from 'react/lib/update';
import Constant, {fetching} from '../App/Constant.js';
import Demo from '../Demo.js';
import _ from 'lodash';
import {makeRequest} from '../utils/http';
import 'jquery';

var AnomalyDetection = React.createClass({
  getInitialState() {
    return {
      anomaly_rick: {},
      check_anomaly: 0,
      display_anomaly: [null],
      user_Client: null,
      documentRepository: null,
      active_Directory_Group: null,
      user_Access: null,
      xhr: {
        status: "Report is loading",
        message: "Please wait!",
        timer: 20,
        loading: 0,
        isFetching: fetching.STARTED,
        isAnomalyRiskFetching: fetching.STARTED,
        isUserClientFetching: fetching.STARTED
      }
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
        return {
          color: ' bg-quartenary-3',
          info: 'This details the number of access rights anomalies that have been detected at the file level. These anomalies detail users who have access to a range of data categories that do not align to their job type, or present a logical pattern based on organisational role types.'
        };
      case 1:
        return {
          color: ' bg-secondary',
          info: 'This details the number of data repository anomalies that have been detected at the file level. These anomalies detail files from a range of data categories are present in a single repository, indicating that sensitive data may be co-mingling, meaning the current data repository structure may be ineffective.'
        };
      case 2:
        return {
          color: ' bg-secondary-2',
          info: 'This details a subset of the document and access rights anomalies, focusing on the highest value data, which is classified as client identifying.'
        };
      case 3:
        return {
          color: 'bg-quartenary-2',
          info: 'This details the number of users who have access to a range of data categories that do not align to their job type, or present an incorrect access pattern based on organisational role types.'
        };
      case 4:
        return {
          color: 'bg-tertiary-3',
          info: 'This details the number of documents that have been detected by Dathena 99 as being at risk.'
        };
      case 5:
        return {
          color: ' bg-quartenary-3',
          info: 'This details the number of active directory group at risk that have been detected at the file level. These anomalies detail users who have access to a range of data categories that do not align to their job type, or present an incorrect pattern based on organisational role types.'
        };
    }
  },

  componentWillMount() {
    this.getDocumentRepository();
    this.getClientDataRepository();
  },

  componentDidMount() {
    this.setState({
      xhr: update(this.state.xhr, {
        isFetching: {
          $set: fetching.STARTED
        },
        isAnomalyRiskFetching: {
          $set: fetching.STARTED
        }
      })
    });

    this.getAnomalyRick();
    this.getUserClient();
    this.getActiveDirectory();
    this.getUserAccess();
    this.renderDocumentRepositoryCategoryAtRisk();
  },

  // Get data form APIs
  getAnomalyRick() {
    return makeRequest({
      path: 'api/anomaly/risk/',
      success: (data) => {
        // FIXME: Demo fix
        if (Demo.MULTIPLIER != 1) {
          for (let i = 0, len = data.length; i < len; ++i) {
            data[i].value *= Demo.MULTIPLIER;
          }
        }

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
    })
  },

  getUserClient() {
    return makeRequest({
      path: Constant.urls.IAM + 'user-client',
      success: (data) => {
        // FIXME: Demo fix
        if (Demo.MULTIPLIER != 1) {
          for (let i = 0, len = data.data_first_table.length; i < len; ++i) {
            data.data_first_table[i]['Active Directory at Risk'] *= Demo.MULTIPLIER;
            data.data_first_table[i]['Folder at Risk'] *= Demo.MULTIPLIER;
            data.data_first_table[i]['User Access Right Accuracy'] *= Demo.MULTIPLIER;
            data.data_first_table[i]['User with Anomaly'] *= Demo.MULTIPLIER;
          }

          for (let i = 0, len = data.data_second_table.length; i < len; ++i) {
            data.data_second_table[i]['Client Data at Risk'].value *= Demo.MULTIPLIER;
            data.data_second_table[i]['Security Settings at Risk'].value *= Demo.MULTIPLIER;
            data.data_second_table[i]['Total Anomaly'].value *= Demo.MULTIPLIER;
            for (let j = 0, lenj = data.data_second_table[i]['User Client Data Access Anomaly Trend'].length; j < lenj; ++j) {
              data.data_second_table[i]['User Client Data Access Anomaly Trend'][j].docs *= Demo.MULTIPLIER;
            }
          }
        }

      let colors = {
        "low": '#27C57F',
        "medium": '#EB9428',
        "high":'#E1605B'
      };

      data['data_second_table'][0]['User Client Data Access Anomaly Trend'].sort(function(a, b) {
        return a.occurence > b.occurence;
      });

      let chartValues = [];
      for (let i = 0, len = data['data_second_table'][0]['User Client Data Access Anomaly Trend'].length; i < len; ++i) {
        chartValues.push({
          y: data['data_second_table'][0]['User Client Data Access Anomaly Trend'][i].docs * Demo.MULTIPLIER,
          color: colors[data['data_second_table'][0]['User Client Data Access Anomaly Trend'][i].type],
        });
      }

      let chartData = {
        xTitle: 'Anomaly Occurence',
        yTitle: 'Users',
        data: chartValues,
      };

        this.setState({
          user_Client: data,
          user_Client_Chart: chartData,
          xhr: update(this.state.xhr, {
            isFetching: {
              $set: fetching.SUCCESS
            },
            isUserClientFetching: {
              $set: fetching.SUCCESS
            }
          })
        });
      }
    });
  },

  getActiveDirectory() {
    return makeRequest({
      path: 'api/anomaly/iam/active-directory',
      success: (data) => {
        // FIXME: Demo fix
        if (Demo.MULTIPLIER != 1) {
          for (let i = 0, len = data.data_first_table.length; i < len; ++i) {
            data.data_first_table[i]['AD Group Anomaly'] *= Demo.MULTIPLIER;
            data.data_first_table[i]['Active Directory at Risk'] *= Demo.MULTIPLIER;
            data.data_first_table[i]['Folder at Risk'] *= Demo.MULTIPLIER;
            data.data_first_table[i]['User Access Right Accuracy'] *= Demo.MULTIPLIER;
          }

          for (let i = 0, len = data.data_second_table.length; i < len; ++i) {
            for (let j = 0, lenj = data.data_second_table[i]['Anomaly Trend'].length; j < lenj; ++j) {
              data.data_second_table[i]['Anomaly Trend'][j]['AD Group'] *= 1;
            }
            data.data_second_table[i]['Document at Risk'].value *= Demo.MULTIPLIER;
            data.data_second_table[i]['Total Anomaly'].value *= Demo.MULTIPLIER;
            data.data_second_table[i]['Total Users at Risk'].value *= Demo.MULTIPLIER;
          }
        }

      data['data_second_table'][0]['Anomaly Trend'].sort(function(a, b) {
        return a.occurence > b.occurence;
      });

        let colors = {
          "low": '#27C57F',
          "medium": '#EB9428',
          "high":'#E1605B'
        };

        let chartValues = [];
        for (let i = 0, len = data['data_second_table'][0]['Anomaly Trend'].length; i < len; ++i) {
          chartValues.push({
            y: data['data_second_table'][0]['Anomaly Trend'][i]["AD Group"] * Demo.MULTIPLIER,
            color: colors[data['data_second_table'][0]['Anomaly Trend'][i].type],
          });
        }

        let chartData = {
          xTitle: 'Anomaly Occurence',
          yTitle: 'AD Group',
          data: chartValues,
        };

        this.setState({
          active_Directory_Group: data,
          active_Directory_Group_Chart: chartData
        })
      }
    });
  },

  getUserAccess() {
    return makeRequest({
      path: 'api/anomaly/iam/user-access',
      success: (data) => {

      let chartData = {
        xTitle: 'Anomaly Occurence',
        yTitle: 'Users',
        data: [],
      };

        this.setState({
          user_Access: data,
          user_Access_Chart: chartData
        })
      }
    });
  },

  getDocumentRepository() {
  let data = {
    "title": "Document Repository Anomaly",
    "risk percentage": 80,
    "risk type": "High Risk",
    "prediction percentage": 35,
    "prediction quality": "High",
    "data first table": [
      {
        "Confidentiality at Risk": "Internal",
        "Document at Risk": 132,
        "Folder at Risk": 132,
        "User Anomaly": 830
      },
      {
        "Confidentiality at Risk": "Confidential",
        "Document at Risk": 432,
        "Folder at Risk": 128,
        "User Anomaly": 50
      }
    ],
    "Category at Risk": [
      {
        "name": "Accounting/Tax",
        "percentage": 15
      },
      {
        "name": "Corporate Entity",
        "percentage": 4
      },
      {
        "name": "Client/Customer",
        "percentage": 1
      },
      {
        "name": "Employees",
        "percentage": 20
      },
      {
        "name": "Legal/Compliance",
        "percentage": 20
      },
      {
        "name": "Transaction",
        "percentage": 40
      }
    ],
    "data second table": [
      {
        "Total Anomaly": {
          "value": 11600,
          "type": "Documents",
          "trend": "up"
        },
        "Total User at Risk": {
          "value": 1390,
          "type": "Windows User Account",
          "trend": "down"
        },
        "Total Folder at Risk": {
          "value": 1390,
          "type": "Folders",
          "trend": "up"
        },
        "Document Repository Anomaly Trend": [
          {
            "occurence": 1,
            "users": 5,
            "type": "low"
          },
          {
            "occurence": 2,
            "users": 15,
            "type": "medium"
          },
          {
            "occurence": 3,
            "users": 50,
            "type": "high"
          }
        ]
      }
    ]
  };

      data['data second table'][0]['Document Repository Anomaly Trend'].sort(function(a, b) {
        return a.occurence > b.occurence;
      });

        let colors = {
          "low": '#27C57F',
          "medium": '#EB9428',
          "high":'#E1605B'
        };

        let chartValues = [];
        for (let i = 0, len = data['data second table'][0]['Document Repository Anomaly Trend'].length; i < len; ++i) {
          chartValues.push({
            y: data['data second table'][0]['Document Repository Anomaly Trend'][i].users * Demo.MULTIPLIER,
            color: colors[data['data second table'][0]['Document Repository Anomaly Trend'][i].type],
          });
        }

        let chartData = {
          xTitle: 'Anomaly Occurence',
          yTitle: 'Folders',
          data: chartValues,
        };

    this.setState({
      documentRepository: data,
      documentRepositoryChart: chartData,
    });
  },

  renderDocumentRepositoryCategoryAtRisk() {
    let colors= [
      "#09B3B5",
      "#51CFE8",
      "#FBAC08",
      "#9295D7",
      "#4F6AE7",
      "#FF503F"
    ];

    let data = [];
    for (let i = 0, len = this.state.documentRepository["Category at Risk"].length; i < len; ++i) {
      data.push({
        y: this.state.documentRepository["Category at Risk"][i].percentage,
        name: this.state.documentRepository["Category at Risk"][i].name,
        color: colors[i]
      });
    }

    data.sort(function (a, b) {
      return a.y < b.y;
    });

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
    }

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
            style: {fontFamily: '\'Roboto\', sans-serif', fontSize: '10px', "fontWeight": "300"},
            formatter: function () {
              return this.y >= 15 ? this.y + '%' : this.y;
            }
          }
        }
      },
      tooltip: {
        enabled: false
      }
    });
    this.setState({ documentRepositoryChart: data });
  },

  getClientDataRepository() {
    let data = {
      "title": "Client Data Repository Anomaly",
      "risk percentage": 80,
      "risk type": "High Risk",
      "prediction percentage": 35,
      "prediction quality": "high",
      "data first table": [
        {
          "User Anomaly": 2100,
          "Confidentiality at Risk": "Banking Secrecy",
          "Folder at Risk": 132,
          "Active Directory Group at Risk": 54,
          "User Access Right Accuracy": 99.25
        },
        {
          "User Anomaly": 2345,
          "Confidentiality at Risk": "Confidential",
          "Folder at Risk": 532,
          "Active Directory Group at Risk": 65,
          "User Access Right Accuracy": 98.25

        }
      ],
      "data second table": [
        {
          "Total Anomaly": {
            "value": 3100,
            "type": "Windows User Account",
            "trend": "down"
          },
          "Document at Risk": {
            "value": 92,
            "type": "Documents",
            "trend": "up"
          },
          "Active Directory at Risk": {
            "value": 12,
            "type": "Active Directory Group",
            "trend": "up"
          },
          "User Client Data Access Anomaly Trend": [
            {
              "occurence": 1,
              "users": 5,
              "type": "low"
            },
            {
              "occurence": 2,
              "users": 15,
              "type": "medium"
            },
            {
              "occurence": 3,
              "users": 50,
              "type": "high"
            }
          ]
        }
      ]
    };

    let colors = {
      "low": '#27C57F',
      "medium": '#EB9428',
      "high":'#E1605B'
    };

    data['data second table'][0]['User Client Data Access Anomaly Trend'].sort(function (a, b) {
      return a.occurence > b.occurence;
    });

    let chartValues = [];
    for (let i = 0, len = data['data second table'][0]['User Client Data Access Anomaly Trend'].length; i < len; ++i) {
      chartValues.push({
        y: data['data second table'][0]['User Client Data Access Anomaly Trend'][i].users * Demo.MULTIPLIER,
        color: colors[data['data second table'][0]['User Client Data Access Anomaly Trend'][i].type],
      });
    }

    let chartData = {
      xTitle: 'Anomaly Occurence',
      yTitle: 'Users',
      data: chartValues,
    };

    this.setState({ clientDataRepository: data, clientDataRepositoryChartData: chartData });
  },

  render: template
});

module.exports = AnomalyDetection;
