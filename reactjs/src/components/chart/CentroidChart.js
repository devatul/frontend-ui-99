'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'

var CentroidChart = React.createClass({
    displayName: 'CentroidChart',
    mixins: [PureRenderMixin],
    
    PropTypes: {
        title: PropTypes.string,
        data: PropTypes.array
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.data != prevProps.data) {
            this.draw();
        }
    },
    

    draw() {
        debugger
        $('#centroidChart').highcharts({
            chart: {
            polar: true
            },

            credits: {
            enabled: false
            },

            title: {
            text: null
            },

            pane: {
            startAngle: 90
            },

            xAxis: {
            tickInterval: 45,
            min: 0,
            max: 360,
            labels: {
                enabled: false
            },
            plotLines: [{
                color: '#BFDDF7',
                width: 2,
                value: [0, 2],
                zIndex: 1
            }]
            },

            yAxis: {
            min: -5,
            tickInterval: 5,
            plotBands: [{
                from: 0,
                to: 5,
                color: '#EDEDED'
            },{
                from: 5,
                to: 10,
                color: '#F2F2F2'
            },{
                from: 10,
                to: 15,
                color: '#F7F7F7'
            },{
                from: 15,
                to: 20,
                color: '#FCFCFC'
            }],
            labels: {
                formatter: function() {
                return this.value >= 0 ? this.value : null;
                }
            }
            },

            plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 45
            },
            column: {
                pointPadding: 0,
                groupPadding: 0
            },
            line: {
                //lineWidth: 0
            }
            },

            legend:{
            enabled: false
            },
            tooltip: {
            formatter: function() {
                return 'Documents:' + this.y;
            },
            useHTML: true
            },
            series: [{
            type: 'scatter',
            lineWidth: 2,
            data: [
                [0, 10], 
                {
                x: 0,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [20, 8], 
                {
                x: 20,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [60, 12], 
                {
                x: 60,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [135, 15], 
                {
                x: 135,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [180, 18], 
                {
                x: 180,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [225, 20], 
                {
                x: 225,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [240, 22], 
                {
                x: 240,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [260, 3], 
                {
                x: 260,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [280, 5], 
                {
                x: 280,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null, 
                [320, 10], 
                {
                x: 320,
                y: 0,
                marker: {
                    enabled: false
                }
                },
                null
            ]
            }]

        });
    },

    render() {
        return (
            <div>
                <h4 className="chart-title">Centroid Distance Histogram</h4>
                <div id="centroidChart"></div>
                <div className="cendroid-chart-label"><span>Group 1</span></div>
            </div>
            );
    }

});
module.exports = CentroidChart;