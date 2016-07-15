import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './GroupReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import chart from '../script/chart-review.js'
import Constant from '../Constant.js'
require('jquery');

var GroupReview = React.createClass({
    displayName: 'GroupReview',
    getInitialState: function() {
    	return {
    		list_group:[],
    		group_current: {},
    		statistics: {},
    		cloudwords: [],
    		centroids: [],
    		samples: [],
    		categories: []
    	};
    },
    componentWillMount() {
        this.getGroup();
    },
    componentDidMount() {
        this.getStatistics(this.state.group_current);
        this.getCloudwords(this.state.group_current);
        this.getCentroids(this.state.group_current);
        this.getSamples(this.state.group_current);
        this.getCategories(this.state.group_current);
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.group_current != nextState.group_current) {
            return true;
        }
        if(this.state.statistics != nextState.statistics) {
            return true;
        }
        if(this.state.samples != nextState.samples) {
            return true;
        }
        if(this.state.centroids != nextState.centroids) {
        	return true;
        }
        if(this.state.categories != nextState.categories) {
            return true;
        }
        return false;
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.state.categories != prevState.categories) {
            this.drawChart(this.state.categories);
        }
    },
    getGroup() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/",
            dataType: 'json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    list_group: {$set: data},
                    group_current: {$set: data[0]}
                });
                this.setState(updateState);
                console.log("asdfasdfasdfasd", data);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    changeGroup() {
    	$('#choose_cluster').change(function(element){
                console.log(element.target.value);
                var group_selected = element.target.value;
                var updateState = update(this.state, {
                    group_current: {$set: this.state.list_group[group_selected]}
                });
                this.setState(updateState);
        }.bind(this))
    },
    getStatistics(group_current) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/statistics/",
            dataType: 'json',
            data: { "id":group_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    statistics: {$set: data}
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCloudwords(group_current) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/cloudwords/",
            dataType: 'json',
            data: { "id":group_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({ cloudwords: [] });
                for (var i = 0; i < data.length; i++) {
                    var updateState = update(this.state, {
                        cloudwords: {$push: [{text: data[i].name, weight: data[i].count}]}
                    });
                    this.setState(updateState);
                }
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCentroids(group_current) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/centroids",
            dataType: 'json',
            data: { "id":group_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
            	this.setState({ centroids: [] });
            	for(var i = 0; i < data.length; i++) {
            		var updateState = update(this.state, {
		                centroids: {$push: [[data[i].distance, data[i].number_docs]]}
		            });
		            this.setState(updateState);
            	}
                console.log("centroids: ", this.state.centroids);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getSamples(group_current) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/samples",
            dataType: 'json',
            data: { "id":group_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    samples: {$set: data}
                });
                this.setState(updateState);
                console.log("doc", data);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCategories(group_current) {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/categories/",
            dataType: 'json',
            data: { "id":group_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    categories: {$set: data}
                });
                this.setState(updateState);
                console.log("asfdasdfasdfasdfasdfasdfa",  data);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    drawCloud(cloudwords) {
        var cloudRendered = false;
        if (!cloudRendered){
          $("#words-cloud").jQCloud(cloudwords,{
            afterCloudRender: function(){
              cloudRendered = true;
            }
          });
        }
        
        $(window).resize(function(){
            //$('#words-cloud').jQCloud('update', word_list);
            $('#words-cloud').css("width", "100%");
            $('#words-cloud').html('').jQCloud(cloudwords) 
        });
    },
    drawCentroid(centroids) {
        $('#centroidChart').highcharts({
            chart: {
                type:'column'
            },
            xAxis: {
                startOnTick: true,
                min: 0,
                step: 2,
                max: 10,
                startOnTick: true,
                endOnTick: true,
                tickInterval: 1,
            },
            yAxis: {
              title: {
                  text: 'Number of Documents'
              },
            },
            credits: {
              enabled: false
            },
            title: {
              text: ''
            },

            legend: {
              enabled: false
            },
            
            plotOptions: {
              column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                      textShadow: '0 0 3px black'
                    }
                },
                pointPadding: 0,
                borderWidth: 1,              
                groupPadding: 0,
                pointPlacement: -0.5
              }
            },
            
            series: [{
                data: centroids
            }]
        });
    },
    drawChart(categories) {
    	if( $('#confidentialityChart').length){
		var flotPieData = [];
		var highchart = [];
		var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'];
			for(var i = 0; i < categories.length; i++) {
				flotPieData.push({
					label: categories[i].name,
		            data: [
		                [1, categories[i].percentage]
		            ],
		            color: colors[i]
				});
				highchart.push({
					name: categories[i].name,
		            data: [categories[i].doc_types[1].total,0,categories[i].doc_types[0].total,0,0]
				});
			}
		}

        var plot = $.plot('#confidentialityChart', flotPieData, {
            series: {
                pie: {
                    show: true,
                    label:{
                      show: true,
                      formatter: function labelFormatter(label, series) {
                          return "<div style='font-size:8pt; max-width:60px; line-height: 12pt; text-align:center; padding:2px; color:"+series.color+"'>" + label + "</div>";
                      }
                    }
                }
            },
            legend: {
                show: true,
                position: 'nw',
                noColumns: 1, 
                backgroundOpacity: 0 ,
                container: $('#confidentialityChartLegend')
            },
            grid: {
                hoverable: true,
                clickable: true,
            }
        });

        if ($('#confidentialityLevelChart').length){
		    $('#confidentialityLevelChart').highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: ''
		        },
		        credits: {
		          enabled: false
		        },
		        colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'],
		        xAxis: {
		            categories: ['Word', 'Excel', 'PDF', 'Power Point', 'Other'],
		            labels:{
		              autoRotation: false,
		              style: {
		                color: '#272727',
		                'font-size': '10px'
		              },
		            },
		            tickInterval: 1,
		            tickWidth: 0,
		            lineWidth: 0,
		            minPadding: 0,
		            maxPadding: 0,
		            gridLineWidth: 0,
		            tickmarkPlacement: 'on'
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            },
		            stackLabels: {
		                enabled: false
		            }
		        },
		        legend: {
		            verticalAlign: 'bottom',
		            shadow: false,
		            useHTML: true
		        },
		        tooltip: {
		            headerFormat: '<b>{point.x}</b><br/>',
		            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
		        },
		        plotOptions: {
		            column: {
		                stacking: 'normal',
		                dataLabels: {
		                    enabled: false,
		                }
		            }
		        },
		        series: highchart
		    });
		 }
    },
    render:template
});

module.exports = GroupReview;