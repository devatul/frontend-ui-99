import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './OrphanReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import 'jquery'
import chart from '../script/chart-orphan-review.js'
import javascript_todo from '../script/javascript.todo.js'
import undo from '../script/Undo.js'
import Constant from '../Constant.js'

var OrphanReview = React.createClass({
    mixins: [LinkedStateMixin],
    displayName: 'OrphanReview',
    getInitialState() {
        return {
            orphan_current: 0,
            list_orphan: [],
            categories: [],
            statistics: [],
            cloudwords: [],
            centroids: [],
            samples: [],
            documentPreview: [],
            documentPreview_current: 0
        };
    },
    componentWillMount() {
        //this.getOrphan();
    },
    componentDidMount() {
        this.getOrphan();
        chart();
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.orphan_current != nextState.orphan_current) {
            return true;
        }
        if(this.state.categories != nextState.categories) {
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
        if(this.state.cloudwords != nextState.cloudwords) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.orphan_current != prevState.orphan_current) {
            console.log("jkskskskskkskskskks");
            this.getCategoryDistribution();
            this.getStatistics();
            this.getSamples();
        }
        if(this.state.samples != prevState.samples) {
            javascript_todo();
            undo.setup(function(dataUndo, val) {
                console.log("undo", dataUndo, val);
            });
        }
        if(this.state.categories != prevState.categories) {
            this.drawChart(this.state.categories);
        }
        if(this.state.centroids != prevState.centroids) {
            this.drawCentroid();
        }
        if(this.state.cloudwords != prevState.cloudwords) {
            this.drawCloud();
        }
    },
    getOrphan: function() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/",
            dataType: 'json',
            async: false,
            //data: JSON.stringify(bodyRequest),
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    list_orphan: {$set: data},
                    orphan_current: {$set: data[0]}
                });
                this.setState(updateState);
                console.log("list_orphan ok: ", data[0]);
            }.bind(this),
            error: function(xhr,error) {
                console.log("list_orphan error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    changeOrphan: function() {
        console.log("djjdjdjdjdjdjd", this.refs.choose_orphan.value);
        var updateState = update(this.state, {
            orphan_current: {$set: this.state.list_orphan[this.refs.choose_orphan.value]}
        });
        this.setState(updateState);
    },
    getCategoryDistribution: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/categories/",
            dataType: 'json',
            data: { "id":this.state.orphan_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    categories: {$set: data}
                });
                this.setState(updateState);
                console.log("categories ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("categories " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getStatistics() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/statistics/",
            dataType: 'json',
            data: { "id":this.state.orphan_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    statistics: {$set: data}
                });
                this.setState(updateState);
                console.log("list_statistics ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("list_statistics " + error);
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
            url: Constant.SERVER_API + "api/group/orphan/cloudwords/",
            dataType: 'json',
            data: { "id":this.state.orphan_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    cloudwords: {$set: []}
                });
                this.setState(updateState);
                for (var i = 0; i < data.length; i++) {
                    var updateState = update(this.state, {
                        cloudwords: {$push: [{text: data[i].name, weight: data[i].count}]}
                    });
                    this.setState(updateState);
                }
                console.log("cloudwords ok: ", this.state.cloudwords);
            }.bind(this),
            error: function(xhr,error) {
                console.log("cloudwords " + error);
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
            url: Constant.SERVER_API + "api/group/orphan/centroids/",
            dataType: 'json',
            data: { "id":this.state.orphan_current.id },
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
                console.log("centroids ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("centroids " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getSamples() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/samples/",
            dataType: 'json',
            data: { "id":this.state.orphan_current.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    samples: {$set: data}
                });
                this.setState(updateState);
                console.log("samples ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("samples " + error);
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
    drawCloud() {
        var word_list = this.state.cloudwords;
        var cloudRendered = false;
        if (!cloudRendered){
          $("#words-cloud").jQCloud(word_list,{
            afterCloudRender: function(){
              cloudRendered = true;
              $("[data='tooltip']").tooltip();
            }
          });
        }
        
        $(window).resize(function(){
            //$('#words-cloud').jQCloud('update', word_list);
            $('#words-cloud').css("width", "100%");
            $('#words-cloud').html('').jQCloud(word_list) 
        });
    },
    drawCentroid() {
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
                data: this.state.centroids
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

module.exports = OrphanReview;