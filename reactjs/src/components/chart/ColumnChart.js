import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import HelpButton from '../dathena/HelpButton';
import {isEqual} from 'lodash';

var ColumnChart = React.createClass({
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
      }
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.series, nextProps.series);
  },
  componentDidMount(){
    this.draw();
  },
  componentDidUpdate(prevProps, prevState) {
    this.draw();
  },

  draw() {
    var {config, series, categories, id, data} = this.props,
        {colors, colorsHover} = config,
        maxPoint = 200,
        empty = maxPoint - data[0];
    $('#' + id).highcharts({
      chart: {
        type: 'column',
        height: 150,
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
        minorGridLineColor: "#FFFFFF",
        labels: {
           enabled: false,
          autoRotation: false,
          style: {
            color: '#272727',
            'font-size': '10px'
          },
        },
        tickInterval: 100,
        tickWidth: 0,
        lineWidth: 0.7,
        minPadding: 0,
        maxPadding: 0,
        gridLineWidth: 0,
        tickmarkPlacement: 'off'
      },
      yAxis: {
        gridLineColor: 'transparent',
        min: 0,
        max: maxPoint,
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
        column: {
          stacking: 'normal',
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
      series:  [{
        colorByPoint: true,
        colors: ["#F0F1F5"],
        colorsHover: config.colorsHover,
        maxPointWidth: 100,
        followPointer:false,
        data: [empty]
      }, {
        colorByPoint: true,
        name: config.name,
        colors: config.colors,
        colorsHover: config.colorsHover,
        data: data,
        maxPointWidth: 500
      }] //series
    });
  },
  // <HelpButton
  //   classMenu="help_question_bottom fix-margin fix-overview-help-button-table"
  //   setValue={help} />
  render() {
    var {id, title, help} = this.props;

    return (
      <div>
        <h4 className="chart-title">
          {title}

        </h4>
        <div id={id}></div>
      </div>
    );
  }
});

module.exports = ColumnChart;
