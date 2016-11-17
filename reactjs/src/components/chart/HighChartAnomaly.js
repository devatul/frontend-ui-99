import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import HelpButton from '../dathena/HelpButton';
import 'jquery';
import Constant from '../../App/Constant.js';

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
    let values = [6, 8, 14, 12, 18, 21, 23, 6, 6, 6, 6];
    let green = '#27C57F';
    let orange = '#EB9428';
    let red = '#E1605B';

    var anomalyChartData = [{
        xTitle: 'Anomaly Occurence',
        yTitle: 'Users',
        data: []
      }, {
        xTitle: 'Anomaly Occurence',
        yTitle: 'AD Group',
        data: []
      }, {
        xTitle: 'Anomaly Occurence',
        yTitle: 'Users',
        data: []
      }, {
        xTitle: 'Anomaly Occurence',
        yTitle: 'Folders',
        data: []
      }, {
        xTitle: 'Anomaly Occurence',
        yTitle: 'Users',
        data: []
      }];

    let min = values[0];
    let max = values[1];

    for (let i = 1, len = values.length; i < len; ++i) {
      if (values[i] < min)
        min = values[i];
      if (values[i] > max)
        max = values[i];
    }

    let step = (min + max) / 3;

    for (let i = 0, len = anomalyChartData.length; i < len; ++i) {
      for (let j = 0, lenj = values.length; j < lenj; j++) {
        let color = green;
        if (values[j] > step * 2)
          color = red;
        else if (values[j] > step)
          color = orange;
        anomalyChartData[i].data.push({ y: values[j] * Constant.MULTIPLIER, color: color});
      }
    }

    $('.anomaly-chart').each(function (i) {
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
          name: 'Documents',
          data: anomalyChartData[i].data
        }]
      });
    });
  },

  render() {
    let id = this.props.id;
    return (<div className="anomaly-chart" id={this.props.id_hight}></div>)
  }
});

module.exports = HighChart;
