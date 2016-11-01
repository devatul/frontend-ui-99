import React,  { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import makeRequest from '../../utils/http'
import HelpButton from "./HelpButton"
import _ from 'lodash'
import $ from 'jquery'

import Anomaly from '../../components/dathena/anomalyStateSelect'
var TableAnomaly = React.createClass({
    getInitialState(){
        return{
             datas:  [
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "11",
                            "status" : "false",
                            "selected" : null
                          },
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "21",
                            "status" : "true",
                            "selected" : null
                          },
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "31",
                            "status" : "investigation",
                            "selected" : null
                          },
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "41",
                            "status" : "true",
                            "selected" : null,
                          },
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "51",
                            "status" : "not-reviewed",
                            "selected" : null
                          }
                    ],
             style : 0,
             filterValue : 0,
             show : false

        }
    },
    /*componentDidUpdate(prevProps,prevState){
        if(this.props.filter != prevProps.filter){

        }
    },*/
    filterTable(data , value){
        debugger
        let dataNew = []
        _.forEach(data , function(object , index){

            if(object.status == value){
                dataNew.push(object)
            }
        })
        return dataNew
    },
    show(value){

        this.setState({show : value})
    },
    changeAnomaly(datas, value, number) {
        debugger
        let updateAnomaly = update(this.state, {
            datas: {
                [number]: {
                    status : {$set : value} ,
                    selected : {$set : 'none'}
                }
            },
        })
        this.setState(updateAnomaly)
    },
    showSelect(datas , number){
        debugger
       /* let datas = _.cloneDeep(this.state.datas)*/
        let style = datas[number].selected == null || datas[number].selected ==  'none' ? 'block' : 'none'
        for(let i =0 ; i < datas.length ; i++){
            datas[i].selected = ( i == number ? style : 'none')
        }
        let updateStyle = update(this.state , {
            datas : {$set : datas}
        })
        this.setState(updateStyle)
    },
    getfilterValue(value){
        this.setState({filterValue : value})
    },
    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    },

    downloadCSV(value, datas) {
        var data, filename, link;
        var csv = this.convertArrayOfObjectsToCSV({
            data: datas
        });
        if (csv == null) return;

        filename = value + '.csv' || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    },
    configDataCVS(data){
        let data_export = []
        _.forEach(data , function(object , index) {

            data_export.push(_.omit(object ,["selected" , "status"]))
        })
        return data_export
    },
    render(){
        let {filterValue} = this.state
            , data = _.cloneDeep(this.state.datas)
            , newData = filterValue == 0 ? data : this.filterTable(data , filterValue)
            , child = []
            , style = !this.state.show ?  'block' : 'none'
            , style1 = this.state.show ?  'block' : 'none'
            , data_export = this.configDataCVS(newData)
        for(let i = 1 ; i <= newData.length ; i++) {
            let key = i-1
            let className = "anomaly-state selected " + newData[i-1].status
            child[i] = <tr key= {i}>
                            <td><span>{newData[key].id}</span></td>
                            <td className="text-left"><span>{newData[key]['Security in Fault']}</span></td>
                            <td className="text-left"><span>62</span></td>
                            <td className="text-left"><span>8</span></td>
                            <td className="text-left"><span>4774</span></td>
                            <td className="text-left"><span>{newData[key]['Confidentiality']}</span></td>
                            <td className="relative">
                              <span className= {className} data-state="true" onClick={this.showSelect.bind(this,data,i-1)}></span>
                              <div className="anomaly-showhide">
                                  <Anomaly onChange = {this.changeAnomaly} number = {key} show={newData[i-1].selected} data = {data} />
                              </div>
                            </td>
                          </tr>
        }
        return (
        <div>
            <div className="extra-block" style={{display : style }}>
                  <a href=" javascript:;" className="details-toggle" data-toggle="collapse" data-target="#demo" onClick = {this.show.bind(this,true)}><i className="fa fa-caret-right mr-xs"></i>Show details</a>
            </div>
            <div style={{display : style1 }}>
                <div className="block-header row">
                    <div className="col-md-4">
                        <h4 className="anomaly-title">Anomaly Details - List of Users at Risk
                            <div  className="fix_whitespace">
                                <HelpButton
                                    classMenu="fix-overview-help-button-table"
                                    classIcon="overview_question_a help_question_a"   setValue="This details the list of users at risk having the most access to client document at risk."/>
                            </div>
                        </h4>
                    </div>
                    <div className="col-md-8 filter-state">
                        Display:
                        <a href="javascript:;" onClick={this.getfilterValue.bind(this,0)}>All</a> -
                        <a href="javascript:;" onClick={this.getfilterValue.bind(this,'not-reviewed')}><span className="anomaly-state not-reviewed"></span> Not Reviewed </a> -
                        <a href="javascript:;" onClick={this.getfilterValue.bind(this,'investigation')}><span className="anomaly-state investigation"></span> Under Investigation </a> -
                        <a href="javascript:;" onClick={this.getfilterValue.bind(this,'true')}><span className="anomaly-state true"></span> True Positive </a> -
                        <a href="javascript:;" onClick={this.getfilterValue.bind(this,'false')}><span className="anomaly-state false"></span> False Positive </a>
                    </div>

                    <div className="table-responsive">
                        <table className="table anomaly-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th className="text-left">Active Directory Group</th>
                                    <th className="text-left">Document at Risk</th>
                                    <th className="text-left">Folder at Risk</th>
                                    <th className="text-left">User at Risk</th>
                                    <th className="text-left">Confidentiality at Risk</th>
                                    <th>Review Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {child}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="extra-block">
                     <a href="javascript:;" className="details-toggle" data-toggle="collapse" data-target="#demo" onClick = {this.show.bind(this, false )}><i className="fa fa-caret-right mr-xs"></i>Show less</a>
                      <span className="inline-block-item ml-md">*100 anomalies are being displayed, full report available through extraction only</span>
                      <a href="javascript:;" className="pull-right btn btn-green" onClick={this.downloadCSV.bind(this,'data', data_export )}>Extract</a>
                </div>
            </div>
        </div>
        )
    }
});

module.exports =  TableAnomaly