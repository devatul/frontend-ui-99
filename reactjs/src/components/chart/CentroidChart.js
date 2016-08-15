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
        var chartframe = $(this.refs.centroidChart);
        var data = this.props.data;
        $(chartframe).highcharts({
            chart: {
                type:'column'
            },
            xAxis: {
                min: 0,
                step: 2,
                max: data.length,
                startOnTick: true,
                endOnTick: true,
                tickInterval: 1,
            },
            yAxis: {
              title: {
                  text: 'Number of Documents'
              },
            },
            credits: {
              enabled: false
            },
            title: {
              text: ''
            },

            legend: {
              enabled: false
            },
            
            plotOptions: {
              column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                      textShadow: '0 0 3px black'
                    }
                },
                pointPadding: 0,
                borderWidth: 1,              
                groupPadding: 0,
                pointPlacement: -0.5
              }
            },

            tooltip: {
                headerFormat: '',
                pointFormat: '{point.y} Documents<br/>'
            },
            
            series: [{
                data: data
            }]
        });
    },

    render() {
        return (
            <div>
                <h4 class="chart-title">{this.props.title}</h4>
                <div ref="centroidChart" id="centroidChart"></div>
            </div>
            );
    }

});
module.exports = CentroidChart;