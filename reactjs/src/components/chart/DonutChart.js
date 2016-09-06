'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { isEqual } from 'lodash'
import HelpButton from '../dathena/HelpButton'


var DonutChart = React.createClass({
    displayName: 'DonutChart',
    
    getInitialState() {
        return {
            colorDisabled: ['#D7D8DA', '#CBCCCE', '#CFCED3', '#D8D7DC', '#CECFD1']
        };
    },

    PropTypes: {
        id: PropTypes.string.isRequired,
        config: PropTypes.object.isRequired,
        help: PropTypes.string
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props.config, nextProps.config);
    },

    componentDidUpdate(prevProps, prevState) {
        this.draw()
    },

    draw() {
        var { id, config } = this.props, { colorDisabled } = this.state;

        var div = $('#' + id);

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
                        var chart = this,
                            series = chart.series;
                        if (config.disabled){
                            for( let i = series.length - 1; i >= 0; i-- ) {
                                for(let j = series[i].points.length - 1; j >= 0; j--) {

                                    series[i].points[j].graphic.attr({

                                        fill: colorDisabled[j]

                                    });
                                }
                            }
                        }
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
                    headerFormat: '',
                    pointFormatter: function() {
                        var percent = this.percentage.toFixed(1);

                        if(percent < 5.0) {
                            return '<span style="color:' + this.color + '; font-weight: bold;">' + this.name + ': </span>' + percent + '% / ' + this.y + ' Documents';
                        } else {
                            return 'Documents: ' + this.y;
                        }
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: false,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            distance: -30,
                            formatter: function() {
                                var percent = this.percentage.toFixed(1);
                                return percent >= 5.0 ? percent + '%' : '';
                            },
                            style: {
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '0px 1px 2px black'
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
                                    var { series } = this, { points } = series;
                                    
                                    this.graphic.attr({
                                        fill: this.color
                                    });

                                    for(let i = points.length - 1; i >= 0; i--) {
                                        points[i].graphic.attr({
                                            fill: series.userOptions.colorsHover[i]
                                        });
                                    }
                                },

                                mouseOut: function(event) {
                                    var { series } = this, { points } = series;

                                    for(let i = points.length - 1; i >= 0; i--) {
                                        points[i].graphic.attr({
                                            fill: points[i].color
                                        });
                                    }
                                }
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
        var legendChart = [], { id, config, help } = this.props, { colorDisabled } = this.state;
            if( config.data ) {
                for( let i = config.data.length - 1; i >= 0; i-- ) {
                    let color = ( config.disabled ) ? colorDisabled[i] : config.colors[i];
                    legendChart[i] = <li style={config.data.length <= 3 ? {
                                            margin: '0 auto 5px',
                                            width: config.data[0].name.length * 8,
                                            float: 'none'
                                        } : {}}>
                                        <i className="legend-symbol" style={{backgroundColor: color }}></i>
                                        {config.data[i].name}
                                    </li>;
                }
            }

        return (
            <section className="panel">
                <div className="panel-body widget-panel">
                    <h4 className="widget-title">{config.name + ' '}
                        <HelpButton classNote="overview_timeframe fix-overview-help-button"
                                    setValue={help} />
                    </h4>
                    <div className="widget-chart">
                        <div className="chart chart-md" id={id}></div>
                        { legendChart && 
                            <ul id={'legend' + id} className="list-unstyled chart-legend serie-0">
                                {legendChart}
                            </ul>
                        }
                    </div>
                    { config.disabled &&
                        <div id={id} className="chart-disabled-overlay"></div>
                    }
                </div>
            </section>
            );
    }

});
module.exports = DonutChart;