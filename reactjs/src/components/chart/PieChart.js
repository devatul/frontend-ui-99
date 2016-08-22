'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import HelpButton from '../dathena/HelpButton'

var PieChart = React.createClass({
    displayName: 'selectButton',
    mixins: [PureRenderMixin],
    
    PropTypes: {
        title: PropTypes.string,
        data: PropTypes.array,
        help: PropTypes.string,
        style: PropTypes.object
    },

    // componentDidUpdate(prevProps, prevState) {
    //     if(this.props.data != prevProps.data) {
    //         this.draw()
    //     }  
    // },

    componentDidMount() {
        this.draw()        
    },

    draw() {
        var colors = [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'];
        var colorsHover  = [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'];
        var confidentialityChartData = [{
            name: 'Public',
            y: 50
        }, {
            name: 'Internal',
            y: 25,
        }, {
            name: 'Confidential',
            y: 15
        }, {
            name: 'Secret',
            y: 6
        }, {
            name: 'Banking Secrecy',
            y: 4
        }];

        var div = $('#confidentialityChart');
        var parentDiv = div.closest('.tab-pane');
        if (div.length){
                div.highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie',
                        backgroundColor: null,
                        events: {
                        load: function () {
                                var chart = this;
                                $(chart.series).each(function (i, serie) {
                                var serieDiv = $('<ul class="list-unstyled chart-legend" id="confidentialityChartLegend"></ul>').appendTo(parentDiv);
                                $.each(serie.data, function(i, point){
                                    $('<li><i class="legend-symbol" style="background-color: ' + point.color + '"></i>' + point.name + '</li>').appendTo(serieDiv);
                                })
                                });
                            }
                        },
                    },
                    title: {
                        text: ''
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: 'Documents: {point.percentage}% / {point.y}'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: false,
                            cursor: 'pointer',
                            colors: colors,
                            dataLabels: {
                                enabled: true,
                                connectorWidth: 0,
                                distance: 5,
                                useHTML: true,
                                formatter: function () {
                                return '<span style="color:' + this.point.color + '">' + this.point.name + '</span>';
                                }
                            },
                            states: {
                                hover: {
                                    brightness: 0,
                                }
                            },
                            showInLegend: true,
                            point:  {
                                events: {
                                    mouseOver: function(event){
                                    var data = this.series.data;
                                    var colorsHover = this.series.userOptions.colorsHover;

                                    this.graphic.attr({
                                        fill: this.color
                                    });

                                    for(let i = data.length - 1; i >= 0; i--) {
                                        data[i].graphic.attr({
                                            fill: colorsHover[i]
                                        });
                                    }
                                    },
                                    mouseOut: function(event) {
                                        var data = this.series.data;
                                        var colors = this.series.userOptions.colors;
                                        for(let i = data.length - 1; i >= 0; i--) {
                                            data[i].graphic.attr({
                                                fill: colors[i]
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    },
                    
                    legend: {
                        enabled: false
                    },
                    series: [{
                        colorByPoint: true,
                        colors: colors,
                        colorsHover: colorsHover,
                        data: confidentialityChartData
                    }]
            });
        }
    },

    render() {
        return (
            <div>
                <h4 className="chart-title">{this.props.title}
                    <HelpButton classNote="review_question_chart" classIcon="fa-question-circle"
                        setValue={this.props.help} />
                </h4>
                <div class="chart-container">
                    <div id="confidentialityChartLegend"></div>
                    <div id="confidentialityChart"></div>
                </div>
            </div>
            );
    }

});
module.exports = PieChart;