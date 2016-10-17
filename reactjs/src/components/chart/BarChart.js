'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { isEqual } from 'lodash'

var BarChart = React.createClass({
    displayName: 'BarChart',
    
    PropTypes: {
        id: PropTypes.string.isRequired,
        config: PropTypes.object.isRequired,
        categories: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
        help: PropTypes.string
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props.data, nextProps.data)
    },

    componentDidUpdate(prevProps, prevState) {
        this.draw()
    },

    draw() {
        var { id, config, data, categories } = this.props

        var div = $('#' + id);
        if (div.length){
           $(div).highcharts({
                chart: {
                    type: 'bar',
                    height: data.length * 39,
                    verticalAlign: 'top'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: categories,
                    title: {
                        text: null
                    },
                    tickInterval: 1,
                    tickWidth: 0,
                    lineWidth: 0,
                    minPadding: 0,
                    maxPadding: 0,
                    gridLineWidth: 0,
                    tickmarkPlacement: 'off',
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
                            enabled: true
                        },
                        states: {
                            hover: {
                                brightness: 0,
                            }
                        },
                        series: {
                            pointWidth: 20,
                            pointPadding: 0,
                            groupPadding: 0,
                            verticalAlign: 'top'
                        },
                        point:  {
                            events: {
                            mouseOver: function(event){
                                var data = this.series.data, 
                                    colorsHover = this.series.userOptions.colorsHover;

                                this.graphic.attr({
                                    fill: this.color
                                });

                                for(var i = data.length - 1; i >= 0; i--) {
                                    data[i].graphic.attr({
                                        fill: colorsHover
                                    });
                                }
                            },

                            mouseOut: function(event) {
                                var data = this.series.data, 
                                    colors = this.series.userOptions.colors;

                                for(var i = data.length - 1; i >= 0; i--) {
                                    data[i].graphic.attr({
                                        fill: data[i].color
                                    });
                                }
                            }
                            }
                        }
                    }
                },

                series: [{
                    colorByPoint: true,                    
                    name: config.name,
                    colors: config.colors,
                    colorsHover: config.colorsHover,
                    data: data
                }]
            });
        }
    },

    render() {
        let { id, config } = this.props
        return (
            <div>
                <div id={id}></div>
            </div>
            );
    }

});
module.exports = BarChart;