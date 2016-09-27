'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import Constant from '../../Constant.js'
import HelpButton1 from "../../components/dathena/HelpButton"

var RickInsight = React.createClass({

	displayName :'RickInsight',
	getInitialState(){
		return {
             rickInsight: {},
	    };
	},
	componentDidMount(){
        this.getRickInsight()
	},
    getRickInsight() {

        $.ajax({

            url: Constant.SERVER_API + 'api/insight/risk/',
            dataType: 'json',
            type: 'GET',

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                console.log('data', data)
                this.setState({ rickInsight: data })

            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    upperFirst(value) {
        let sp = _.split(value, ' ');
        let rt = ''
        for (let i = 0; i < sp.length; i++) {

            rt += _.upperFirst(sp[i]) + ' ';
        }
        return rt

    },
    getRickType(value) {

        switch (value) {
            case 0:
                return { color: ' bg-secondary', info: 'Number of files that can not be identified.' };
            case 1:
                return { color: ' bg-quartenary-2', info: 'Number of users who have abnormal access rights.' };
            case 2:
                return { color: '  bg-tertiary-2', info: 'Duplicates files with different names.' };
            case 3:
                return { color: 'bg-secondary-2', info: 'Number of files past outside their retention dates.' };
            case 4:
                return { color: 'bg-tertiary-3', info: 'Number of files outside their retention dates.' };
            case 5:
                return { color: ' bg-quartenary-3', info: 'Number of duplicate files.' };
            case 6:
                return { color: ' bg-quartenary-2', info: 'Number of folders which have content anomalies.' };
            case 7:
                return { color: ' bg-secondary', info: 'Storage Space with obsolete data.' };
        }
    },
    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
	render(){
        let children = [];

        _.forEach(this.state.rickInsight.risks, function(object , index){
            let  color  = this.getRickType(index).color
            let className = "panel-body " + color + " widget-panel insight-panel"
            let name = this.upperFirst(object.name)
            let content = this.getRickType(index).info
            let previous = this.formatNumber(object.previous_scan_value)
            let current = this.formatNumber(object.current_scan_value)

            children[index] = <div className="col-md-4">
                                <section className="panel">

                                  <div className={className}>
                                    <h4 className="widget-title">{name}

                                      <HelpButton1 className="" classNote="overview_timeframe fix-overview-help-button"
                                                            setValue={content} />

                                   </h4>
                                   <div className="insight-stat">
                                    <i className="fa fa-chevron-down" aria-hidden="true"></i>
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
		return(

            <div>
                {children}
            </div>
        )


	}
});

module.exports = RickInsight;