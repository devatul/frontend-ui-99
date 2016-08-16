'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var Chart = React.createClass({
	displayName:'Chart',
	
	getInitialState() {

		return {
			chart_data: this.props.chart_data,
		}
	},
	render(){

		var style= {
			height: '200px',
		}
		return(
			<div>
			<div id="identityChart" className="identity-chart" style= {style} ></div>
			<a href="#" className="btn btn-green btn-extract">Extract</a>
			</div>
			
			);
	},

	componentDidMount(){
		/*var chart_data = {
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
		console.log('chart_data',this.state.chart_data);
		var datas = []; 
		var data = [];
		var data1 = [];
		var one_dataTable = {};
		var high_risk_users=[];
		var categories = [];
		var categories1 = [];

		var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159', '#edc240'];
		for(var i=0; i< _.size(chart_data.high_risk_users) ;i++){	

			categories.push(chart_data.high_risk_users[i].name);
			data.push(
			{
				y: chart_data.high_risk_users[i].docs,
				color: colors[i],
			}
			)
			
		}
		datas.push({
			categories: categories,
			data: data
		})
		for(var i=0; i< _.size(chart_data.high_risk_directory) ;i++){	

			categories1.push(chart_data.high_risk_directory[i].name);
			data1.push(
			{
				y: chart_data.high_risk_directory[i].docs,
				color: colors[i],
			}
			)
			
		}
		datas.push({
			categories: categories1,
			data: data1
		})
		console.log(datas);*/
		
		/*for(var i =0 ; i< _.size(this.state.chart_data.high_risk_users); i++){
			data.push({
				y:chart_data.high_risk_users[i].docs;
				color: #5bc0de;
			})
			/*high_risk_users.push({
				categories: this.state.chart_data.high_risk_users[i].name,
				data : data
			}*/
			




			var datas = [
			{
				categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
				data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 45, color: '#7986cb'},{y: 40, color: '#ed9c28'},{y: 10, color: '#E36159'}]
			},
			{
				categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
				data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
			},
			{
				categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
				data: [{y: 71, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
			},
			{
				categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
				data: [{y: 72, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
			},
			{
				categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
				data: [{y: 73, color: '#5bc0de'},{y: 35, color: '#349da2'},{y: 20, color: '#7986cb'},{y: 10, color: '#ed9c28'},{y: 4, color: '#E36159'}]
			},
			{
				categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
				data: [{y: 74, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 40, color: '#7986cb'},{y: 35, color: '#ed9c28'},{y: 30, color: '#E36159'}]
			},
			{
				categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
				data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
			},
			{
				categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
				data: [{y: 75, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
			},
			];
			
			$('.identity-chart').each(function(index){
				$(this).highcharts({
					chart: {
						type: 'bar'
					},
					title: {
						text: ''
					},
					xAxis: {
						categories: datas[index].categories,
						title: {
							text: null
						},
						tickInterval: 1,
						tickWidth: 0,
						lineWidth: 0,
						minPadding: 0,
						maxPadding: 0,
						gridLineWidth: 0,
						tickmarkPlacement: 'on',
						labels: {
							style: {
								font: '11px Roboto, Helvetica, sans-serif'
							}
						}
					},
					yAxis: {
						min: 0,
						title: {
							text: null
						},
						labels: {
							enabled: false
						}
					},
					legend: {
						enabled:  false
					},
					credits: {
						enabled: false
					},
					plotOptions: {
						bar: {
							dataLabels: {
								enabled: false
							}
						}
					},
					tooltip: {
						formatter: function() {
							return '<b>'+this.x+'</b><br>'+this.series.name+': '+this.y;
						}
					},
					series: [{
						name: 'Documents',
						data: datas[index].data,
					}]
				});
			});

  // CONTENT TOGGLE
  // Configure/customize these variables.
  var showChar = 42;  // How many characters are shown by default
  var ellipsestext = "...";
  var moretext = "more keywords";
  var lesstext = "less keywords";
  
  $('.more').each(function() {
  	var content = $(this).html();

  	if(content.length > showChar) {

  		var c = content.substr(0, showChar);
  		var h = content.substr(showChar, content.length - showChar);

  		var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

  		$(this).html(html);
  	}

  });

  $(".morelink").click(function(){
  	if($(this).hasClass("less")) {
  		$(this).removeClass("less");
  		$(this).html(moretext);
  		$(this).parents('tr').find('.pie-wrapper').removeClass('pie-md').addClass('pie-sm');
  	} else {
  		$(this).addClass("less");
  		$(this).html(lesstext);
  		$(this).parents('tr').find('.pie-wrapper').removeClass('pie-sm').addClass('pie-md');
  	}
  	$(this).parent().prev().toggle();
  	$(this).prev().toggle();
  	return false;
  });
}
});

module.exports= Chart;