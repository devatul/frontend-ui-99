'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { forEach, isEqual } from 'lodash'
import HelpButton from '../dathena/HelpButton'

var StackedChart = React.createClass({
    displayName: 'StackedChart',
    
    PropTypes: {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        config: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
        help: PropTypes.string,
        style: PropTypes.object
    },

    shouldComponentUpdate(nextProps, nextState) {
        var { data } = this.props
        return !isEqual(data, nextProps.data)
    },

    componentDidUpdate(prevProps, prevState) {
        this.draw()
    },

    draw() {
        var colorDisabled = ['#D7D8DA', '#CBCCCE', '#CFCED3', '#D8D7DC', '#CECFD1', '#CBCCCE', '#CFCED3'];
        var { id, config, data } = this.props

        forEach(config, (val, index) => {
            val.data = data[index]
        })

        var div = $('#' + id);
        var parentDiv = div.parent();
        if (div.length){
            var context = null
            var chart = div.highcharts({
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
                            var serieDiv = $('ul#legend' + id + '.list-unstyled.chart-legend.serie-' + i);
                            if(serieDiv.length > 0) {
                                $(serieDiv).html('');
                            } else {
                                serieDiv = $('<ul id="legend' + id + '" class="list-unstyled chart-legend serie-'+i+'"></ul>').appendTo(parentDiv);
                            }
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
                            }
                            }
                        },
                        events: {
                            mouseOver: function(){
                            var that = this;
                            $.each(that.points, function (i, e) {
                                var thisColor = that.userOptions.colorsHover;
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
                    enabled: false
                    },
                    series: config
            });
        }
    },

    render() {
        var { id, title } = this.props
        return (
            <section className="panel">
                <div className="panel-body widget-panel">
                    <h4 className="widget-title">{title}
                        <HelpButton classNote="overview_timeframe help_timeframe"
                                    setValue="Of the total number of documents scanned, when 99 detects two or more files, these are considered duplicates and are registered here." />
                    </h4>
                    <div className="widget-chart chart-stacked">
                        <div style={{'margin-left': '0px'}} className="chart chart-md" id={id}></div>
                    </div>
                </div>
            </section>
            );
    }

});
module.exports = StackedChart;