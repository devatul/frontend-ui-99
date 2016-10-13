'Use Strict'
import React, { Component, propTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import _ from 'lodash'
import template from './Admin_Step3.rt'


var Admin_Step3 = React.createClass({
    getInitialState() {
        return {
            complete: 0,
            cycleProgress: 'progress-radial progress-0',
            readOnly: false,
            readOnly1: false,
            readOnly2: false,
            add_Classification  :  [],
            add_Coordinator  :  [],
            add_Audit : [],
            count : 0
        }

    },


    validate_step1(){

       $( "#block1_step3" ).find( "input" ).prop('disabled', true);
        /* $("#input1").prop('disabled', false);*/
         $( "#block1_step3" ).find( "a" ).css('pointer-events', 'none');
            this.setState({complete: 1 , readOnly : true})
    },
    validate_step2 () {
         $( "#block2_step3" ).find( "input" ).prop('disabled', true);
         $("#checkbox2").prop('readonly', true);
         $( "#block2_step3" ).find( "a" ).css('pointer-events', 'none');
        this.setState({complete: 2,readOnly1 : true})
    },
    /*validate_step3 () {
        this.setState({complete: 3 , readOnly2 : true})
    },*/
    add(value){
        debugger
        if(value == 1 ){
           let addNdew = { key: this.state.add_Classification.length};
            this.setState({add_Classification : _.concat(addNdew ,this.state.add_Classification)})}
         if(value == 2 ){
           let addNdew = { key: this.state.add_Coordinator.length};
            this.setState({add_Coordinator : _.concat(addNdew ,this.state.add_Coordinator)})}
        if(value == 3 ){
           let addNdew = { key: this.state.add_Audit.length};
            this.setState({add_Audit : _.concat(addNdew ,this.state.add_Audit)})}
    },
    editButton(value, readOnly) {
        debugger
        if (value == 1) {
            this.setState({ readOnly: false })
             $( "#block1_step3" ).find( "input" ).prop('disabled', false);
              $( "#block1_step3" ).find( "a" ).css('pointer-events', 'auto');
            if (!readOnly) {
                 $( "#block1_step3" ).find( "input" ).prop('disabled', true);
                  $( "#block1_step3" ).find( "a" ).css('pointer-events', 'none');
                this.setState({ readOnly: true })
            }
        }
        if (value == 2) {
            this.setState({ readOnly1: false })
             $( "#block2_step3" ).find( "input" ).prop('disabled', false);
             $( "#block2_step3" ).find( "a" ).css('pointer-events', 'auto');
            if (!readOnly) {
                this.setState({ readOnly1: true })
                 $( "#block2_step3" ).find( "input" ).prop('disabled', true);
                 $( "#block2_step3" ).find( "a" ).css('pointer-events', 'none');
            }
        }
        if (value == 3) {
            this.setState({ readOnly2: false })
             $("#block3_step3").find("input").prop('disabled', false);
            if (!readOnly) {
                this.setState({ readOnly2: true })
                 $("#block3_step3").find("input").prop('disabled', true);
            }
        }

    },
    nextStep(){
         this.setState({ complete: 3 , readOnly2: true}),
        $("#block3_step3").find("input").prop('disabled', true);
        this.props.nextStep(4)
    },

    render: template
})

module.exports = Admin_Step3