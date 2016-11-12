import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import HelpButton from '../dathena/HelpButton';
import {isEqual} from 'lodash';

var PieChart = React.createClass({
  displayName: 'selectButton',

  PropTypes: {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    config: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    help: PropTypes.string,
    style: PropTypes.object
  },

  getDefaultProps() {
    return {
      config: {
        colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'],
        colorsHover: ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE']
      },
      help: "help content",
      title: "title"
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.data, prevProps.data)) {
      this.options();
    }
  },

  options() {
    var {config, data, id, legendContainer} = this.props,
        {colors, colorsHover} = config,
        div = $('#' + id),
        divLegend = div.closest('.chart-pane');

    div.highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor: null,
        events: {
          load: function () {
            var chart = this,
                legends = [];

            for (let i = chart.series.length - 1; i >= 0; i--) {
              for (let point = chart.series[i].data, j = point.length - 1; j >= 0; j--) {
                legends[i] =
                  <li key={'legend_' + j}>
                    <i className="legend-symbol" style={{backgroundColor: point[j].color}}></i>
                    {point[j].name}
                  </li>;
              }
            }

            render(React.createElement('ul', {
              className: 'list-unstyled chart-legend',
              id: 'confidentialityChartLegend'
            }, legends), document.getElementById(legendContainer));
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
        pointFormatter: function () {
          var percent = this.percentage.toFixed(1);

          if (percent < 5.0) {
            return '<span style="color:' + this.color + '; font-weight: bold;">' + this.name + ': </span>' + percent + '% / ' + this.y + ' Documents';
          } else {
            return '<span style="color:' + this.color + '; font-weight: bold;">' + this.name + ': </span>' + percent + '% / ' + this.y + ' Documents';
          }
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'pointer',
          colors: colors,
          dataLabels: {
            enabled: true,
            connectorWidth: 0,
            distance: -35,
            useHTML: true,
            formatter: function () {
              var percent = this.percentage.toFixed(1) >= 5.0 ? this.percentage.toFixed(1) + '%' : '';
              return "<span style='color: white'>" + percent + "</span>";
            }
          },
          states: {
            hover: {
              brightness: 0,
            }
          },
          showInLegend: true,
          borderColor: data && data.length === 1 ? colors[0] : '#FFF',
          point: {
            events: {
              mouseOver: function (event) {
                var data = this.series.data,
                    colorsHover = this.series.userOptions.colorsHover;

                this.graphic.attr({
                  fill: this.color
                });

                for (let i = data.length - 1; i >= 0; i--) {
                  data[i].graphic.attr({
                    fill: colorsHover[i]
                  });
                }
              },
              mouseOut: function (event) {
                var data = this.series.data,
                    colors = this.series.userOptions.colors;

                for (let i = data.length - 1; i >= 0; i--) {
                  data[i].graphic.attr({
                    fill: colors[i]
                  });
                }
              }
            }
          }
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        colorByPoint: true,
        colors: colors,
        colorsHover: colorsHover,
        data: data
      }]
    });
  },

  render() {
    var {title, id, help, children} = this.props;

    React.Children.map(children, (child) => {
      return React.cloneElement();
    });

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

module.exports = PieChart;
