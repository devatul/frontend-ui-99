import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Indentity.rt'
import Constant from '../Constant.js'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import javascriptOver from '../script/javascript-overview.js'
import javascript from '../script/javascript.js'
import update from 'react-addons-update'
import _ from 'lodash'

import $, { JQuery }  from 'jquery'
/*import loadScript from '../script/load.scripts.js';*/
var Indentity = React.createClass({
	mixins: [LinkedStateMixin],
	getInitialState() {

		return {

			sizeFilter : 0,
			scan_result:{},
			rickInsight :{
				"stale_files": {
					"total": 165850,
					"top_right": 127000,
					"years": [
					{
						"value": 150000,
						"time": "1-2 years"
					},
					{
						"value": 15860,
						"time": "3+ years"
					}
					]
				},
				"risks": [
				{
					"previous_scan_value": 10720,
					"name": "unidentified files",
					"current_scan_value": 10000
				},
				{
					"previous_scan_value": 10720,
					"name": "access right anomaly",
					"current_scan_value": 10000
				}
				]
			},

			high_risk_users: {},
			high_risk_directory : {},
			key_contributor : []
			
		};
	},
	
	handleFilter: function(bodyRequest) {
		console.log('bodyRequest',bodyRequest)
		if(!_.isEmpty(bodyRequest)) {
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
	updateChartData(data){
		
		var dataChart = [];
		var categories = []
		

		var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159', '#edc240'];
		for(var i=0; i< _.size(data.high_risk_users) ;i++){	

			categories.push(data.high_risk_users[i].name);
			dataChart.push(
			{
				y: data.high_risk_users[i].docs,
				color: colors[i],
			}
			)

		}
		this.setState({
			high_risk_users : {
				categories : categories,
				data : dataChart
			}
		})
		
		console.log('high_risk_users', this.state.high_risk_users)
		categories = []
		dataChart = []
		categories.length =0 
		dataChart.length = 0

		for(var i=0; i< _.size(data.high_risk_directory) ;i++){	

			categories.push(data.high_risk_directory[i].name);
			dataChart.push(
				{
					y: data.high_risk_directory[i].docs,
					color: colors[i],
				}
			)

		}
		this.setState({
			high_risk_directory : {
				categories : categories,
				data : dataChart
			}
		})
		console.log('high_risk_directory', this.state.high_risk_directory)
		categories = []
		dataChart = []
		categories.length =0 
		dataChart.length = 0

		var arr= [];
		for(var i=0; i< _.size(data.key_contributor) ;i++){
			if(data.key_contributor[i].category_name == "accounting"){
				arr["accounting"] = data.key_contributor[i] 
				this.setState({key_contributor : arr}) 
				console.log('key_contributor' , this.state.key_contributor)
			}
			if(data.key_contributor[i].category_name == "corporate entity"){
				arr["corporate entity"] = data.key_contributor[i];
				this.setState({key_contributor : arr})
				console.log('key_contributor', this.state.key_contributor)
			}
		}

	},
	componentDidMount() 
	{	
		javascript();
		javascriptOver();
		
	},
	render:template
});

module.exports= Indentity;