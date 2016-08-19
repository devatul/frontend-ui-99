import React, { Component } from 'react';
import { render } from 'react-dom';
import template from './OverView.rt';
import update from 'react-addons-update';
import { isEmpty, forEach, isEqual } from 'lodash'
import javascriptTodo from '../script/javascript.todo.js';
import Constant from '../Constant.js';
import { makeRequest } from '../utils/http.js'
import DonutChart from '../components/chart/DonutChart'
import StackedChart from '../components/chart/StackedChart'
import $, { JQuery } from 'jquery';
var OverView = React.createClass
({
	getInitialState() {
	    return {
            scan: {
                result: {}
            },

            dataChart: {
                categories: [],
                confidentiality: [],
                languages: [],
                doctypes: []
            },

            configChart: {
                categoryChart: [{
                    name: 'Category',
                    innerSize: '80%',
                    colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159', '#3c5896'],
                    colorsHover: ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE', '#E4E7F6'],
                    data: []
                    }, {
                    name: 'Language',
                    size: '80%',
                    innerSize: '60%',
                    colors: [ '#2ecd71', '#9b58b5', '#33495e'],
                    colorsHover: [ '#94e5b7', '#ccaada', '#98a2ad'],
                    data: []
                }],
                confidentiality: {
                    name: 'Confidentiality',
                    innerSize: '60%',
                    colors: [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'],
                    colorsHover: [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'],
                    data: []
                },
                doctypes: {
                    name: 'Document Type',
                    innerSize: '60%',
                    colors: [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'],
                    colorsHover: [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'],
                    data: []
                }
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
        if(this.state.scan.result.scan_status == Constant.scan.IS_NO_SCAN) {
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
        this.startScan();
        if(this.state.scan.result.scan_status != Constant.scan.IS_NO_SCAN) {
            this.getScanResult();
        }
                      
  	},
    shouldComponentUpdate(nextProps, nextState) {
        var { scan, dataChart } = this.state

        return !isEqual(scan.result, nextState.scan.result) || !isEqual(dataChart, nextState.dataChart);
    },

    componentWillUpdate() {

    },

    componentDidUpdate(prevProps, prevState) {
        var prevResult = prevState.scan.result
        var result = this.state.scan.result

        if(!isEqual(result.confidentialities_chart_data, prevResult.confidentialities_chart_data)) {
            debugger
            this.confidentialityChart()
        }

        if(!isEqual(result.categories_chart_data, prevResult.categories_chart_data)) {
            debugger
            this.categoryChart()
        }

        if(!isEqual(result.languages, prevResult.languages)) {
            debugger
            this.languageChart()
        }

        if(!isEqual(result['doc-types'], prevResult['doc-types'])) {
            this.doctypeChart()
        }

        if(!isEqual( result, prevResult )) {
            var { iconCategories } = Constant
            this.updatedataChart(result)
            forEach(result.categories, (val, index) => {
                if( val.name == iconCategories[index].name )
                    val.class = iconCategories[index].class
            } )
        }

        if(this.state.dataChart != prevState.dataChart) {
            debugger
        }
    },

    startScan() {
        makeRequest({
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
    getScanResult(){
        makeRequest({
            path: 'api/scan/',
            success: (data) => {
                var setResult = update(this.state.scan, {
                    result: { $set: data }
                });
                this.setState({ scan: setResult });
            }
        })
    },

    categoryChart() {
        var categories = []
        var { categories_chart_data } = this.state.scan.result
        forEach(categories_chart_data, (val, index) => {
            categories.push({
                name: val.name,
                y: val.total_docs
            })
        })

        var setData = update(this.state.dataChart, {
            categories: { $set: categories }
        })

        this.setState({ dataChart: setData })
    },

    confidentialityChart() {
        var confidentiality = []
        var { confidentialities_chart_data } = this.state.scan.result

        forEach(confidentialities_chart_data, (val, index) => {
            confidentiality.push({
                name: val.name,
                y: val.total_docs
            })
        })
        var setData = update(this.state.dataChart, {
            confidentiality: { $set: confidentiality }
        })
        this.setState({ dataChart: setData })
        debugger
    },

    languageChart() {
        var language = []
        var { languages } = this.state.scan.result

        forEach(languages, (val, index) => {
            language.push({
                name: val.name,
                y: val.total_docs
            })
        })

        var setData = update(this.state.dataChart, {
            languages: { $set: language }
        })

        this.setState({ dataChart: setData })
        debugger
    },

    doctypeChart() {
        var doctype = []
        var { result } = this.state.scan

        forEach(result["doc-types"], (val, index) => {
            doctype.push({
                name: val.name,
                y: val.total_docs
            })
        })

        this.setState({ dataChart: { ['doctypes']: doctype } })
        debugger
    },

    updatedataChart(data) {
        var confidentiality = [], categories = [], languages = [], doctypes = [];
        var { confidentialities_chart_data, categories_chart_data } = data

        //add confidentiality
            forEach(confidentialities_chart_data, (val, index) => {
                confidentiality.push({
                    name: this.ucwords(val.name),
                    y: val.total_docs
                })
            })
        //add categories
            forEach(categories_chart_data, (val, index) => {
                categories.push({
                    name: this.ucwords(val.name),
                    y: val.total_docs
                })
            })
        //add languages
            forEach(data.languages, (val, index) => {
                languages.push({
                    name: this.ucwords(val.name),
                    y: val.total_docs
                })
            })
        //add doctypes
            forEach(data["doc-types"], (val, index) => {
                doctypes.push({
                    name: val.name,
                    y: val.total_docs
                })
            })
        //update into state
            var setData = update(this.state.dataChart, {
                categories: { $set: categories },
                confidentiality: { $set: confidentiality },
                languages: { $set: languages },
                doctypes: { $set: doctypes }
            })
            this.setState({ dataChart: setData });
    },
    handleFilter: function(bodyRequest) {
        if(!isEmpty(bodyRequest)) {
            makeRequest({
                method: 'POST',
                path: 'api/scan/filter/',
                params: JSON.stringify(bodyRequest),
                success: (data) => {
                    var setResult = update(this.state.scan, {
                        result: { $set: data }
                    });
                    this.setState({ scan: setResult });
                }
            })
        } else {
            this.getScanResult();
        }
    },
    
	render:template
});
module.exports = OverView;
