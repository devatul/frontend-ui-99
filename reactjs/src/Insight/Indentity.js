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

var Indentity = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            numberUser: 5,
            data_exports: {},
            sizeFilter: 0,
            height_0: 0,
            height_1: 0,
            height_2: 0,
            height_3: 0,
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
        return false
    },
    handleFilter: function(bodyRequest) {
        debugger
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

        $.ajax({

            url: Constant.SERVER_API + 'api/insight/iam?number_users=' + value,
            dataType: 'json',
            type: 'GET',

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                debugger
                console.log('data', data)
                this.updateChartData(data)
                    /* this.setState({ rickInsight: data })*/

            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
        /* this.filterData(value);*/
    },

    getData() {
        $.ajax({

            url: Constant.SERVER_API + 'api/insight/iam?number_users=5',
            dataType: 'json',
            type: 'GET',

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                console.log('data', data)
                this.updateChartData(data)
                    /* this.setState({ rickInsight: data })*/

            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });

    },
    updateChartData(datas) {
        debugger
        var high_risk_users = {}
        var high_risk_directory = {}
        var key_contributor = []
        var arr = []
        var height_0 = 0
        var height_1 = 0
        var height_2 = 0
        var height_3 = 0

        high_risk_users = this.configChart(datas.high_risk_users)
        high_risk_directory = this.configChart(datas.high_risk_directory)

        height_0 = _.size(high_risk_users) > _.size(high_risk_directory) ? _.size(high_risk_users) * 100 : _.size(high_risk_directory) * 100

        for (var i = 0; i < _.size(datas.key_contributor); i++) {
            arr[i] = datas.key_contributor[i]
            key_contributor.push({
                category_name: arr[i].category_name,
                contributors: (this.configChart(arr[i].contributors))
            })
        }
        console.log('key_contributor', key_contributor)

        height_1 = _.size(key_contributor[0].contributors.categories) > _.size(key_contributor[1].contributors.categories) ? _.size(key_contributor[0].contributors.categories) * 40 : _.size(key_contributor[1].contributors.categories) * 40

        height_2 = _.size(key_contributor[2].contributors.categories) > _.size(key_contributor[3].contributors.categories) ? _.size(key_contributor[2].contributors.categories) * 40 : _.size(key_contributor[3].contributors.categories) * 40

        height_3 = _.size(key_contributor[4].contributors.categories) > _.size(key_contributor[5].contributors.categories) ? _.size(key_contributor[4].contributors.categories) * 40 : _.size(key_contributor[5].contributors.categories) * 40

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
            save_cvs: { $set: datas },
            height_0: { $set: height_0 },
            height_1: { $set: height_1 },
            height_2: { $set: height_2 },
            height_3: { $set: height_3 }
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

        filename = value + '.csv' || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    },
    formatNameCategory(str) {
        return _.replace(str, '/', ' / ')
    },
    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
    componentWillMount() {
        this.getRickInsight()
    },
    componentDidMount() {
        this.getData();
        javascript();
        javascriptOver();

    },
    render: template
});

module.exports = Indentity;
