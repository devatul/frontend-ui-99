'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import HelpButton from '../dathena/HelpButton'

var HighChart = React.createClass({
    displayName: 'LiquidMeter',

    PropTypes: {
        title: PropTypes.string,
        setValue: PropTypes.number
    },

   /* shouldComponentUpdate(nextProps, nextState) {

    },
*/
    componentDidUpdate(prevProps, prevState) {

    },
    componentDidMount(){
        this.draw()
      /*   this.draw()*/
     },


    draw() {
            debugger
            var anomalyChartData = [{
            xTitle: 'Anomaly Occurence',
            yTitle: 'Document',
            data: [{ y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }]
        }, {
            xTitle: 'Anomaly Occurence',
            yTitle: 'AD Group',
            data: [{ y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }]
        }, {
            xTitle: 'Anomaly Occurence',
            yTitle: 'Users',
            data: [{ y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }]
        }, {
            xTitle: 'Anomaly Occurence',
            yTitle: 'Folders',
            data: [{ y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }]
        }, {
            xTitle: 'Anomaly Occurence',
            yTitle: 'Users',
            data: [{ y: 6, color: '#27C57F' }, { y: 8, color: '#EB9428' }, { y: 14, color: '#E1605B' }, { y: 12, color: '#EB9428' }, { y: 18, color: '#E1605B' }, { y: 21, color: '#E1605B' }, { y: 23, color: '#E1605B' }, { y: 22, color: '#E1605B' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }, { y: 6, color: '#D4D4D4' }]
        }];

        $('.anomaly-chart').each(function(i) {
            $(this).highcharts({
                chart: {
                    type: 'column',
                    height: 120,
                    width: 250,
                    backgroundColor: 'rgba(255, 255, 255, 0)'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    labels: {
                        enabled: false
                    },
                    tickInterval: 1,
                    tickWidth: 0,
                    lineWidth: 0,
                    gridLineWidth: 0,
                    tickmarkPlacement: 'on',
                    pointPadding: 0,
                    title: {
                        text: anomalyChartData[i].xTitle,
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
                    endOnTick: false,
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
    },

    render() {
        let id= this.props.id
        return (
            <div className="anomaly-chart" id={this.props.id_hight}></div> )
    }

});
module.exports = HighChart;