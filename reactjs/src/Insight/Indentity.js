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

            sizeFilter: 0,
            scan_result: {},
            rickInsight: {},

            high_risk_users: {},
            high_risk_directory: {},
            key_contributor: []

        };
    },
    /* componentWillMount(){
         this.getRickInsight()
     },*/
    handleFilter: function(bodyRequest) {
        console.log('bodyRequest', bodyRequest)
        if (!_.isEmpty(bodyRequest)) {
            $.ajax({
                url: Constant.SERVER_API + 'api/insight/iam/',
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify(bodyRequest),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
                },
                success: function(data) {
                    console.log('data', data)
                    this.updateChartData(data);

                    this.setState(update(this.state, {
                        scan_result: { $set: data }
                    }));


                }.bind(this),
                error: function(xhr, error) {
                    if (xhr.status === 401) {
                        browserHistory.push('/Account/SignIn');
                    }
                }.bind(this)
            });
        } else {
            this.getScanResult();
        }
    },
    updateChartData(data) {

        var dataChart = [];
        var categories = []


        var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159', '#edc240'];
        for (var i = 0; i < _.size(data.high_risk_users); i++) {

            categories.push(data.high_risk_users[i].name);
            dataChart.push({
                y: data.high_risk_users[i].docs,
                color: colors[i],
            })

        }
        this.setState({
            high_risk_users: {
                categories: categories,
                data: dataChart
            }
        })

        console.log('high_risk_users', this.state.high_risk_users)
        categories = []
        dataChart = []
        categories.length = 0
        dataChart.length = 0

        for (var i = 0; i < _.size(data.high_risk_directory); i++) {

            categories.push(data.high_risk_directory[i].name);
            dataChart.push({
                y: data.high_risk_directory[i].docs,
                color: colors[i],
            })

        }
        this.setState({
            high_risk_directory: {
                categories: categories,
                data: dataChart
            }
        })
        console.log('high_risk_directory', this.state.high_risk_directory)
        categories = []
        dataChart = []
        categories.length = 0
        dataChart.length = 0

        var arr = [];
        for (var i = 0; i < _.size(data.key_contributor); i++) {
            if (data.key_contributor[i].category_name == "accounting") {
                arr["accounting"] = data.key_contributor[i]
                this.setState({ key_contributor: arr })
            }
            if (data.key_contributor[i].category_name == "corporate entity") {
                arr["corporate entity"] = data.key_contributor[i];
                this.setState({ key_contributor: arr })
            }
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
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
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
    getRickType(value) {
        switch (value) {
            case 'unidentifiable files':
                return { color: ' bg-secondary', info: 'Number of files that can not be identified.' };
            case 'access right anomaly':
                return { color: ' bg-quartenary-2', info: 'Number of users who have abnormal access rights.' };
            case 'twin files':
                return { color: '  bg-tertiary-2', info: 'Duplicates files with different names.' };
            case 'document retention':
                return { color: 'bg-secondary-2', info: 'Number of files past outside their retention dates.' };
            case 'document aging':
                return { color: 'bg-tertiary-3', info: 'Number of files outside their retention dates.' };
            case 'duplicate files':
                return { color: ' bg-quartenary-3', info: 'Number of duplicate files.' };
            case 'document repository anomaly':
                return { color: ' bg-quartenary-2', info: 'Number of folders which have content anomalies.' };
            case 'cost savings':
                return { color: ' bg-secondary', info: 'Storage Space with obsolete data.' };
        }
    },
    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
    componentDidMount() {

        this.getRickInsight();
        javascript();
        javascriptOver();

    },
    render: template
});

module.exports = Indentity;
