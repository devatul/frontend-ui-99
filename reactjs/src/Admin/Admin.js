import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Admin.rt'
import update from 'react-addons-update'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'


module.exports = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            step: 1,
            data: {
                data_step1: null,
                data_step2: null,
                data_step3: null,
                data_step4: null,
            }



        };
    },
    getDataPage1(data) {
        debugger
        console.log(data)
        let updateData = update(this.state, {
            data : {
                data_step1 : {$set : data}
            }
        })
        this.setState(updateData)
    },
    getDataPage2(data) {
        debugger
        console.log(data)
        this.setState({ data_step2: data })
    },
    getDataPage3(data) {
        debugger
        console.log(data)
        this.setState({ data_step3: data })
    },
    getDataPage4(data) {
        debugger
        console.log(data)
        this.setState({ data_step4: data })
    },

    changeStep(value) {
        /*   if(value <= this.state.step)*/
        this.setState({ step: value })
    },
    nextStep(value) {
        debugger
        this.setState({ step: value })
        console.log(this.state.step)
    },

    render: template
});
