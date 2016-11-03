'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { forEach, isEqual, orderBy } from 'lodash'
import { orderByIndex } from '../../utils/function'
import HelpButton from '../dathena/HelpButton'

var StackedChart = React.createClass({
    displayName: 'StackedChart',

    getInitialState() {
        return {
            disabled: false,
            colorDisabled: ['#D7D8DA', '#CBCCCE', '#CFCED3', '#D8D7DC', '#CECFD1', '#CBCCCE', '#CFCED3']
        };
    },
    
    PropTypes: {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        config: PropTypes.array.isRequired,
        help: PropTypes.string,
        style: PropTypes.object
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props.config, nextProps.config) || this.state.disabled !== nextState.disabled;
    },

    componentDidUpdate(prevProps, prevState) {
        this.draw();
    },

    draw() {
        var { id, config } = this.props, chart = this;

        for( let i = config.length - 1; i >= 0; i-- ) {
            if(!(config[i].disabled != true)) {
                this.setState({ disabled: true });
            } else {
                this.setState({ disabled: false });
            }
        }   

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
                        var { series } = this;
                        
                        if (chart.state.disabled){
                            for( let i = series.length - 1; i >= 0; i-- ) {
                                for(let j = series[i].points.length - 1; j >= 0; j--) {

                                    series[i].points[j].graphic.attr({

                                        fill: chart.state.colorDisabled[j]

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

                        //if(percent < 5.0) {
                            return '<span style="color:' + this.color + '; font-weight: bold;">' + this.name + ': </span>' + percent + '% / ' + this.y + ' Documents';
                        // } else {
                        //     return 'Documents: ' + this.y;
                        // }
                    }
                },
                plotOptions: {
                pie: {
                        allowPointSelect: false,
                        cursor: 'pointer',
                        center: ['50%', '50%'],
                        shadow: false,
                        dataLabels: {
                            enabled: true
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
                                    var { series } = this.series.chart, { points } = series;

                                    this.graphic.attr({
                                        fill: this.color
                                    });

                                    for(let i = series.length - 1; i >= 0; i--) {

                                        for(let j = series[i].points.length - 1; j >= 0; j--) {
                                            series[i].points[j].graphic.attr({
                                                fill: series[i].userOptions.colorsHover[j]
                                            });
                                        }

                                    }
                                    
                                },
                                mouseOut: function(event) {
                                    var { series } = this.series.chart, { points } = series;

                                    for(let i = series.length - 1; i >= 0; i--) {

                                        for(let j = series[i].points.length - 1; j >= 0; j--) {
                                            series[i].points[j].graphic.attr({
                                                fill: series[i].points[j].color
                                            });
                                        }

                                    }
                                }
                            }
                        }
                    }
                },
                    
                    legend: {
                        enabled: false
                    },
                    series: config
            });
        }
    },

    render() {
        var legendChart = [], { id, title, config } = this.props,
            { disabled, colorDisabled } = this.state;
        if(config) {
            for(let i = config.length - 1; i >= 0; i--) {
                var children = [];
                var { data } = config[i];
                for(let j = data.length - 1; j >= 0; j--) {
                    let colorSymbol = disabled === true ? colorDisabled[j] : config[i].colors[j];
                    children[j] = <li key={'legend_' + j} style={data.length <= 3 ? {
                                        margin: '0 auto 5px',
                                        width: data[0].name.length * 8,
                                        float: 'none',
                                        textTransform: 'capitalize'
                                    } : { 
                                        textTransform: 'capitalize'
                                    } }>
                                        <i className={'legend-symbol'} style={{backgroundColor: colorSymbol }}></i>
                                    {data[j].name}
                                </li>;
                }
                legendChart[i] = React.createElement('ul', {
                    key: 'chart-legend-' + i,
                    className: 'list-unstyled chart-legend serie-' + i,
                    style: { textTransform: 'lowercase' }
                }, children);
            }
        }
        return (
            <section className="panel">
                <div className="panel-body chart-panel widget-panel">
                    <h4 className="widget-title">{title + ' '}
                        <HelpButton classMenu="overview_timeframe fix-overview-help-button"
                                    setValue="A summarised view of each category and document language type for all the documents scanned." />
                    </h4>
                    <div className="widget-chart chart-stacked">
                        <div className="chart chart-md" id={id}></div>
                        {legendChart}
                    </div>
                    { disabled &&
                        <div id={id} className="chart-disabled-overlay"></div>
                    }
                </div>
            </section>
            );
    }

});
module.exports = StackedChart;