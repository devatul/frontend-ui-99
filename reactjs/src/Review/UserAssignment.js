import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './UserAssignment.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import javascript from '../script/javascript.js';
import Constant from '../Constant.js'
import userAssignment from '../script/javascript.assignement.js'
import javascriptOverview from '../script/javascript-overview.js'
import 'jquery'

var UserAssignment = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            categories: [],
            category_Info: [],
            filter: []
        };
    },
    componentWillUnmount() {  
    },
    componentDidMount() {
    	this.getCategories();
    	this.getCategoryInfo(1);
    	userAssignment();
    	javascript();
    },
    shouldComponentUpdate(nextProps, nextState) {
    	if(this.state.categories != nextState.categories) {
    		return true;
    	}
        if(this.state.category_Info != nextState.category_Info) {
        	return true;
        }
        if(this.state.filter != nextState.filter) {
        	return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
    	if(this.state.category_Info != prevState.category_Info) {
        	this.chartAssignment(this.state.category_Info);
        }
    	if(prevState.filter != this.state.filter) {
    		this.chartUserFilter();
    	}
    },
    getCategories() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/category/",
            dataType: 'json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    categories: {$set: data},
                });
                this.setState(updateState);
                console.log("categories: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("categories error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCategoryInfo(id) {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/category/",
            dataType: 'json',
            async: false,
            data: { "id": id},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    category_Info: {$set: data},
                });
                this.setState(updateState);
                console.log("categories ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("categories error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    filterOnchange(event) {
    	var value = event.target.value;
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/category/",
            dataType: 'json',
            async: false,
            data: { "id": id, "timeframe": "", "type": ""},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    category_Info: {$set: data},
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
    chartAssignment(category_Info) {
    	if ($('#confidentialityOverviewChart').length){
    		var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'];
		    	var data = {
		    		categories: [],
		    		doc_types: {
		    			word: 0,
		    			excel: 0,
		    			pdf: 0,
		    			ppt: 0,
		    			other: 0
		    		},
		    		Series: []
		    	};
		    	var confidentialities = category_Info.confidentialities.sort(function (a, b) {
				    return a.name.localeCompare( b.name );
				});
		    	for(var i = 0; i < confidentialities.length; i++) {
		    		data.categories.push(confidentialities[i].name);
		    		data.Series.push({
		                y: confidentialities[i].number,
		                color: colors[i]
		            });
		    	}
		    $('#confidentialityOverviewChart').highcharts({
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
		            categories: data.categories,
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
		            }
		        },
		        legend: {
		            align: 'left',
		            verticalAlign: 'bottom',
		            floating: false,
		            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
		            shadow: false,
		            enabled: false
		        },
		        tooltip: {
		            headerFormat: '<b>{point.x}</b><br/>',
		            pointFormat: '{series.name}: {point.y}'
		        },
		        plotOptions: {
		            column: {
		                dataLabels: {
		                    enabled: false,
		                }
		            }
		        },
		        series: [{
		            name: 'Classification',
		            data: data.Series
		        }]
		    });
		}
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
		                enabled: false,
		                style: {
		                    fontWeight: 'bold',
		                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
		                }
		            }
		        },
		        legend: {
		            align: 'left',
		            verticalAlign: 'bottom',
		            floating: false,
		            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
		            shadow: false,
		            enabled: false
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
		        series: [{
		            name: 'Public',
		            data: [400,420,390,410,440]
		        }, {
		            name: 'Internal',
		            data: [80,100,123,90,111]
		        }, {
		            name: 'Confidential',
		            data: [200,210,180,188,240]
		        },{
		            name: 'Secret',
		            data: [400,420,390,410,440]
		        }, {
		            name: 'Banking Secrecy',
		            data: [80,100,123,90,111]
		        }]
		    });
		  }
    },
    chartUserFilter() {
    	 $('#userReviewChart').highcharts({
	        chart: {
	            type: 'bar'
	        },
	        title: {
	            text: ''
	        },
	        colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'],
	        xAxis: {
	            categories: ['todd.smith', 'tony.gomes', 'stan.siow', 'matt.nixon', 'chris.muffat'],
	            title: {
	                text: null
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
	                    enabled: true
	                }
	            }
	        },

	        series: [{
	            name: 'Documents',
	            data: [{
	                y: 70,
	                color: '#5bc0de'
	            },{
	                y: 50,
	                color: '#349da2'
	            },{
	                y: 25,
	                color: '#7986cb'
	            },{
	                y: 20,
	                color: '#ed9c28'
	            },{
	                y: 4,
	                color: '#E36159'
	            }]
	        }]
	    });

	    $("div.off").click(function(){
	        $(this).toggleClass("on");
	    });
    },
    render:template
});

module.exports = UserAssignment;