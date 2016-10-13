'Use Strict'
import React, { Component, propTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import _ from 'lodash'
import template from './Admin_Step2.rt'

var Admin_Step2 = React.createClass({
    getInitialState() {
        return {
            complete: 0,
            cycleProgress: 'progress-radial progress-0',
            readOnly: false,
            readOnly1: false,
            readOnly2: false,
            readOnly3: false,
            add_DomainDetails  : [{key : 0}],
            add_Folder  : [],
            add_Server : [],
            add_Server_Administrator : [{}],
            count : 0
        }

    },

    clickValidate_step1(){
        $( "#block1" ).find( "input" ).prop('disabled', true);
        $( "#block1" ).find( "a" ).css('pointer-events', 'none');

        this.setState({complete: 1 , readOnly: true})
    },
    validate_step2 () {
         $( "#block2" ).find( "input" ).prop('disabled', true);
          $( "#block2" ).find( "a" ).css('pointer-events', 'none');
        this.setState({complete: 2, readOnly1 : true})
    },
    validate_step3 () {
        $( "#block3" ).find( "input" ).prop('disabled', true);
         $( "#block3" ).find( "select" ).attr("disabled", true);
        this.setState({complete: 3 , readOnly2 : true})
    },
    add(value){
        debugger
        if(value == 1 ){
            /*let addNdew = _.cloneDeep(this.state.add_DomainDetails)
            addNdew[0] = {key : addNdew[0].key + 1}
            this.setState({add_DomainDetails : addNdew})*/
            let addNdew = { key: this.state.add_DomainDetails.length};
            this.setState({add_DomainDetails : _.concat(addNdew ,this.state.add_DomainDetails)})
        }
        if(value == 2 ){
            /*let addNdew = _.cloneDeep(this.state.add_Folder)
            addNdew[0] = {key : addNdew[0].key + 1}
            this.setState({add_Folder : addNdew})*/
            let addNdew = { key: this.state.add_Folder.length};
            this.setState({add_Folder : _.concat(addNdew ,this.state.add_Folder)})

        }
        if(value == 3){

            let addNdew = { key: this.state.add_Server.length};
            this.setState({add_Server : _.concat(addNdew ,this.state.add_Server)})
        }
        if(value == 4 ){
            let addNdew = { key: this.state.add_Server_Administrator.length};
            this.setState({add_Server_Administrator : _.concat(addNdew ,this.state.add_Server_Administrator)})
        }
        /*if(value == 2 ){
            let addNdew = { key: this.state.add_Folder.length};
            this.setState({add_Folder : _.concat(addNdew ,this.state.add_Folder)})
        }*/
    },
    addAdmin(value){

    },
    editButton(value, readOnly) {
        debugger
        if (value == 1) {
            this.setState({ readOnly: false })
            $( "#block1" ).find( "input" ).prop('disabled', false);
            $( "#block1" ).find( "a" ).css('pointer-events', 'auto');
            if (!readOnly) {
                $( "#block1" ).find( "input" ).prop('disabled', true);
                $( "#block1" ).find( "a" ).css('pointer-events', 'none');
                this.setState({ readOnly: true })
            }
        }
        if (value == 2) {
            $( "#block2" ).find( "input" ).prop('disabled', false);
             $( "#block2" ).find( "a" ).css('pointer-events', 'auto');
            this.setState({ readOnly1: false })
            if (!readOnly) {
                $( "#block2" ).find( "input" ).prop('disabled', true);
                 $( "#block2" ).find( "a" ).css('pointer-events', 'none');
                this.setState({ readOnly1: true })
            }
        }
        if (value == 3) {

            this.setState({ readOnly2: false })
            $( "#block3" ).find( "input" ).prop('disabled', false);
             $( "#block3" ).find( "select" ).attr("disabled", false);
            if (!readOnly) {
                $( "#block3" ).find( "input" ).prop('disabled', true);
                 $( "#block3" ).find( "select" ).attr("disabled", true);
                this.setState({ readOnly2: true })
            }}
        if (value == 4) {

            $( "#block4" ).find( "input" ).prop('disabled', false);
              this.setState({ readOnly3: false })
            if (!readOnly) {
                $( "#block4" ).find( "input" ).prop('disabled', true);
                this.setState({ readOnly3: true })
            }

        }

    },
    nextStep(){
        this.setState({ complete: 4 , readOnly3: true}),
        $( "#block4" ).find( "input" ).prop('disabled', true);

        this.props.nextStep(3)

    },

    render: template
})

module.exports = Admin_Step2