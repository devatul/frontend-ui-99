import React, { Component } from 'react';
import { render } from 'react-dom';
import template from './OverView.rt';
import update from 'react-addons-update';
import { isEmpty, forEach, isEqual, upperFirst } from 'lodash'
import javascriptTodo from '../script/javascript.todo.js';
import Constant from '../Constant.js';
import { makeRequest } from '../utils/http.js'
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

    componentWillMount() {
        if(this.state.scan.result.scan_status == Constant.scan.IS_NO_SCAN) {
           this.startScan();
        }
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

    componentDidUpdate(prevProps, prevState) {
        var prevResult = prevState.scan.result
        var result = this.state.scan.result

        if(!isEqual( result, prevResult )) {
            var { iconCategories } = Constant

            this.updateDataChart( result, prevResult )

            forEach(result.categories, (val, index) => {
                if( val.name == iconCategories[index].name )
                    val.class = iconCategories[index].class
            } )
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

    updateDataChart(result, prevResult) {
        var confidentiality = [], categories = [], languages = [], doctypes = [];
        var { confidentialities_chart_data, categories_chart_data } = result
        var { dataChart } = this.state

        //add confidentiality
        if(!isEqual(confidentialities_chart_data, prevResult.confidentialities_chart_data)) {
            forEach(confidentialities_chart_data, (val, index) => {
                confidentiality.push({
                    name: upperFirst(val.name),
                    y: val.total_docs
                })
            })
        } else {
            confidentiality = dataChart.confidentiality
        }
        //add categories
        if(!isEqual(categories_chart_data, prevResult.categories_chart_data)) {
            forEach(categories_chart_data, (val, index) => {
                categories.push({
                    name: upperFirst(val.name),
                    y: val.total_docs
                })
            })
        } else {
            categories = dataChart.categories
        }
        //add languages
        if(!isEqual(result.languages, prevResult.languages)) {
            forEach(result.languages, (val, index) => {
                languages.push({
                    name: upperFirst(val.name),
                    y: val.total_docs
                })
            })
        } else {
            languages = dataChart.languages
        }
        //add doctypes
        if(!isEqual( result['doc-types'], prevResult['doc-types'] )) {
            forEach(result["doc-types"], (val, index) => {
                doctypes.push({
                    name: upperFirst(val.name),
                    y: val.total_docs
                })
            })
        } else {
            doctypes = dataChart.doctypes
        }
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
