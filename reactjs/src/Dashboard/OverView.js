import React, { Component } from 'react';
import { render } from 'react-dom';
import template from './OverView.rt';
import update from 'react/lib/update';
import { isEmpty, forEach, isEqual, upperFirst } from 'lodash'
import javascriptTodo from '../script/javascript.todo.js';
import { _categories, fetching } from '../Constant.js';
import { makeRequest } from '../utils/http.js'
import { orderByIndex } from '../utils/function'
import $, { JQuery } from 'jquery';
var OverView = React.createClass
({
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
            loading: 0
		};
	},

    xhr: {
        getScan: null
    },

	componentDidMount() {
        javascriptTodo();
        //this.setLoading();
        this.xhr.getScan = this.getScanResult();
                      
  	},

    componentWillUnmount() {
        if(this.xhr.getScan && this.xhr.getScan.abort) {
            this.xhr.getScan.abort();
        }

        this.props.updateStore({
            xhr: update(this.props.xhr, {
                isFetching:
                {
                    $set: fetching.SUCCESS
                }
            })
        });

        this.xhr = null;
    },

    shouldComponentUpdate(nextProps, nextState) {
        var { scan, dataChart, configChart } = this.state,
            { categoryLanguageChart, confidentiality, doctypes } = configChart,
            nextConfig = nextState.configChart;
        return this.state.loading != nextState.loading || !isEqual(scan.result, nextState.scan.result) || !isEqual( configChart, nextConfig );
    },

    componentDidUpdate(prevProps, prevState) {
        var prevResult = prevState.scan.result,
            result = this.state.scan.result;

        if(!isEqual( result, prevResult )) {
            this.updateChart( result, prevResult );
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
    setLoading() {
        let delay = 0;
        if(this.state.loading < 100) {
            delay = setInterval(() => {
                let { loading } = this.state;
                this.setState({ loading: ++loading })
                clearInterval(delay)
                this.setLoading()
            },0.5);
        }
    },

    checkLoadingToSetState(state, data) {
        let delay = 0;
        if(this.state.loading < 100) {
            delay = setInterval(() => {
                clearInterval(delay)
                this.checkLoadingToSetState(state, data)
            }, 100)
        } else {
            if(data) {
                this.setState({ [state]: data, loading: 100 });
            }
        }
    },

    getScanResult(){
        this.props.updateStore({
            xhr: update(this.props.xhr, {
                isFetching:
                {
                    $set: fetching.START
                }
            })
        });
        return makeRequest({
            path: 'api/scan/',
            success: (data) => {
                let confidentialities = data.confidentialities;

                data.confidentialities = orderByIndex(confidentialities, [0, 4, 1, 2,3]);
                this.props.updateStore({
                    xhr: update(this.props.xhr, {
                        isFetching:
                        {
                            $set: fetching.SUCCESS
                        }
                    })
                });
                let setResult = update(this.state.scan, {
                    result: { $set: data }
                });
                this.setState({ scan: setResult })
                
            }
        })
    },

    updateChart(result, prevResult) {
        var categoryLanguageData = [], confidentialityData = {}, doctypeData = {},
            { categoryLanguage, confidentiality, doctypes } = this.state.configChart;
        
        if( !isEqual( result.categories, prevResult.categories )
            || !isEqual( result.languages, prevResult.languages) ) {
            categoryLanguageData = this.categoryLanguageChart();
        } else {
            categoryLanguageData = categoryLanguage;
        }
        if( !isEqual( result.confidentialities, prevResult.confidentialities )) {
            confidentialityData = this.confidentialityChart();
        } else {
            confidentialityData = confidentiality;
        }
        if( !isEqual( result.doctypes, prevResult.doctypes ) ) {
            doctypeData = this.doctypesChart();
        } else {
            doctypeData = doctypes;
        }

        let updateData = update(this.state.configChart, {
            categoryLanguage: { $set: categoryLanguageData },
            confidentiality: { $set: confidentialityData },
            doctypes: { $set: doctypeData }
        });
        this.setState({ configChart: updateData });
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
                colors: [ '#2ecd71', '#9b58b5', '#33495e', '#3d2dc3', '#0da8c1'],
                colorsHover: [ '#94e5b7', '#ccaada', '#98a2ad', '#c1bcee', '#8fd1dc'],
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
            { dataChart } = this.state,
            { languages, categories } = this.state.scan.result;
        //add categories
        for(let i = categories.length - 1; i >= 0; i--) {
            categoryChart.data[i] = {
                name: upperFirst(categories[i].name),
                y: categories[i].total_reviewed_docs
            };
        }
        //add languages
        for(let i = languages.length - 1; i >= 0; i--) {
            languageChart.data[i] = {
                name: upperFirst(languages[i].name),
                y: languages[i].total_docs
            };
        }

        categoryNumber = categoryChart.data.length;
        languageNumber = languageChart.data.length;

        if(languageNumber > 1 && categoryNumber > 1) {
            categoryLanguageChart[0] = categoryChart;
            categoryLanguageChart[1] = languageChart;
        }

        if( languageNumber <= 1 && categoryNumber > 1) {
            categoryChart.innerSize = '60%';
            categoryLanguageChart[0] = categoryChart;
        }

        if( categoryNumber <= 1 && languageNumber > 1) {
            languageChart.size = '100%';
            categoryLanguageChart[0] = languageChart;
        } else {
            categoryLanguageChart[0] = categoryChart;
        }

        if( categoryNumber <= 1 && languageNumber <= 1 ) {
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
            colors: [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159', '#89cd6c'],
            colorsHover: [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE', '#c1f9a9'],
            data: []
        }, { confidentialities } = this.state.scan.result;
        for( let i = confidentialities.length - 1; i >= 0; i-- ) {
            confidentialityChart.data[i] = {
                name: upperFirst(confidentialities[i].name),
                y: confidentialities[i].total_reviewed_docs
            };
        }

        if( confidentialityChart.data.length <= 1 ) {
            confidentialityChart.disabled = true;
        }
        return confidentialityChart;
    },

    doctypesChart() {
        var doctypesChart = {
                name: 'Document Type',
                disabled: false,
                innerSize: '60%',
                colors: [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'],
                colorsHover: [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'],
                data: []
            },
            { doctypes } = this.state.scan.result;
        
        for( let i = doctypes.length - 1; i >= 0; i-- ) {
            doctypesChart.data[i] = {
                name: upperFirst(doctypes[i].name),
                y: doctypes[i].total_docs
            };
        }

        if( doctypesChart.data.length <= 1 ) {
            doctypesChart.disabled = true;
        }

        return doctypesChart;
    },

    renderIcon(name) {
        name = name.toLowerCase();

        switch(name) {
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
