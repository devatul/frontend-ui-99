'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { isEqual } from 'lodash'
import HelpButton from '../dathena/HelpButton'


var DonutChart = React.createClass({
    displayName: 'DonutChart',
    
    PropTypes: {
        id: PropTypes.string.isRequired,
        config: PropTypes.object.isRequired,
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
        var { id, config, data } = this.props
        var colorDisabled = ['#D7D8DA', '#CBCCCE', '#CFCED3', '#D8D7DC', '#CECFD1'];
        
        config.data = data;

        var div = $('#' + id);
        var parentDiv = div.parent();

        if(data.length <= 1) {
            $('<div id="' + id + '" class="chart-disabled-overlay"></div>').appendTo(div.parents('.widget-panel'))
        } else {
            $('#' + id +'.chart-disabled-overlay').remove()
        }

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
                    if (div.parents('.widget-panel').find('.chart-disabled-overlay').length){
                        var serie = chart.series[0].points;
                        $.each(serie, function (i, e) {
                            this.graphic.attr({
                                fill: colorDisabled[i]
                            });
                        });
                    }

                    $(chart.series).each(function (i, serie) {
                        var serieDiv = $('ul#legend' + id + '.list-unstyled.chart-legend.serie-' + i);
                        if(serieDiv.length > 0) {
                            $(serieDiv).html('');
                        } else {
                            serieDiv = $('<ul id="legend' + id + '" class="list-unstyled chart-legend serie-'+i+'"></ul>').appendTo(parentDiv);
                        }
                        if (div.parents('.widget-panel').find('.chart-disabled-overlay').length){
                            var points = serie.points;
                            $.each(points, function (i, e) {
                                console.log(e);
                                this.graphic.attr({
                                    fill: colorDisabled[i]
                                });
                                $('<li><i class="legend-symbol" style="background-color: ' + colorDisabled[i] + '"></i>' + e.name + '</li>').appendTo(serieDiv);
                            });
                        }
                        else {
                            $.each(serie.data, function(i, point){
                                $('<li><i class="legend-symbol" style="background-color: ' + point.color + '"></i>' + point.name + '</li>').appendTo(serieDiv);
                            })
                        }
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
                    pointFormat: 'Documents: {point.percentage:.1f}% / {point.y}'
                },
                plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
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
                            this.graphic.attr({
                                fill: this.color
                            });
                        },
                        }
                    },
                    events: {
                        mouseOver: function(e){
                            var that = this;
                            $.each(that.points, function (i, e) {
                                this.graphic.attr({
                                    fill: that.userOptions.colorsHover[i]
                                });
                            });
                        },
                        mouseOut: function(){
                            var that = this;
                            $.each(that.points, function (i, e) {
                                this.graphic.attr({
                                    fill: that.userOptions.colors[i]
                                });
                            });
                        }
                    }
                },
                },
                legend: {
                    enabled: false,
                },
                series: [config]
            });
        }
    },

    render() {
        let { id, config } = this.props
        return (
            <section className="panel">
                <div className="panel-body widget-panel">
                    <h4 className="widget-title">{config.name}
                        <HelpButton classNote="overview_timeframe help_timeframe"
                                    setValue="Of the total number of documents scanned, when 99 detects two or more files, these are considered duplicates and are registered here." />
                    </h4>
                    <div className="widget-chart">
                        <div style={{'margin-left': '0px'}} className="chart chart-md" id={id}></div>
                    </div>
                </div>
            </section>
            );
    }

});
module.exports = DonutChart;