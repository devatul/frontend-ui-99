import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import {isEqual} from 'lodash';
import HelpButton from '../dathena/HelpButton';

var DonutChart = React.createClass({
  displayName: 'DonutChart',

  getInitialState() {
    return {
      colorDisabled: ['#D7D8DA', '#CBCCCE', '#CFCED3', '#D8D7DC', '#CECFD1']
    };
  },

  PropTypes: {
    id: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    help: PropTypes.string
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.config, nextProps.config);
  },

  componentDidUpdate(prevProps, prevState) {
    this.draw();
  },

  draw() {
    var {id, config} = this.props, {colorDisabled} = this.state,
        div = $('#' + id);

    if (div.length) {
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
                  series = chart.series;

              if (config.disabled) {
                for (let i = series.length - 1; i >= 0; i--) {
                  for (let j = series[i].points.length - 1; j >= 0; j--) {
                    series[i].points[j].graphic.attr({
                      fill: colorDisabled[j]
                    });
                  }
                }
              }
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
            return '<span style="color:' + this.color + '; font-weight: bold;">' + this.name + ': </span>' + percent + '% / ' + this.y + ' Documents';
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              distance: -30,
              formatter: function () {
                var percent = this.percentage.toFixed(1);
                return percent >= 5.0 ? percent + '%' : '';
              },
              style: {
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0px 1px 2px black'
              }
            },
            states: {
              hover: {
                brightness: 0,
              }
            },
            showInLegend: true,
            point: {
              events: {
                mouseOver: function (event) {
                  var {series} = this, {points} = series;

                  this.graphic.attr({
                    fill: this.color
                  });

                  for (let i = points.length - 1; i >= 0; i--) {
                    points[i].graphic.attr({
                      fill: series.userOptions.colorsHover[i]
                    });
                  }
                },
                mouseOut: function (event) {
                  var {series} = this, {points} = series;

                  for (let i = points.length - 1; i >= 0; i--) {
                    points[i].graphic.attr({
                      fill: points[i].color
                    });
                  }
                }
              }
            }
          },
        },
        legend: {
          enabled: false,
        },
        series: [config]
      });
    }
  },

  render() {
    var legendChart = [], {id, config, help} = this.props, {colorDisabled} = this.state;
    let options = config.options ? config.options : false;
    if (config.data) {
      for (let i = config.data.length - 1; i >= 0; i--) {
        let color = ( config.disabled ) ? colorDisabled[i] : config.colors[i];
        legendChart[i] =
          <li key={'legend_' + i} style={config.data.length <= 3 ? {margin: '0 auto 5px', width: config.data[0].name.length * 8, float: 'none'} : {}}>
            {this.props.analytics ? <i className="fa fa-map-marker" aria-hidden="true" style={{color: color,paddingRight:'3px'}}></i> : <i className="legend-symbol" style={{backgroundColor: color}}></i>}
            {config.data[i].name}
          </li>;
      }
    }
    let lineStyle = {color:config.colors[0], backgroundColor:config.colors[0], marginRight: (id == "confidentialityPieChart5" || id == "confidentialityPieChart4") ? '0px' : '-42px' };

    return (
      <section className="panel">
        <div className="panel-body chart-panel widget-panel">
          <h4 className="widget-title">
            {config.name && config.name + ' '}
            <HelpButton
              classMenu="overview_timeframe fix-overview-help-button"
              setValue={help && help} />
          </h4>
            {this.props.analytics ?
              <span>
              <div className="widget-chart analytics" >

              <div className="chart chart-md" id={id} style={{width:'70%',margin:' 0 auto'}}></div>
            {options.filter ? <a className="toggle-button btn btn-default analytics filter"><i className="fa fa-filter" aria-hidden="true"></i></a> : ""}
            {options.search ? <a className="toggle-button btn btn-default analytics search"><i className="fa fa-search" aria-hidden="true"></i></a> : ""}
            {options.user ? <a className="toggle-button btn btn-default analytics user"><i className="fa fa-user" aria-hidden="true"></i></a> : ""}
            {options.users ? <a className="toggle-button btn btn-default analytics users"><i className="fa fa-users" aria-hidden="true"></i></a> : ""}
            {options.folder ? <a className="toggle-button btn btn-default analytics folder-open"><i className="fa fa-folder-open-o" aria-hidden="true"></i></a> : ""}
            {options.archive ? <a className="toggle-button btn btn-default analytics archive"><i className="fa fa-file-archive-o" aria-hidden="true"></i></a> : ""}
            {options.config ? <a className="toggle-button btn btn-default analytics config"><i className="fa fa-cog" aria-hidden="true"></i></a> : ""}
            {options.shield ? <a className="toggle-button btn btn-default analytics shield"><i className="fa fa-shield" aria-hidden="true"></i></a> : ""}
            { legendChart &&
                <ul id={'legend' + id} className="list-unstyled chart-legend serie-0">
                  {legendChart}
                </ul>
              }
            </div>
            { config.disabled && <div id={id} className="chart-disabled-overlay"></div>}
              <div className="analytics bottom-line" style={lineStyle}>
                <i className="fa fa-caret-up" aria-hidden="true"></i>
              </div>
          </span>
          :
          <span>
          <div className="widget-chart analytics" >
          <div className="chart chart-md" id={id} ></div>
            { legendChart &&
                <ul id={'legend' + id} className="list-unstyled chart-legend serie-0">
                  {legendChart}
                </ul>
              }
            </div>
            { config.disabled && <div id={id} className="chart-disabled-overlay"></div>}
          </span>
          }


        </div>
      </section>
    );
  }
});

module.exports = DonutChart;
