import React, {Component} from 'react';
import {render} from 'react-dom';
import template from './AdvancedAnalytics.rt';
import update from 'react/lib/update';
import {isEmpty, forEach, isEqual, upperFirst, orderBy} from 'lodash';
import javascriptTodo from '../script/javascript.todo.js';
import {makeRequest} from '../utils/http.js';
import {orderByIndex, orderConfidentialities, orderLanguages} from '../utils/function';
import $, {JQuery} from 'jquery';
import Constant from '../App/Constant';
import {_categories, fetching} from '../App/Constant.js';

let hideUndefined = true;

var AdvancedAnalytics = React.createClass({
  getInitialState() {
    return {
      categories: [],
      confidentialities: [],
      'doc-types': [],
      languages: [],
      value: {
          category: 'label',
          confidentiality: "label",
          language: "label",
          doctype: 'label'
      },
      scan: {
        result: {}
      },
      configChart: {
        category: {},
        confidentiality: {},
        securityGroup: {},
        folders: {},
        users: {},
        documents: {}
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

  xhr: {
    getScan: null
  },

  componentDidMount() {
    javascriptTodo();
    this.getCategories();
    this.getConfidentialities();
    this.getDoctypes();
    this.getLanguages();
    this.xhr.getScan = this.getScanResult();
  },

  componentWillUnmount() {
    if (this.xhr.getScan && this.xhr.getScan.abort) {
      this.xhr.getScan.abort();
    }

    this.setState({
      xhr: update(this.state.xhr, {
        isFetching: {
          $set: fetching.SUCCESS
        }
      })
    });

    this.xhr = null;
  },

  shouldComponentUpdate(nextProps, nextState) {
    let {scan, dataChart, configChart} = this.state,
        {categoryLanguageChart, confidentiality, doctypes} = configChart,
        nextConfig = nextState.configChart;

    return !isEqual(scan.result, nextState.scan.result) || !isEqual(configChart, nextConfig);
  },

  componentDidUpdate(prevProps, prevState) {
    var prevResult = prevState.scan.result,
        result = this.state.scan.result;

    if (!isEqual(result, prevResult)) {
      this.updateChart(result, prevResult);
    }
  },
  getCategories: function(async) {
        makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                this.configListLabel(data);

                this.setState({ categories: data, shouldUpdate: true });
            }
        });
    },
    getConfidentialities: function(async) {
        makeRequest({
            path: 'api/label/confidentiality/',
            success: (data) => {
                this.configListLabel(data);
                //data = orderByIndex(data, [4,3,2,1,0]);
                this.setState({ confidentialities: data, shouldUpdate: true });
            }
        });
    },
    getDoctypes: function(async) {
        makeRequest({
            path: 'api/label/doctypes/',
            success: (data) => {
                this.configListLabel(data);

                this.setState({ ['doc-types']: data, shouldUpdate: true });
            }
        });
    },
    getLanguages: function(async) {
        makeRequest({
            path: 'api/label/languages/',
            success: (data) => {
                this.configListLabel(data);
                this.setState({ languages: orderLanguages(data), shouldUpdate: true });
            }
        });
    },
    configListLabel: function(data) {
        for(let i = data.length - 1; i >= 0; i--) {
            data[i].checked = false;
        }
    },
  startScan() {
    makeRequest({
      sync: false,
      method: 'POST',
      path: 'api/scan/',
      success: (data) => {
        console.log('start scan', data)
      },
      error: (err) => {
        console.log('scan error', err)
      }
    })
  },

  getScanResult() {
    this.setState({
      xhr: update(this.state.xhr, {
        isFetching: {
          $set: fetching.START
        }
      })
    });

    return makeRequest({
      path: 'api/scan/',
      success: (data) => {
        if (hideUndefined) {
          data.confidentialities = data.confidentialities.filter(x => {
            return x.name !== "Undefined";
          });
          data.categories = data.categories.filter(x => {
            return x.name !== "Undefined";
          });
        }

        this.setState({
          xhr: update(this.state.xhr, {
            isFetching: {
              $set: fetching.SUCCESS
            }
          })
        });

        // FIXME: Demo fix, to be removed
        if (Constant.MULTIPLIER != 1) {
          data.documents_analyzed = parseInt(data.documents_analyzed) * Constant.MULTIPLIER;
          data.documents_skipped *= Constant.MULTIPLIER;
          data.total_correctly_classified *= Constant.MULTIPLIER;
          data.total_documents_scanned *= Constant.MULTIPLIER;

          data.percentage_duplicates = 24.2;
          data.total_duplicates = Math.round((data.total_documents_scanned * data.percentage_duplicates)/100);

          data.percentage_twins = 8.4;
          data.total_twins = Math.round((data.total_documents_scanned * data.percentage_twins) / 100);

          for (let i = 0, len = data.categories.length; i < len; ++i) {
            data.categories[i].total_classified_docs *= Constant.MULTIPLIER;
            data.categories[i].total_docs *= Constant.MULTIPLIER;
            data.categories[i].total_owner_accuracy_docs *= Constant.MULTIPLIER;
            data.categories[i].total_reviewed_docs *= Constant.MULTIPLIER;
            data.categories[i].total_validated_docs *= Constant.MULTIPLIER;
          }

          for (let i = 0, len = data.confidentialities.length; i < len; ++i) {
            data.confidentialities[i].total_classified_docs *= Constant.MULTIPLIER;
            data.confidentialities[i].total_docs *= Constant.MULTIPLIER;
            data.confidentialities[i].total_owner_accuracy_docs *= Constant.MULTIPLIER;
            data.confidentialities[i].total_reviewed_docs *= Constant.MULTIPLIER;
            data.confidentialities[i].total_validated_docs *= Constant.MULTIPLIER;
          }

          for (let i = 0, len = data.doctypes.length; i < len; ++i) {
            data.doctypes[i].total_docs *= Constant.MULTIPLIER;
          }

          for (let i = 0, len = data.languages.length; i < len; ++i) {
            data.languages[i].total_docs *= Constant.MULTIPLIER;
          }
        }

        let confidentialities = data.confidentialities;

        data.confidentialities = orderConfidentialities(confidentialities);
        data.languages = orderLanguages(data.languages);

        data.doctypes.sort((a, b) => {
          if (a.name === "Others")
            return 1;
          if (b.name === "Others")
            return -1;
          return a.percentage_docs < b.percentage_docs;
        });

        let setResult = update(this.state.scan, {
          result: {$set: data}
        });

        this.setState({scan: setResult})
      },
      error: (err) => {
        this.setState({
          xhr: update(this.state.xhr, {
            isFetching:
            {
              $set: fetching.ERROR
            }
          })
        });
      }
    })
  },

  updateChart(result, prevResult) {
    var categoryData = {}, confidentialityData = {}, securityGroupData = {}, foldersData = {}, usersData = {}, documentsData = {},

    confidentialityData = this.confidentialityChart();
    categoryData = this.categoryChart();
    securityGroupData = this.securityGroupChart();
    foldersData = this.foldersChart();
    usersData = this.usersChart();
    documentsData = this.documentsChart();

    let updateData = update(this.state.configChart, {
      category: {$set: categoryData},
      confidentiality: {$set: confidentialityData},
      securityGroup: {$set: securityGroupData},
      folders: {$set: foldersData},
      users: {$set: usersData},
      documents: {$set: documentsData}
    });
    this.setState({configChart: updateData});
  },

  categoryChart() {
    var categoryChart = {
          name: 'Category',
          innerSize: '70%',
          disabled: false,
          colors: ['#67CFF4', '#0FABE6', '#0A6486', '#95DEF9', '#0D88B4'],
          colorsHover: ['#67CFF4', '#0FABE6', '#0A6486', '#95DEF9', '#0D88B4'],
          dataLabels: {
            formatter: function () {
              var percent = this.percentage.toFixed(1);
              return percent >= 5.0 ? percent + '%' : '';
            },
            color: '#ffffff',
            padding: 0,
            distance: -25,
            style: {
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0px 1px 2px black'
            }
          },
          data: [
            {"y": 109,"name": "Accounting / Tax"},
            {"y": 129,"name": "Corporate Entity"},
            {"y": 377,"name": "Client / Customer"},
            {"y": 11,"name": "Employee / Personal Data"},
            {"y": 37,"name": "Legal / Compliance"}
          ]
        }
        let total = 0;
        for(let i = 0; i < categoryChart.data.length; i++){
          total += categoryChart.data[i].y;
        }
        categoryChart.options = {
          filter: true,
          search: false,
          user: true,
          users: true,
          folder: true,
          archive: true,
          config: false,
          shield: true,
        }
        categoryChart.total = total;
      return categoryChart;
  },

  confidentialityChart() {
    var confidentialityChart = {
          name: 'Confidentiality',
          disabled: false,
          innerSize: '70%',
          colors: ['#EA8B85', '#E46159', '#8D1B19', '#FBDDDD', '#B82820'],
          colorsHover: ['#EA8B85', '#E46159', '#8D1B19', '#FBDDDD', '#B82820'],
          data: [
            {"y": 377,"name": "Banking Secrecy"},
            {"y": 234,"name": "Confidential"},
            {"y": 8,"name": "Internal Only"},
            {"y": 2,"name": "Public"},
            {"y": 38,"name": "Secret"}
          ]
        };
        let total = 0;
        for(let i = 0; i < confidentialityChart.data.length; i++){
          total += confidentialityChart.data[i].y;
        }
        confidentialityChart.total = total;

    if (confidentialityChart.data.length <= 1) {
      confidentialityChart.disabled = true;
    }
    confidentialityChart.options = {
      filter: true,
      search: false,
      user: true,
      users: true,
      folder: true,
      archive: true,
      config: false,
      shield: false,
    }
    return confidentialityChart;
  },

  securityGroupChart() {
    var securityGroupChart = {
          name: 'Security Group',
          disabled: false,
          innerSize: '70%',
          colors: ['#87CD87', '#47A547', '#163516', '#63BD63', '#378037'],
          colorsHover: ['#87CD87', '#47A547', '#163516', '#63BD63', '#378037'],
          data: [
            {"y": 377,"name": "Security Group 1"},
            {"y": 234,"name": "Security Group 2"},
            {"y": 188,"name": "Security Group 3"},
            {"y": 202,"name": "Security Group 4"},
            {"y": 308,"name": "Security Group 5"}
          ]
        };
        let total = 0;
        for(let i = 0; i < securityGroupChart.data.length; i++){
          total += securityGroupChart.data[i].y;
        }
        securityGroupChart.total = total;

    if (securityGroupChart.data.length <= 1) {
      securityGroupChart.disabled = true;
    }
    securityGroupChart.options = {
      filter: true,
      search: true,
      user: true,
      users: false,
      folder: true,
      archive: true,
      config: true,
      shield: false,
    }
    securityGroupChart.top6 = "Volume: Top 6 Active Group"
    return securityGroupChart;
  },

  foldersChart() {
    var foldersChart = {
          name: 'Folders',
          disabled: false,
          innerSize: '70%',
          colors: ['#FADDB5', '#ED9C27', '#D08011', '#F1AE59', '#6F4509'],
          colorsHover: ['#FADDB5', '#ED9C27', '#D08011', '#F1AE59', '#6F4509'],
          data: [
            {"y": 377,"name": "Folder 1"},
            {"y": 234,"name": "Folder 2"},
            {"y": 188,"name": "Folder 3"},
            {"y": 202,"name": "Folder 4"},
            {"y": 308,"name": "Folder 5"}
          ]
        };
        let total = 0;
        for(let i = 0; i < foldersChart.data.length; i++){
          total += foldersChart.data[i].y;
        }
        foldersChart.total = total;
        foldersChart.options = {
          filter: true,
          search: true,
          user: true,
          users: false,
          folder: false,
          archive: true,
          config: true,
          shield: false,
        }
        foldersChart.top6 = "Volume of Data: Top 6 Folders"
    if (foldersChart.data.length <= 1) {
      foldersChart.disabled = true;
    }

    return foldersChart;
  },

  usersChart() {
    var usersChart = {
          name: 'Users',
          showLegend:'1',
          disabled: false,
          innerSize: '70%',
          colors: ['#3F50A2', '#7986CC', '#8B8FB2', '#EBEEF7', '#9EA8D9'],
          colorsHover: ['#3F50A2', '#7986CC', '#8B8FB2', '#EBEEF7', '#9EA8D9'],
          data: [
            {"y": 37,"name": "User 1"},
            {"y": 234,"name": "User 2"},
            {"y": 88,"name": "User 3"},
            {"y": 22,"name": "User 4"},
            {"y": 308,"name": "User 5"}
          ]
        };
        let total = 0;
        for(let i = 0; i < usersChart.data.length; i++){
          total += usersChart.data[i].y;
        }
        usersChart.total = total;
        usersChart.options = {
          filter: true,
          search: true,
          user: false,
          users: false,
          folder: false,
          archive: true,
          config: true,
          shield: false,
        }
        usersChart.top6 = "Anomaly: Top 6 Users at Risk"
    if (usersChart.data.length <= 1) {
      usersChart.disabled = true;
    }

    return usersChart;
  },

  documentsChart() {
    var documentsChart = {
          name: 'Documents',
          disabled: false,
          innerSize: '70%',
          colors: ['#237C7E', '#349DA1', '#0F2D2F', '#6DCCD0', '#1B5054'],
          colorsHover: ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'],
          data: [
            {"y": 454,"name": "Word.doc"},
            {"y": 408,"name": "Excel.xls"},
            {"y": 322,"name": "PowerPoint.ppt"},
            {"y": 341,"name": "PDF.pdf"},
            {"y": 488,"name": "Other"}
          ]
        };
        let total = 0;
        for(let i = 0; i < documentsChart.data.length; i++){
          total += documentsChart.data[i].y;
        }
        documentsChart.total = total;
        documentsChart.options = {
          filter: true,
          search: true,
          user: false,
          users: false,
          folder: false,
          archive: false,
          config: true,
          shield: false,
        }
        documentsChart.top6 = "Anomaly: Risk Posture(High | Medium | Low)"
    if (documentsChart.data.length <= 1) {
      documentsChart.disabled = true;
    }

    return documentsChart;
  },

  render: template
});

module.exports = AdvancedAnalytics;
