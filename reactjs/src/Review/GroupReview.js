import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './GroupReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import chart from '../script/chart-group-review.js'
import Constant from '../Constant.js'
import undo from '../script/Undo.js'
import javascript_todo from '../script/javascript.todo.js'
import 'jquery'

var GroupReview = React.createClass({
    displayName: 'GroupReview',
    mixins: [LinkedStateMixin],
    getInitialState: function() {
    	return {
    		list_group:[],
    		group_current: null,
    		statistics: {},
    		cloudwords: [],
    		centroids: [],
    		samples: [],
    		categories: [],
            samples_current: 0,
            category_level: [],
            category_level_current: null,
            confidential_level: [],
            confidential_level_current: null,
            documentPreview: {},
            documentPreview_current: 0
    	};
    },
    componentWillMount() {
        //this.getGroup();
    },
    componentDidMount() {
        this.getGroup(); 
        chart();
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.group_current != nextState.group_current) {
            return true;
        }
        if(this.state.samples != nextState.samples) {
            return true;
        }
        if(this.state.statistics != nextState.statistics) {
            return true;
        }
        if(this.state.centroids != nextState.centroids) {
        	return true;
        }
        if(this.state.categories != nextState.categories) {
            return true;
        }
        if(this.state.cloudwords != nextState.cloudwords) {
            return true;
        }
        if(this.state.confidential_level != nextState.confidential_level) {
            return true;
        }
        if(this.state.category_level_current != nextState.category_level_current) {
            return true;
        }
        if(this.state.confidential_level_current != nextState.confidential_level_current) {
            return true;
        }
        if(this.state.documentPreview != nextState.documentPreview) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.group_current != prevState.group_current){
            this.getStatistics(this.state.list_group[this.state.group_current].id);
            this.getSamples(this.state.list_group[this.state.group_current].id);
            this.getCategoryDistribution(this.state.list_group[this.state.group_current].id);
        }
        if(this.state.samples != prevState.samples) {
            javascript_todo();
            this.setDefaultValue();
            undo.setup(function(dataUndo, val) {
                var element = dataUndo.obj;
                var id = dataUndo.id;
                console.log("element: ", element, val);
                if(element.dataset.value != null) var data = element.dataset.value.split(':');
                if(data != null && data[1] === "Category") {
                    var new_category_level = this.state.category_level;
                    new_category_level[data[0]] = val;
                    this.setState(update(this.state, {
                        category_level: {$set: new_category_level},
                        category_level_current: {$set: data[0] + ':' + val}
                    }));
                }
                if(data != null && data[1] ==="Confidential") {
                    var new_confidential_level = this.state.confidential_level;
                    new_confidential_level[data[0]] = val;
                    this.setState(update(this.state, {
                        confidential_level: {$set: new_confidential_level},
                        confidential_level_current: {$set: data[1] + ':' + val}
                    }));
                }
            }.bind(this));
        }
        if(this.state.categories != prevState.categories) {
            this.drawChart(this.state.categories);
        }
        if(this.state.centroids != prevState.centroids) {
            this.drawCentroid(this.state.centroids);
        }
        if(this.state.cloudwords != prevState.cloudwords) {
            this.drawCloud(this.state.cloudwords);
        }
    },
    setDefaultValue: function() {
        var samples = this.state.samples;
        var category_level = [];
        var confidential_level = [];
        for(var i = 0; i < samples.length; i++) {
            category_level[i] = samples[i].categories[0].confidence_level;
            confidential_level[i] = samples[i].confidentialities[0].confidence_level;
        }
        this.setState(update(this.state, {
            category_level: {$set: category_level },
            confidential_level: {$set: confidential_level}
        }));
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
                    group_current: {$set: 0}
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
            var group_selected = this.refs.choose_group.value;
            var updateState = update(this.state, {
                group_current: {$set: group_selected}
            });
            this.setState(updateState);
    },
    getStatistics(groupId) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/statistics/",
            dataType: 'json',
            data: { "id":groupId },
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
    getCloudwords() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/cloudwords/",
            dataType: 'json',
            data: { "id":this.state.list_group[this.state.group_current].id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({ cloudwords: [] });
                for (var i = 0; i < data.length; i++) {
                    var updateState = update(this.state, {
                        cloudwords: {$push: [{text: data[i].name, weight: data[i].count, html: { "data-tooltip": "1"} }]}
                    });
                    this.setState(updateState);
                }
                console.log(this.state.cloudwords);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCentroids() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/centroids/",
            dataType: 'json',
            data: { "id":this.state.list_group[this.state.group_current].id },
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
    getSamples(groupId) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/samples/",
            dataType: 'json',
            data: { "id":groupId },
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
    getCategoryDistribution(groupId) {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/categories/",
            dataType: 'json',
            data: { "id":groupId },
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
    setDocumentReview: function(index) {
        this.setState(update(this.state, {
            documentPreview: {$set: this.state.samples[index]},
            documentPreview_current: {$set: index }
        }));
        console.log("afasdccccc: ", this.state.samples[index], index);
    },
    drawCloud: function(word_list) {
        var cloudRendered = false;
      var drawCloud = function(){
        if (!cloudRendered){
          $("#words-cloud").jQCloud(word_list,{
            afterCloudRender: function(){
              cloudRendered = true;

              $("[data='tooltip']").tooltip();
            }
          });
        }
      };

      $(window).resize(function(){
        //$('#words-cloud').jQCloud('update', word_list);
        $('#words-cloud').css("width", "100%");
        $('#words-cloud').html('').jQCloud(word_list) 
      });
    },
    progressbar: function(value) {
        if(value <= Constant.progressValue.level1) {
            return Constant.progressBar.level1;
        } else if(value > Constant.progressValue.level1 && value <= Constant.progressValue.level2) {
            return Constant.progressBar.level2;
        }
        return Constant.progressBar.level3;
    },
    onChangeCategory: function(event, index) {
        var val = event.target.value;
        var new_category_level = this.state.category_level;
        new_category_level[index] = val;

        var updateState = update(this.state, {
            category_level: {$set: new_category_level},
            category_level_current: {$set: index + ':' + val}
        });
        this.setState(updateState);
    },
    onChangeConfidential: function(event, index) {
        var new_confidential_level = this.state.confidential_level;
        new_confidential_level[index] = event.target.value;

        var updateState = update(this.state, {
            confidential_level: {$set: new_confidential_level},
            confidential_level_current: {$set: index + ':' + event.target.value}
        });
        this.setState(updateState); 
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

            tooltip: {
                headerFormat: '',
                pointFormat: 'Documents: <b>{point.y}</b><br/>'
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
            },
            tooltip: {
              show: true,
              content: function(label,x,y){
                return label + ': ' +y;
              }
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