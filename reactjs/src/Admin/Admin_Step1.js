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
            readOnly2: false,
            SLA: [],
            SLA1: [],
            SLA2: [],
            count: 0
        }

    },
    clickComfirm() {
        debugger
        this.setState({ complete: 1 }),

            this.setState({ readOnly: true })
        console.log('readOnly', this.state.readOnly)
    },
    clickValidate1() {
        this.setState({ complete: 2 })
        this.setState({ readOnly1: true })

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
        if (value == 3) {
            $("#block1_step1").find("input").prop('disabled', false);
            $("#block1_step1").find("select").attr("disabled", false);
            $( "#block1_step1" ).find( "a" ).css('pointer-events', 'auto');
            this.setState({ readOnly2: false })
            if (readOnly == false) {
                $("#block1_step1").find("input").prop('disabled', true);
                $( "#block1_step1" ).find( "a" ).css('pointer-events', 'none');
                $("#block1_step1").find("select").attr("disabled", true);
                this.setState({ readOnly2: true })
            }
        }

    },
    addSLA(value) {
        debugger
        if (value == 1) {
            let newSLA = { key: this.state.SLA.length };
            this.setState({ SLA: _.concat(newSLA, this.state.SLA) })
        }
        if (value == 2) {
            let newSLA = { key: this.state.SLA1.length };
            this.setState({ SLA1: _.concat(newSLA, this.state.SLA1) })
        }
        if (value == 3) {
            let newSLA = { key: this.state.SLA2.length };
            this.setState({ SLA2: _.concat(newSLA, this.state.SLA2) })
        }


        /* this.setState({count : this.state.count + 1})*/
    },
    nextStep() {
        this.setState({ complete: 3 , readOnly: true}),
        $("#block1_step1").find("input").prop('disabled', true);
        $("#block1_step1").find("select").attr("disabled", true);
        $( "#block1_step1" ).find( "a" ).css('pointer-events', 'none');
        this.props.nextStep(2)
    },
    render: template
});

module.exports = Admin_Step1
