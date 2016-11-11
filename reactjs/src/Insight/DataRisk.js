import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DataRisk.rt'
import 'jquery'
import Constant from '../Constant.js'
import javascriptOver from '../script/javascript-overview.js'
import javascript from '../script/javascript.js'
import { getDataRisk } from '../utils/function'

 var DataRisk= React.createClass({
  	getInitialState() {
	    return {
            dataRisk : {}
	    };
	},
    getData() {
        getDataRisk({
            number_users: "5",
            success: function(data) {
                console.log('data', data)
               this.setState(Object.assign({}, this.state, {dataRisk : data}));
               /* this.setState({ rickInsight: data })*/

            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
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
        this.setState(Object.assign({}, this.state, {numberUser : value}));
        getDataRisk({

            number_users: value,
            success: function(data) {
                console.log('data', data)
                this.setState(Object.assign({}, this.state, {dataRisk : data}));
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
    formatNumber(number){
        if(number == null){
            return 0
        }else {
            let n = parseFloat(number);
            return Math.round(n * 1000)/1000;
        }
    },
    floor(number){
        return Math.floor(number)
    },
	componentDidMount(){
        this.getData();
		javascript();
		javascriptOver();
	},
    render:template
});
 module.exports = DataRisk;