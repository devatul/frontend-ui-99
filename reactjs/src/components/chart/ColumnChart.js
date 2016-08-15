'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import HelpButton from '../dathena/HelpButton'

var ColumnChart = React.createClass({
    displayName: 'selectButton',
    
    PropTypes: {
        title: PropTypes.string,
        data: PropTypes.array,
        help: PropTypes.string
    },

    shouldComponentUpdate(nextProps, nextState) {
        return  this.props.data != nextProps.data;
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.data != prevProps.data) {
            this.draw();
        }  
    },
    

    draw() {
        var chartframe = $(this.refs.chartframe);
        var data = this.props.data;
        $(chartframe).highcharts({
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
                pointFormat: '{series.name}: {point.y} Documents<br/>Total: {point.stackTotal} Documents'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                    }
                }
            },
            series: data
        });
    },

    render() {
        return (
            <div>
                <h4 class="chart-title">{this.props.title}
                    <HelpButton classNote="note_chart_content_review"
                        classIcon="fa-question-circle"
                        setValue={this.props.help} />
                </h4>
                <div ref="chartframe" id="confidentialityLevelChart"></div>
            </div>
            );
    }

});
module.exports = ColumnChart;