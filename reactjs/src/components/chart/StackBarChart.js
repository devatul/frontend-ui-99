import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import HelpButton from '../dathena/HelpButton';
import {isEqual} from 'lodash';

var stackBarChart = React.createClass({
  displayName: 'selectButton',

  PropTypes: {
    id: PropTypes.string.isRequired,
    config: PropTypes.array,
    categories: PropTypes.array.isRequired,
    title: PropTypes.string,
    series: PropTypes.array,
    help: PropTypes.string
  },

  getDefaultProps() {
    return {
      config: {
        colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'],
        colorsHover: ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE']
      },
      help: 'help content',
      title: 'title',
      id: 'id'
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.series, nextProps.series);
  },

  componentDidUpdate(prevProps, prevState) {
    this.draw();
  },

  draw() {
    var {config, series, categories, id} = this.props,
        {colors, colorsHover} = config;

    $('#' + id).highcharts({
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      colors: colors,
      xAxis: {
        categories: categories,
        labels: {
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
        enabled: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.percentage:.1f}% / {point.y} Documents<br/>Total: {point.stackTotal} Documents'
      },
      plotOptions: {
        bar: {
          stacking: 'normal',
          pointWidth: 18,
          pointPadding: 0,
          borderWidth: 0,
          dataLabels: {
            enabled: false,
          },
          point: {
            events: {
              mouseOver: function () {
                var {series} = this.series.chart;

                for (let i = series.length - 1; i >= 0; i--) {
                  for (let j = series[i].points.length - 1; j >= 0; j--) {
                    if (series[i].points[j].category !== this.category) {
                      series[i].points[j].graphic.attr({
                        fill: colorsHover[i]
                      });
                    } else {
                      series[i].points[j].graphic.attr({
                        fill: series[i].points[j].color
                      });
                    }
                  }
                }
              },
              mouseOut: function (event) {
                var {series} = this.series.chart;

                for (let i = series.length - 1; i >= 0; i--) {
                  for (let j = series[i].points.length - 1; j >= 0; j--) {
                    series[i].points[j].graphic.attr({
                      fill: series[i].points[j].color
                    });
                  }
                }
              },
            }
          }
        }
      },
      series: series
    });
  },

  render() {
    var {id, title, help} = this.props;

    return (
      <div>
        <h4 className="chart-title">{title}
          <HelpButton
            classMenu="fix-overview-help-button-table"
            setValue={help} />
        </h4>
        <div id={id}></div>
      </div>
    );
  }
});

module.exports = stackBarChart;
