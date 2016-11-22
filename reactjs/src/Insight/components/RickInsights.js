import React, {Component} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import _ from 'lodash';
import $ from 'jquery';
import Constant, {fetching} from '../../App/Constant.js';
import Demo from '../../Demo.js';
import {makeRequest} from '../../utils/http';
import HelpButton1 from '../../components/dathena/HelpButton';
import Loader from '../../components/dathena/Loader';

var RickInsight = React.createClass({
  displayName: 'RickInsight',

  getInitialState() {
    return {
      rickInsight: {},
      classIcon: '',

      xhr: {
        status: "Report is loading",
        message: "Please wait!",
        timer: 20,
        loading: 0,
        isFetching: fetching.STARTED
      },
    };
  },

  componentDidMount() {
    this.getRickInsight();
  },

  getRickInsight() {
    return makeRequest({
      path: 'api/insight/risk/',
      success: (data) => {
        // FIXME: Demo fix
        if (Demo.MULTIPLIER != 1) {
          for (let i = 0, len = data.risks.length; i < len; ++i) {
            data.risks[i].current_scan_value *= Demo.MULTIPLIER;
            data.risks[i].previous_scan_value *= Demo.MULTIPLIER;
          }

          if (data.stale_files) {
            data.stale_files.total *= Demo.MULTIPLIER;
            for (let i = 0, len = data.stale_files.years.length; i < len; ++i) {
              data.stale_files.years[i].value *= Demo.MULTIPLIER;
            }
          }
        }

        let classIcon_StaleFiles = data.stale_files.total > data.stale_files.previous_scan_value ? 'fa fa-chevron-up' : (data.stale_files.total < data.stale_files.previous_scan_value ? 'fa fa-chevron-down' : 'fa fa-minus');
        this.setState({rickInsight: data, classIcon: classIcon_StaleFiles});
        this.setState({
          xhr: update(this.state.xhr, {
            isFetching: {
              $set: fetching.SUCCESS
            }
          })
        });
      },
      error: (err) => {
        this.setState({
          xhr: update(this.state.xhr, {
            isFetching:
            {
              $set: fetching.ERROR
            }
          })
        });
      }
    });
  },

  upperFirst(value) {
    let sp = _.split(value, ' '),
        rt = '';

    for (let i = 0; i < sp.length; i++) {
      rt += _.upperFirst(sp[i]) + ' ';
    }

    return rt;
  },

  getRickType(value) {
    switch (value) {
      case 0:
        return {color: ' bg-secondary', info: 'Number of folders which have content anomalies.'};
      case 1:
        return {color: ' bg-quartenary-2', info: 'Number of files that can not be identified.'};
      case 2:
        return {color: '  bg-tertiary-2', info: 'Number of users who have abnormal access rights.'};
      case 3:
        return {color: 'bg-secondary-2', info: 'Number of retention rules applied for the existing classification.'};
      case 4:
        return {color: 'bg-tertiary-3', info: 'Number of files outside their retention dates.'};
      case 5:
        return {color: ' bg-quartenary-3', info: 'Number of duplicate files.'};
      case 6:
        return {color: ' bg-quartenary-2', info: 'Duplicates files with different names.'};
      case 7:
        return {color: ' bg-secondary', info: 'Storage Space with obsolete data.'};
    }
  },

  formatString(str) {
    return parseInt(_.split(str, ' ', -1))
  },

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  },

  render() {
    var children = [];

    if (this.state.rickInsight != null && this.state.rickInsight.stale_files != null) {
      _.forEach(this.state.rickInsight.risks, function (object, index) {
        let className = 'panel-body ' + this.getRickType(index).color + ' widget-panel insight-panel',
            previous = this.formatNumber(object.previous_scan_value),
            current = this.formatNumber(object.current_scan_value),
            classIcon = this.formatString(current) > this.formatString(previous) ? 'fa fa-chevron-up' : (this.formatString(current) == this.formatString(previous) ? 'fa fa-minus' : 'fa fa-chevron-down');

        children[index] = <div className="col-md-4" key={index}>
                            <section className="panel">
                              <div className={className}>
                                <h4 className="widget-title">
                                  {this.upperFirst(object.name)}
                                  <HelpButton1 classNote="overview_timeframe fix-overview-help-button" setValue={this.getRickType(index).info} />
                                </h4>

                                <div className="insight-stat">
                                  <i className={classIcon} aria-hidden="true"></i>
                                  <span>{previous}</span>
                                </div>

                                <div className="widget-summary">
                                  <div className="widget-summary-col">
                                    <div className="summary">
                                      <div className="info">
                                        <strong className="amount">{current}</strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>
      }.bind(this));
    }

    return (
      <div>
        {
          this.state.xhr.isFetching !== 1 ? (
            <Loader xhr={this.state.xhr}></Loader>
          ) : (children)
        }

        {
          this.state.xhr.isFetching == 1 ? (
            <div className="col-md-4">
              <section className="panel">
                <div className="panel-body bg-secondary-2 widget-panel insight-panel">
                  <h4 className="widget-title">Stale Files
                    <HelpButton1
                      classMenu="fix-overview-help-button-table"
                      classIcon="overview_question_a help_question_a"
                      setValue="Number of aging files that have not been accessed."/>
                  </h4>

                  <div className="insight-stat">
                    <i className={this.state.classIcon} aria-hidden="true"></i>
                    <span>{this.state.rickInsight.stale_files && this.state.rickInsight.stale_files.previous_scan_value}</span>
                  </div>

                  <div className="widget-summary">
                    <div className="widget-summary-col">
                      <ul className="list-unstyled summary-list">
                        <li>
                          <div className="row">
                            <div className="col-xs-6 text-left"><span>1-2 Years</span></div>
                            <div className="col-xs-6 text-right">
                              <span className="bold text-right">
                                {this.state.rickInsight.stale_files && this.formatNumber(this.state.rickInsight.stale_files.years[0].value)}
                              </span>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="row">
                            <div className="col-xs-6 text-left"><span>3+ Years</span></div>
                            <div className="col-xs-6 text-right">
                              <span className="bold">
                                {this.state.rickInsight.stale_files && this.formatNumber(this.state.rickInsight.stale_files.years[1].value)}
                              </span>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="row">
                            <div className="col-xs-6 text-left"><span>Total</span></div>
                            <div className="col-xs-6 text-right">
                              <span className="bold">
                                {this.state.rickInsight.stale_files && this.formatNumber(this.state.rickInsight.stale_files.total)}
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : null
        }
      </div>
    )
  }
});

module.exports = RickInsight;
