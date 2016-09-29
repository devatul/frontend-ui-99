import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Indentity.rt'
import Constant from '../Constant.js'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import javascriptOver from '../script/javascript-overview.js'
import javascript from '../script/javascript.js'
import update from 'react/lib/update'
import _ from 'lodash'

import $, { JQuery } from 'jquery'
/*import loadScript from '../script/load.scripts.js';*/
var Indentity = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {

        return {
            data_exports: {},
            sizeFilter: 0,
            save_dataChart: {},
            save_cvs: {},
            scan_result: {},
            rickInsight: {},
            dataChart: {
                high_risk_users: {},
                high_risk_directory: {},
                key_contributor: []
            },
        };
    },
     componentWillMount(){
         this.getRickInsight()
     },
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.dataChart != nextState.dataChart) {
            return true
        }
        if (this.setState.sizeFilter != nextState.sizeFilter) {
            return true
        }
        if (this.state.data_exports != nextState.data_exports) {
            return true
        }
        /*if (this.state.save_cvs != nextState.save_cvs) {
            return true
        }*/
        return false
    },
    /* componentDidUpdate(prevProps, prevState) {
         if (this.state.sizeFilter != prevState.sizeFilter) {
             debugger
             this.changeChart(this.state.sizeFilter)
         }
     },*/
    handleFilter: function(bodyRequest) {

        /* let dataChart = _.cloneDeep(this.state.dataChart)*/
        let value = bodyRequest.number_users;
        console.log('bodyRequest', bodyRequest)
        if (value == 'Top 5') {
            value = 5
        }
        if (value == 'Top 15') {
            value = 15
        }
        if (value == 'Top 25') {
            value = 25
        }
        if (value == 'Top 50') {
            value = 50
        }
        this.filterData(value);
    },
    filterData(value) {
        debugger
        let new_key_contributor = []
        let dataChart = _.cloneDeep(this.state.save_dataChart)
        let new_risk_users = {
            categories: _.slice(dataChart.high_risk_users.categories, 0, value),
            data: _.slice(dataChart.high_risk_users.data, 0, value)
        }
        let new_risk_directory = {
            categories: _.slice(dataChart.high_risk_directory.categories, 0, value),
            data: _.slice(dataChart.high_risk_directory.data, 0, value)
        }
        for (let i = 0; i < dataChart.key_contributor.length; i++) {
            new_key_contributor.push({
                category_name: dataChart.key_contributor[i].category_name,
                contributors: {
                    categories: _.slice(dataChart.key_contributor[i].contributors.categories, 0, value),
                    data: _.slice(dataChart.key_contributor[i].contributors.data, 0, value)
                }

            })
        }

        let new_key_contributor_cvs = []
        let data_cvs = _.cloneDeep(this.state.save_cvs)
        let new_risk_users_cvs = _.slice(data_cvs.high_risk_users, 0, value)
        let new_risk_directory_cvs = _.slice(data_cvs.high_risk_directory, 0, value)
        for (let i = 0; i < data_cvs.key_contributor.length; i++) {
            new_key_contributor_cvs.push({
                category_name: data_cvs.key_contributor[i].category_name,
                contributors:  _.slice(data_cvs.key_contributor[i].contributors, 0, value)

            })
        }
        /*  let new_key_contributor = {
              categories: _.slice(dataChart.key_contributor.contributors.categories, 0, value),
              data: _.slice(dataChart.key_contributor.contributors.data, 0, value)
          }*/
        let updateFilter = update(this.state, {
            dataChart: {
                high_risk_users: { $set: new_risk_users },
                high_risk_directory: { $set: new_risk_directory },
                key_contributor: { $set: new_key_contributor }
            },
             data_exports: {
                high_risk_users: { $set: new_risk_users_cvs },
                high_risk_directory: { $set: new_risk_directory_cvs },
                key_contributor: { $set: new_key_contributor_cvs }
            }
        })
        this.setState(updateFilter)
    },
    filterData_cvs(value){
        debugger

        let new_key_contributor = []
        let data_cvs = _.cloneDeep(this.state.save_cvs)
        let new_risk_users = _.slice(data_cvs.high_risk_users, 0, value)
        let new_risk_directory = _.slice(data_cvs.high_risk_directory, 0, value)
        for (let i = 0; i < data_cvs.key_contributor.length; i++) {
            new_key_contributor.push({
                category_name: data_cvs.key_contributor[i].category_name,
                contributors:  _.slice(data_cvs.key_contributor[i].contributors, 0, value)

            })
        }
        let updateData_cvs = update(this.state, {
            data_exports: {
                high_risk_users: { $set: new_risk_users },
                high_risk_directory: { $set: new_risk_directory },
                key_contributor: { $set: new_key_contributor }
            }
        })
        this.setState(updateData_cvs)
    },
    getDummyData() {

        var data = {
                "high_risk_users": [{
                    "name": "Jack Gilford",
                    "docs": 90
                }, {
                    "name": "Judith McConnell",
                    "docs": 85
                }, {
                    "name": "Farley.Granger",
                    "docs": 80
                }, {
                    "name": "Bob.Hope",
                    "docs": 75
                }, {
                    "name": "Alice.Ghostley",
                    "docs": 74
                }, {
                    "name": "Jack Gilford",
                    "docs": 69
                }, {
                    "name": "Judith McConnell",
                    "docs": 67
                }, {
                    "name": "Farley.Granger",
                    "docs": 62
                }, {
                    "name": "Alice.Ghostley",
                    "docs": 60
                }, {
                    "name": "Jack Gilford",
                    "docs": 55
                }, {
                    "name": "Judith McConnell",
                    "docs": 54
                }, {
                    "name": "Farley.Granger",
                    "docs": 52
                }, {
                    "name": "Alice.Ghostley",
                    "docs": 50
                }, {
                    "name": "Bob.Hope",
                    "docs": 44
                }, {
                    "name": "Judith McConnell",
                    "docs": 36
                }],

                "high_risk_directory": [{
                    "name": "ADCompl.WE",
                    "docs": 93
                }, {
                    "name": "ADHR.WR",
                    "docs": 90
                }, {
                    "name": "ADHR.WR",
                    "docs": 88
                }, {
                    "name": "ADHR.WR",
                    "docs": 82
                }, {
                    "name": "ADHR.WE",
                    "docs": 79
                }, {
                    "name": "ADCompl.WE",
                    "docs": 73
                }, {
                    "name": "ADHR.WR",
                    "docs": 73
                }, {
                    "name": "ADHR.WR",
                    "docs": 70
                }, {
                    "name": "ADHR.WR",
                    "docs": 67
                }, {
                    "name": "ADHR.WE",
                    "docs": 63
                }, {
                    "name": "ADCompl.WE",
                    "docs": 60
                }, {
                    "name": "ADHR.WR",
                    "docs": 56
                }, {
                    "name": "ADHR.WR",
                    "docs": 45
                }, {
                    "name": "ADHR.WR",
                    "docs": 40
                }, {
                    "name": "ADHR.WE",
                    "docs": 39
                }],
                "key_contributor": [{
                    "category_name": "accounting",
                    "contributors": [{
                        "name": "Jack Gilford",
                        "docs": 90
                    }, {
                        "name": "Judith McConnell",
                        "docs": 85
                    }, {
                        "name": "Farley.Granger",
                        "docs": 80
                    }, {
                        "name": "Bob.Hope",
                        "docs": 75
                    }, {
                        "name": "Alice.Ghostley",
                        "docs": 74
                    }, {
                        "name": "Jack Gilford",
                        "docs": 69
                    }, {
                        "name": "Judith McConnell",
                        "docs": 67
                    }, {
                        "name": "Farley.Granger",
                        "docs": 62
                    }, {
                        "name": "Alice.Ghostley",
                        "docs": 60
                    }, {
                        "name": "Jack Gilford",
                        "docs": 55
                    }, {
                        "name": "Judith McConnell",
                        "docs": 54
                    }, {
                        "name": "Farley.Granger",
                        "docs": 52
                    }, {
                        "name": "Alice.Ghostley",
                        "docs": 50
                    }, {
                        "name": "Bob.Hope",
                        "docs": 44
                    }, {
                        "name": "Judith McConnell",
                        "docs": 36
                    }]
                }, {
                    "category_name": "corporate entity",
                    "contributors": [{
                        "name": "Jack Gilford",
                        "docs": 90
                    }, {
                        "name": "Judith McConnell",
                        "docs": 85
                    }, {
                        "name": "Farley.Granger",
                        "docs": 80
                    }, {
                        "name": "Bob.Hope",
                        "docs": 75
                    }, {
                        "name": "Alice.Ghostley",
                        "docs": 74
                    }, {
                        "name": "Jack Gilford",
                        "docs": 69
                    }, {
                        "name": "Judith McConnell",
                        "docs": 67
                    }, {
                        "name": "Farley.Granger",
                        "docs": 62
                    }, {
                        "name": "Alice.Ghostley",
                        "docs": 60
                    }, {
                        "name": "Jack Gilford",
                        "docs": 55
                    }, {
                        "name": "Judith McConnell",
                        "docs": 54
                    }, {
                        "name": "Farley.Granger",
                        "docs": 52
                    }, {
                        "name": "Alice.Ghostley",
                        "docs": 50
                    }, {
                        "name": "Bob.Hope",
                        "docs": 44
                    }, {
                        "name": "Judith McConnell",
                        "docs": 36
                    }]
                }]
            }
        this.updateChartData(data)

    },
    updateChartData(datas) {

        var high_risk_users = {}
        var high_risk_directory = {}
        var key_contributor = []
        var arr = [];

        high_risk_users = this.configChart(datas.high_risk_users)
        high_risk_directory = this.configChart(datas.high_risk_directory)

        for (var i = 0; i < _.size(datas.key_contributor); i++) {
            if (datas.key_contributor[i].category_name == "accounting") {
                arr["accounting"] = datas.key_contributor[i]
                key_contributor.push({
                    category_name: 'Accounting / Tax',
                    contributors: (this.configChart(arr["accounting"].contributors))
                })
            }
            if (datas.key_contributor[i].category_name == "corporate entity") {
                arr["corporate_entity"] = datas.key_contributor[i];
                key_contributor.push({
                    category_name: 'Corporate Entity',
                    contributors: (this.configChart(arr["corporate_entity"].contributors))
                })
            };
        }
        var updateData_config = update(this.state, {
            dataChart: {
                high_risk_users: { $set: high_risk_users },
                high_risk_directory: { $set: high_risk_directory },
                key_contributor: { $set: key_contributor }
            },
            save_dataChart: {
                high_risk_users: { $set: high_risk_users },
                high_risk_directory: { $set: high_risk_directory },
                key_contributor: { $set: key_contributor }
            },
            data_exports: { $set: datas },
            save_cvs: { $set: datas }
        })
        this.setState(updateData_config)

    },

    configChart(object) {
        var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159', '#edc240', '#8cc1d1', '#b0d6e1', '#349da1', '#8ababc', '#aecccc', '#7986cc', '#a5aaca', '#c0c4df', '#e46159'];
        var dataChart = [];
        var categories = [];
        for (var i = 0; i < _.size(object); i++) {

            categories.push(object[i].name);
            dataChart.push({
                y: object[i].docs,
                color: colors[i],
            })

        }
        return {
            categories: categories,
            data: dataChart
        }

        /* high_risk_users.push({
     categories: categories,
     data: dataChart
 })
*/
    },
    getRickInsight() {

        $.ajax({

            url: Constant.SERVER_API + 'api/insight/risk/',
            dataType: 'json',
            type: 'GET',

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                console.log('data', data)
                this.setState({ rickInsight: data })

            }.bind(this),
            error: function(xhr, error) {
                /* if (xhr.status === 401) {
                     browserHistory.push('/Account/SignIn');
                 }*/
            }.bind(this)
        });
    },
    upperFirst(value) {
        let sp = _.split(value, ' ');
        let rt = ''
        for (let i = 0; i < sp.length; i++) {

            rt += _.upperFirst(sp[i]) + ' ';
        }
        return rt

    },
    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    },

    downloadCSV(value, datas) {

        var data, filename, link;

        var csv = this.convertArrayOfObjectsToCSV({
            data: datas
        });
        if (csv == null) return;

        filename = value+'.csv' || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    },
    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
    componentWillMount() {
        this.getDummyData();
    },
    componentDidMount() {
        this.handleFilter({ number_users: 'Top 5' });
        javascript();
        javascriptOver();

    },
    render: template
});

module.exports = Indentity;
