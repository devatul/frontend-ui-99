import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import HelpButton from '../dathena/HelpButton';
import {isEqual, ceil, floor} from 'lodash';

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
  heightChartInterval(length) {
    let a = ceil(length/5)
    let b = floor(a/50);
    let c = b*50;
    if(c+25 > a){
      a = c;
    }else{
      a = c+50;
    }
    return Math.max(a, 1);
  },
  draw() {
    var {config, series, categories, id, data} = this.props,
        {colors, colorsHover} = config,
        maxPoint = config.height,
        empty = maxPoint - data[0],
        interval = this.heightChartInterval(maxPoint);
    $('#' + id).highcharts({
      chart: {
        type: 'column',
        height: 150,
        backgroundColor: 'rgba(76, 175, 80, 0)',
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
        tickInterval: interval,
        min: 0,
        max: maxPoint,
        endOnTick: false,
        maxPadding: 0.02,
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
        enabled:false,
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.percentage:.1f}% / {point.y} Documents<br/>Total: {point.stackTotal} Documents'
      },
      plotOptions: {
        series:{
          pointWidth: 80,
        },
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
        colors: ["#e0e1e2"],
        colorsHover: config.colorsHover,
        maxPointWidth: 500,
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
