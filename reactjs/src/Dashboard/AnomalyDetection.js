import React, { Component } from 'react'
import { render } from 'react-dom'
import template from './AnomalyDetection.rt'
import update from 'react/lib/update'
import Constant from '../Constant.js';

var AnomalyDetection = React.createClass({
    getInitialState() {
        return{
            styleList: {
                line1: 'none',
                line2: 'none',
                line3: 'none',
                line4: 'none',
                line5: 'none',

            },
            styleShow: {
                line1:  'block',
                line2:  'block',
                line3:  'block',
                line4:  'block',
                line5:  'block',
            }
        }
    },
    /*shouldComponentUpdate(nextProps , nextState){
        if(this.state.styleShow != nextState.styleShow){
            return  true
        }
        if(this.state.styleList != nextState.styleList){
            return  true
        }
    },
    componentDidUpdate(prevProps , prevState){
        if(this.state.styleShow != prevState.styleShow){
            if(this.state.styleShow == 'none'){
                this.setState({styleList: 'block'})
            }else {
                 this.setState({styleList: 'none'})
            }

            console.log(this.state.styleList)
        }
    },*/
    changeStyle(value){
        debugger
        var style = update(this.state , {
            styleList : {
                [value] : {$set : 'block'}
            },
            styleShow : {
                [value] : {$set : 'none'}
            }
        })
        this.setState(style)
    },
    showLess(value){
          var style = update(this.state , {
             styleList : {
                [value] : {$set : 'none'}
            },
            styleShow : {
                [value] : {$set : 'block'}
            }
        })
        this.setState(style)
    },
    componentDidMount() {
            $('body').on('click', '.anomaly-state.selected', function(){
                var parent = $(this).parent();
                var currentStateClass = $(this).attr('data-state');
                if (!parent.find('.anomaly-state-select').length){
                parent.loadTemplate($('#anomalyStateSelect'), null, {
                    append: true,
                    afterInsert: function(elem){
                    $(elem).find('.'+currentStateClass).addClass('active');

                    $(elem).find('.current-state').html( $(elem).find('.'+currentStateClass).attr('data-label') );
                     $('[data-label]').css('font-weight','normal')
                    }
                });
                var selector = parent.find('.anomaly-state-select');
                selector.slideToggle();
                }
            });

            $('body').on('mouseover', '.anomaly-state-select .anomaly-state', function(){
                var parent = $(this).parents('.anomaly-state-select');
                parent.find('.anomaly-state').removeClass('active');
                $(this).addClass('active');

                parent.find('.current-state').html( $(this).attr('data-label') );
                 $('[data-label]').css('font-weight','normal')
            });

            $('body').on('mouseleave', '.anomaly-state-select .anomaly-state', function(){
                $(this).removeClass('active');
                $(this).parents('.anomaly-state-select').find('.current-state').html('');

            });

            $('body').on('click', '.anomaly-state-select .anomaly-state', function(){
                var parent = $(this).parents('td');
                $(this).addClass('selected');
                parent.html($(this));
            });


            // CHART

            var anomalyChartData = [
                {
                xTitle: 'Anomaly Occurence',
                yTitle: 'Document',
                data: [ { y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' } ]
                },
                {
                xTitle: 'Anomaly Occurence',
                yTitle: 'AD Group',
                data: [ { y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' } ]
                },
                {
                xTitle: 'Anomaly Occurence',
                yTitle: 'Users',
                data: [ { y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' } ]
                },
                {
                xTitle: 'Anomaly Occurence',
                yTitle: 'Folders',
                data: [ { y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' } ]
                },
                {
                xTitle: 'Anomaly Occurence',
                yTitle: 'Users',
                data: [ { y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' } ]
                }
            ];

            $('.anomaly-chart').each(function(i){
                $(this).highcharts({
                    chart: {
                        type: 'column',
                        height: 120,
                        width: 250,
                        backgroundColor:'rgba(255, 255, 255, 0)'
                    },
                    title: {
                        text: ''
                    },
                    credits: {
                    enabled: false
                    },
                    xAxis: {
                        labels:{
                        enabled: false
                        },
                        tickInterval: 1,
                        tickWidth: 0,
                        lineWidth: 0,
                        gridLineWidth: 0,
                        tickmarkPlacement: 'on',
                        pointPadding: 0,
                        title: {
                        text:  anomalyChartData[i].xTitle,
                        align: 'low',
                        style: {
                            fontFamily: '\'Roboto\', sans-serif',
                            fontWeight: 'bold'
                        }
                        }
                    },
                    yAxis: {
                        min: 0,
                        lineWidth: 1,
                        endOnTick:false,
                        tickInterval: 10,
                        title: {
                        text: anomalyChartData[i].yTitle,
                        align: 'high',
                        style: {
                            fontFamily: '\'Roboto\', sans-serif',
                            fontWeight: 'bold'
                        }
                        },
                        labels: {
                        enabled: false,
                        }
                    },
                    legend: {
                    enabled: false
                    },
                    tooltip: {
                    enabled: false
                    },
                    plotOptions: {
                        column: {
                        pointPadding: 0,
                        borderWidth: 0,
                        pointWidth: 14,
                        dataLabels: {
                            enabled: false,
                        },
                        }
                    },
                    series: [{
                        name: 'Public',
                        data: anomalyChartData[i].data
                    }]
                });
            });

            $('.anomaly-radial').each(function(){
                var innerChart = $(this).find('.anomaly-radial-inner');
                var innerChartValue = parseInt(innerChart.attr('data-value'));
                var outerChart = $(this).find('.anomaly-radial-outer');
                var outerChartValue = parseInt(outerChart.attr('data-value'));
                innerChart.radialIndicator({
                initValue: innerChartValue,
                radius: 50,
                barWidth: 12,
                percentage: false,
                barColor: ({0 : '#e46159', 25: '#ef7716', 50 : '#49c89b', 100 : '#49c89b'}),
                roundCorner: true,
                displayNumber: false
                });
                outerChart.radialIndicator({
                initValue: outerChartValue,
                radius: 65,
                barWidth: 12,
                percentage: false,
                barColor: ({0 : '#49c89b', 33: '#ef7716', 67 : '#e46159', 100 : '#e46159'}),
                roundCorner: true,
                displayNumber: false
                });
            });


            var data = [{
                name: 'Transaction',
                y: 60,
                color: '#FF503F'
            }, {
                name: 'Legal/Compliance',
                y: 15,
                color: '#9295D7'
            }, {
                name: 'Accounting/Tax',
                y: 12,
                color: '#09B3B5'
            }, {
                name: 'Corporate Entity',
                y: 8,
                color: '#FBAC08'
            }, {
                name: 'Employees',
                y: 5,
                color: '#4FCFE9'
            }];
            var start = 0;
            var series = [];
            for (var i = 0; i < data.length; i++) {
                var end = start + 360 * data[i].y / 100;


                series.push({
                type: 'pie',
                size: 120 - 12 * i,
                innerSize: 0,
                startAngle: start,
                endAngle: end,
                data: [data[i]]
                });
                start = end;
            };
            $('.anomaly-pie-chart').highcharts({
                series: series,
                chart: {
                type: 'pie',
                height: 160,
                spacing: [0,0,0,0],
                backgroundColor:'rgba(255, 255, 255, 0)'
                },
                credits: {
                enabled: false
                },
                title: {
                text: ''
                },
                plotOptions: {
                pie: {
                    borderWidth: 0,
                    dataLabels: {
                    distance: -15,
                    color: 'white',
                    useHTML:true,
                    style: { fontFamily: '\'Roboto\', sans-serif', fontSize: '10px', "fontWeight": "300" },
                    formatter: function() {
                        return this.y >= 15 ? this.y + '%' : this.y;
                    }
                    }
                }
                },
                tooltip: {
                enabled: false
                }
            });
    },


    render:template
});

module.exports = AnomalyDetection;