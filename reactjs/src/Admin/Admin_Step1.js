'Use Strict'
import React, { Component, propTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import _ from 'lodash'
import template from './Admin_Step1.rt'

var Admin_Step1 = React.createClass({
    getInitialState() {
        return {
            complete: 0,
            cycleProgress: 'progress-radial progress-0',
            readOnly: false,
            readOnly1: false,
            SLA : [],
            SLA1: [],
            SLA2: [],
            count : 0
        }

    },
    clickComfirm() {
        debugger
        this.setState({ complete: 1 }),
        this.setState({ cycleProgress: 'progress-radial progress-33' })
        this.setState({ readOnly: true })
        console.log('readOnly', this.state.readOnly)
    },
    clickValidate1() {
        this.setState({ complete: 2 })
          this.setState({ readOnly1: true })
        this.setState({ cycleProgress: 'progress-radial progress-66' })
    },
    editButton(value, readOnly) {
        debugger
        if (value == 1) {
            this.setState({ readOnly: false })
            if (readOnly == false) {
                this.setState({ readOnly: true })
            }
        }
        if (value == 2) {
            this.setState({ readOnly1: false })
            if (readOnly == false) {
                this.setState({ readOnly1: true })
            }
        }

    },
    addSLA(value){
        debugger
        if(value == 1 ){
             let newSLA = { key: this.state.SLA.length};
            this.setState({SLA : _.concat(newSLA,this.state.SLA)})
        }
        if(value == 2 ){
             let newSLA = { key: this.state.SLA1.length};
            this.setState({SLA1 : _.concat(newSLA,this.state.SLA1)})
        }
        if(value == 3 ){
             let newSLA = { key: this.state.SLA2.length};
            this.setState({SLA2 : _.concat(newSLA,this.state.SLA2)})
        }


        /* this.setState({count : this.state.count + 1})*/
    },
    render: template
});

module.exports = Admin_Step1
