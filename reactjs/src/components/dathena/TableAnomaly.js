import React,  { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import InfoButton from '../dathena/InfoButton'
import SelectBox from '../dathena/SelectBox'
import makeRequest from '../../utils/http'
import HelpButton from "./HelpButton"
import _ from 'lodash'
import Anomaly from '../../Insight/components/anomalyStateSelect'
var TableAnomaly = React.createClass({
    getInitialState(){
        return{
             datas:  [
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "11",
                            "status" : "true"
                          },
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "21",
                            "status" : "true"
                          },
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "31",
                            "status" : "true"
                          },
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "41",
                            "status" : "true"
                          },
                          {
                            "Security in Fault": ".ADCompliance_RW",
                            "Confidentiality": "Banking Secrecy",
                            "id": "51",
                            "status" : "true"
                          }
                    ],
             style : 0,
             display_anomaly: [null],
             displaySelect : ['','','','','']

        }
    },
    componentDidUpdate(prevProps,prevState){
        if(this.props.filter != prevProps.filter){

        }
    },
    filterTable(value){

    },

    changeAnomaly(value, number) {
        debugger

        /* var anomaly_arr = []
         anomaly_arr[number] = value*/
        let updateAnomaly = update(this.state, {
            display_anomaly: {
                [number]: { $set: value }
            },
             displaySelect : {
                [number] : {$set : 'none'}
            }

        })
        this.setState(updateAnomaly)
    },
    showSelect(number){
        debugger
        let {displaySelect} = this.state

        let style = displaySelect[number] ==  '' || displaySelect[number] ==  'none' ? 'block' : 'none'
        for(let i =0 ; i < displaySelect.length ; i++){
            debugger
            displaySelect[i] = ( i == number ? style : 'none')
        }
        let updateStyle = update(this.state , {
            displaySelect : {$set : displaySelect}
        })
        this.setState(updateStyle)
    },
    render(){
        let {datas} = this.state

        let child = []
        for(let i = 1 ; i<= this.state.datas.length ; i++) {
            let key = i-1
            let className = "anomaly-state selected " + (this.state.display_anomaly[i] != null ?  this.state.display_anomaly[i] : datas[key]['status'])

            child[i] = <tr key= {i}>
                            <td><span>{datas[key].id}</span></td>
                            <td className="text-left"><span>{datas[key]['Security in Fault']}</span></td>
                            <td className="text-left"><span>62</span></td>
                            <td className="text-left"><span>8</span></td>
                            <td className="text-left"><span>4774</span></td>
                            <td className="text-left"><span>{datas[key]['Confidentiality']}</span></td>
                            <td className="relative">
                              <span className= {className} data-state="true" onClick={this.showSelect.bind(this,i-1)}></span>
                              <div class="anomaly-showhide">
                                  <Anomaly onChange = {this.changeAnomaly} number = {i} show={this.state.displaySelect[i-1]}/>
                              </div>
                            </td>
                          </tr>
        }
        return (

            <div>
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
        )
    }
});

module.exports =  TableAnomaly