import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Indentity.rt'
import Constant from '../Constant.js'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'
/*import loadScript from '../script/load.scripts.js';*/
var Indentity = React.createClass({
	
	static: {
		categoryId: 'categories',
		confidentialId: 'confidentialities',
		doctypeId: 'doc-types',
		languageId: 'languages',
		selectAll: 'select_all'
	},
	getInitialState() {

		return {
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

			chart_data : {
				"key_contributor": [
				{
					"contributors": [
					{
						"docs": 60,
						"name": "Jack.Gilford"
					},
					{
						"docs": 54,
						"name": "Judith McConnell"
					}
					],
					"category_name": "accounting"
				},
				{
					"contributors": [
					{
						"docs": 60,
						"name": "Jack.Gilford"
					},
					{
						"docs": 54,
						"name": "Judith McConnell"
					}
					],
					"category_name": "corporate entity"
				}
				],

				"high_risk_users": [
				{
					"docs": 60,
					"name": "Jack Gilford"
				},
				{
					"docs": 54,
					"name": "Judith McConnell"
				}
				],

				"high_risk_directory": [
				{
					"docs": 60,
					"name": "ADCompl.WE"
				},
				{
					"docs": 60,
					"name": "ADHR.WR"
				}
				]
			}

			
		};
	},
	
	Filter: function(bodyRequest) {
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

					console.log("scan result: ", data);
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
	componentDidMount() 
	{
	},
	render:template
});

module.exports= Indentity;