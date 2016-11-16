import React, {Component} from 'react';
import {render} from 'react-dom';
import template from './OverView.rt';
import update from 'react/lib/update';
import {isEmpty, forEach, isEqual, upperFirst, orderBy} from 'lodash';
import javascriptTodo from '../script/javascript.todo.js';
import {_categories, fetching} from '../Constant.js';
import {makeRequest} from '../utils/http.js';
import {orderByIndex, orderConfidentialities, orderLanguages} from '../utils/function';
import $, {JQuery} from 'jquery';
import Constant from '../Constant'

let hideUndefined = true;

var OverView = React.createClass({
  getInitialState() {
    return {
      scan: {
        result: {}
      },
      configChart: {
        categoryLanguage: [],
        confidentiality: {},
        doctypes: {}
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

        // TODO: Demo fix, to be removed
        if (Constant.MULTIPLIER != 1) {
          data.documents_analyzed = parseInt(data.documents_analyzed) * Constant.MULTIPLIER;
          data.documents_skipped *= Constant.MULTIPLIER;
          data.total_correctly_classified *= Constant.MULTIPLIER;
          data.total_documents_scanned *= Constant.MULTIPLIER;
          data.total_duplicates *= Constant.MULTIPLIER;
          data.total_twins *= Constant.MULTIPLIER;

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
        console.log(data);

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
    var categoryLanguageData = [], confidentialityData = {}, doctypeData = {},
        {categoryLanguage, confidentiality, doctypes} = this.state.configChart;

    if (!isEqual(result.categories, prevResult.categories)
        || !isEqual(result.languages, prevResult.languages)) {
      categoryLanguageData = this.categoryLanguageChart();
    } else {
      categoryLanguageData = categoryLanguage;
    }
    if (!isEqual(result.confidentialities, prevResult.confidentialities)) {
      confidentialityData = this.confidentialityChart();
    } else {
      confidentialityData = confidentiality;
    }
    if (!isEqual(result.doctypes, prevResult.doctypes)) {
      doctypeData = this.doctypesChart();
    } else {
      doctypeData = doctypes;
    }

    let updateData = update(this.state.configChart, {
      categoryLanguage: {$set: categoryLanguageData},
      confidentiality: {$set: confidentialityData},
      doctypes: {$set: doctypeData}
    });
    this.setState({configChart: updateData});
  },

  categoryLanguageChart() {
    var categoryChart = {
          name: 'Category',
          innerSize: '70%',
          disabled: false,
          colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159', '#3c5896', '#020a1d'],
          colorsHover: ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE', '#E4E7F6', '#91949a'],
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
          data: []
        },
        languageChart = {
          name: 'Language',
          size: '65%',
          innerSize: '55%',
          disabled: false,
          colors: ['#2ecd71', '#9b58b5', '#33495e', '#3d2dc3', '#0da8c1'],
          colorsHover: ['#94e5b7', '#ccaada', '#98a2ad', '#c1bcee', '#8fd1dc'],
          dataLabels: {
            formatter: function () {
              var percent = this.percentage.toFixed(1);
              return percent >= 5.0 ? percent + '%' : '';
            },
            color: '#ffffff',
            padding: 0,
            distance: -20
          },
          data: []
        },

        categoryLanguageChart = [],
        categoryNumber = 0,
        languageNumber = 0,
        {dataChart} = this.state,
        {languages, categories} = this.state.scan.result;

    //add data categories
    categories = orderByIndex(categories, [0, 2, 1, 3, 4, 5, 6]);

    for (let i = categories.length - 1; i >= 0; i--) {
      categoryChart.data[i] = {
        name: upperFirst(categories[i].name),
        y: categories[i].total_docs
      };
    }

    //order languages by percentage
    let index = -1;
    let other = null;
    for (let i = 0, len = languages.length; i < len; i++) {
        if (languages[i].short_name.toUpperCase() === 'OTHER') {
            index = i;
            break;
        }
    }

    if (index != -1) {
      other = languages[index];
      languages.splice(index, 1);
    }

    languages = orderBy(languages, ['total_docs'], ['desc']);
    if (index != -1) {
      languages.push(other);
    }

    //add to data chart
    for (let i = languages.length - 1; i >= 0; i--) {
      if (languages[i] == null)
        continue;
      languageChart.data[i] = {
        name: upperFirst(languages[i].name),
        y: languages[i].total_docs
      };
    }

    categoryNumber = categoryChart.data.length;
    languageNumber = languageChart.data.length;

    //Check if data is 0 || 1 => disabled
    if (languageNumber > 1 && categoryNumber > 1) {
      categoryLanguageChart[0] = categoryChart;
      categoryLanguageChart[1] = languageChart;
    }

    if (languageNumber <= 1 && categoryNumber > 1) {
      categoryChart.innerSize = '60%';
      categoryLanguageChart[0] = categoryChart;
    }

    if (categoryNumber <= 1 && languageNumber > 1) {
      languageChart.size = '100%';
      categoryLanguageChart[0] = languageChart;
    } else {
      categoryLanguageChart[0] = categoryChart;
    }

    if (categoryNumber <= 1 && languageNumber <= 1) {
      categoryChart.disabled = true;
      languageChart.disabled = true;

      categoryLanguageChart[0] = categoryChart;
      categoryLanguageChart[1] = languageChart;
    }

    return categoryLanguageChart;
  },

  confidentialityChart() {
    var confidentialityChart = {
          name: 'Confidentiality',
          disabled: false,
          innerSize: '60%',
          colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159', '#89cd6c'],
          colorsHover: ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE', '#c1f9a9'],
          data: []
        },
        {confidentialities} = this.state.scan.result;

    for (let i = confidentialities.length - 1; i >= 0; i--) {
      confidentialityChart.data[i] = {
        name: upperFirst(confidentialities[i].name),
        y: confidentialities[i].total_reviewed_docs
      };
    }

    if (confidentialityChart.data.length <= 1) {
      confidentialityChart.disabled = true;
    }

    return confidentialityChart;
  },

  doctypesChart() {
    var doctypesChart = {
          name: 'Document Type',
          disabled: false,
          innerSize: '60%',
          colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'],
          colorsHover: ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'],
          data: []
        },
        {doctypes} = this.state.scan.result;

    for (let i = doctypes.length - 1; i >= 0; i--) {
      doctypesChart.data[i] = {
        name: upperFirst(doctypes[i].name),
        y: doctypes[i].total_docs
      };
    }

    if (doctypesChart.data.length <= 1) {
      doctypesChart.disabled = true;
    }

    return doctypesChart;
  },

  renderIcon(name) {
    name = name.toLowerCase();

    switch (name) {
      case _categories.ACCOUNTING.name.toLowerCase():
        return _categories.ACCOUNTING.icon;
      case _categories.CLIENT.name.toLowerCase():
        return _categories.CLIENT.icon;
      case _categories.CORPORATE.name.toLowerCase():
        return _categories.CORPORATE.icon;
      case _categories.EMPLOYEE.name.toLowerCase():
        return _categories.EMPLOYEE.icon;
      case _categories.LEGAL.name.toLowerCase():
        return _categories.LEGAL.icon;
      case _categories.TRANSACTION.name.toLowerCase():
        return _categories.TRANSACTION.icon;
      case _categories.UNDEFINED.name.toLocaleLowerCase():
        return _categories.UNDEFINED.icon;
      default:
        return " ";
    }
  },

  handleFilter: function (bodyRequest) {
    if (!isEmpty(bodyRequest)) {
      makeRequest({
        method: 'POST',
        path: 'api/scan/filter/',
        params: JSON.stringify(bodyRequest),
        success: (data) => {
          var setResult = update(this.state.scan, {
            result: {$set: data}
          });
          this.setState({scan: setResult});
        }
      })
    } else {
      this.getScanResult();
    }
  },

  render: template
});

module.exports = OverView;
