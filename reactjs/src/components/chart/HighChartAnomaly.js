import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import HelpButton from '../dathena/HelpButton';
import 'jquery';
import Constant from '../../App/Constant.js';
import Demo from '../../Demo.js';

var HighChart = React.createClass({
  displayName: 'LiquidMeter',

  PropTypes: {
    title: PropTypes.string,
    setValue: PropTypes.number
  },

  componentDidUpdate(prevProps, prevState) {
  },

  componentDidMount(){
    this.draw();
  },

  draw() {
    // FIXME: Use API instead
    let { setValue } = this.props;

    $('.anomaly-chart-' + this.props.id_hight).highcharts({
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
            text: setValue.xTitle,
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
            text: setValue.yTitle,
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
          formatter: function () {
            return '<br>' + this.series.name + ': ' + this.y;
          }
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
          name: setValue.yTitle,
          data: setValue.data
        }]
      });
  },

  render() {
    return (<div className={"anomaly-chart-" + this.props.id_hight} id={this.props.id_hight}></div>)
  }
});

module.exports = HighChart;
