import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Admin.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'


module.exports = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            step : 1 ,
        };
    },
    changeStep(value){
        if(value <= this.state.step)
        this.setState({step : value})
    },
    nextStep(value){
        debugger
        this.setState({step : value})
        console.log(this.state.step)
    },

    render:template
});