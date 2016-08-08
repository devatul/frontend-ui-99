import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import template from './OverView.rt';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import update from 'react-addons-update';
import _ from 'lodash'
import javascriptTodo from '../script/javascript.todo.js';
import scriptOverview from '../script/javascript-overview.js'
import Constant from '../Constant.js';
import chartOverview from '../script/chart-overview.js';
import $, { JQuery } from 'jquery';
var OverView = React.createClass
({
    mixins: [LinkedStateMixin],
	getInitialState() {
	    return {
            scan_result:{},
            ChartData: {
                data_confidentiality: [],
                data_categories: [],
                data_languages: [],
                data_doctypes: []
            }
		};
	},
    addCommas(nStr)
    {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    componentWillMount() {
        if(this.state.scan_result.scan_status == Constant.scan.IS_NO_SCAN) {
           this.startScan();
        }

    },
    ucwords:function(str){
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function (a) {
            return a.toUpperCase();
        });
    },
	componentDidMount() {
        $('#bell').click();
        javascriptTodo();
        if(this.state.scan_result.scan_status != Constant.scan.IS_NO_SCAN) {
            this.getScanResult();
        }
                      
  	},
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.scan_result != nextState.scan_result) {
            return true;
        }
        if(this.state.ChartData != nextState.ChartData) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.scan_result != prevState.scan_result) {
            this.updateChartData(this.state.scan_result);

            for(var i=0; i < this.state.scan_result.categories.length; i++)
            {
                console.log(i);
                //this.state.scan_result.categories.class='';
                for(var j=0; j < Constant.iconCategories.length; j++){
                    if(this.state.scan_result.categories[i].name == Constant.iconCategories[j].name)
                    {
                        this.state.scan_result.categories[i].class = Constant.iconCategories[j].class;
                        break;
                    }
                }
            }
        }
        if(this.state.ChartData != prevState.ChartData) {
            chartOverview(this.state.ChartData);
        }

    },
    componentWillUpdate(){
    },
    startScan() {
        $.ajax({
            method: 'POST',
            url: Constant.SERVER_API + 'api/scan/',
            dataType: 'application/json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            }
        })
        .done(function(data) {
                    console.log("Start Scan success", data);
        }.bind(this))
        .fail(function(error) {
            if(error.status == 201) {
                var update_scan_status = update(this.state, {
                    scan_result: {
                        scan_status: {$set: Constant.scan.IS_SCANING}
                    } 
                });
                this.setState(update_scan_status);
                console.log("asdfasdfasd fiale", this.state.scan_result.scan_status);
            }
        }.bind(this));
    },
    getScanResult(){
        $.ajax({
            url: Constant.SERVER_API + 'api/scan/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.updateChartData(data);
                var update_scan_result = update(this.state, {
                    scan_result: {$set: data}
                });
                this.setState(update_scan_result);
                console.log("scan result: ", data);
            }.bind(this),
            error: function(xhr, status, error) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
       
    },
    updateChartData(data) {
        var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159', '#edc240'];
        var color_language = ['#2ecc71', '#9b59b6', '#34495e','#edc240'];
        var data_confidentiality = [];
        var data_categories = [];
        var data_languages = [];
        var data_doctypes = [];
        //add data_confidentiality
            for(var i = 0; i < data.confidentialities_chart_data.length; i++) {
                
                data_confidentiality.push({
                    label: this.ucwords(data.confidentialities_chart_data[i].name),
                    data: [
                        [data.confidentialities_chart_data[i].percentage_docs,data.confidentialities_chart_data[i].total_docs]
                    ],
                    color: colors[i]
                });
            }
        //add data_categories
            for(var i = 0; i < data.categories_chart_data.length; i++) {
                data_categories.push({
                    label: this.ucwords(data.categories_chart_data[i].name),
                    data: [
                        [5 , data.categories_chart_data[i].total_docs]
                    ],
                    color: colors[i]
                });
            }
        //add data_languages
            for(var i = 0; i < data.languages.length; i++) {
                data_languages.push({
                    label: (data.languages[i].short_name == null) ? this.ucwords(data.languages[i].name) : this.ucwords(data.languages[i].short_name),
                    data: [
                        [1, data.languages[i].total_docs]
                    ],
                    color: color_language[i]
                });
            }
        //add data_doctypes
            for(var i = 0; i < data["doc-types"].length; i++) {
                data_doctypes.push({
                    label: this.ucwords(data["doc-types"][i].name),
                    data: [
                        [1, data["doc-types"][i].total_docs]
                    ],
                    color: colors[i]
                });
            }
        //update into state
            var update_chart_data = update(this.state, {
                  ChartData: {
                    data_confidentiality: {$set: data_confidentiality},
                    data_categories: {$set: data_categories},
                    data_languages: {$set: data_languages},
                    data_doctypes: {$set: data_doctypes}
                  }
                });
            this.setState(update_chart_data);
    },
    handleFilter: function(bodyRequest) {
        console.log('bodyRequest', bodyRequest);
        if(!_.isEmpty(bodyRequest)) {
            $.ajax({
                url: Constant.SERVER_API + 'api/scan/filter/',
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify(bodyRequest),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
                },
                success: function(data) {
                    this.updateChartData(data);
                    this.setState(update(this.state, {
                        scan_result: {$set: data}
                    }));
                }.bind(this),
                error: function(xhr, error) {
                    if(xhr.status === 401)
                    {
                        browserHistory.push('/Account/SignIn');
                    }
                }.bind(this)
            });
        } else {
            this.getScanResult();
        }
    },
	render:template
});
module.exports = OverView;
