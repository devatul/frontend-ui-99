'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var RickInsight = React.createClass({

	displayName :'RickInsight',
	getInitialState(){
		return {
	   		 checkColor:'panel-body bg-secondary widget-panel insight-panel',
	    };
	},
	componentWillMount(){

		if(this.props.name == "access right anomaly"){
			this.setState({checkColor: 'panel-body bg-quartenary-2 widget-panel insight-panel' })
			
		}else if(this.props.name == "unidentified files"){
			this.setState({checkColor: 'panel-body bg-secondary widget-panel insight-panel' })
		}
	},
	render(){
		return(
			
              <section className="panel">
                <div className={this.state.checkColor}>
                  <h4 className="widget-title">{this.props.name}
                      <div className="inline-block-item dropdown">
                          <a data-toggle="dropdown" className="overview_question_a"><i className="fa fa-question-circle" aria-hidden="true"></i></a>
                          <div className="overview_timeframe help_timeframe dropdown-menu has-arrow dd-md full-mobile">
                              <p>This represents the number of documents that 99 has detected and scanned as part of the initial document classification activity.</p>
                          </div>
                      </div>
                  </h4>
                  <div className="insight-stat">
                    <i className="fa fa-chevron-down" aria-hidden="true"></i>
                    <span>{this.props.currentscanvalue}</span>
                  </div>
                  <div className="widget-summary">
                      <div className="widget-summary-col">
                          <div className="summary">
                              <div className="info">
                                  <strong className="amount">{this.props.previousscanvalue}</strong>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </section>
            );
	}
});

module.exports = RickInsight;