'Use Strict'
import React, { Component, propTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import _ from 'lodash'
import template from './Admin_Step4.rt'
import loadScript from '../script/javascript.admin.js';
import 'jquery'

var Admin_Step3 = React.createClass({
    getInitialState() {
        return {
            complete: 0,
            cycleProgress: 'progress-radial progress-0',
            readOnly: false,
            readOnly1: false,
            readOnly2: false,
            add_DomainDetails  : [''],
            count : 0
        }

    },
    componentDidMount(){
       /* this.loadScript();*/
    },
    validate_step1(){

        this.setState({complete: 1 , readOnly : true})
    },
    validate_step2 () {
        this.setState({complete: 2,readOnly1 : true})
    },
    validate_step3 () {
        this.setState({complete: 3 , readOnly2 : true})
    },
    add(value){
        debugger
        if(value == 1 ){
            let addNdew = { key: this.state.add_DomainDetails.length};
            this.setState({add_DomainDetails : _.concat(addNdew ,this.state.add_DomainDetails)})
        }
    },
    editButton(value, readOnly) {
        debugger
        if (value == 1) {
            this.setState({ readOnly: false })
            if (!readOnly) {
                this.setState({ readOnly: true })
            }
        }
        if (value == 2) {
            this.setState({ readOnly1: false })
            if (!readOnly) {
                this.setState({ readOnly1: true })
            }
        }
        if (value == 3) {
            this.setState({ readOnly2: false })
            if (!readOnly) {
                this.setState({ readOnly2: true })
            }
        }

    },

    render: template
})

module.exports = Admin_Step3