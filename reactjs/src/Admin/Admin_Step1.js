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
            count: 0,
            data_block: {
                block1: [],
                block2: [],
                block3: []
            }
        }

    },



    /*changeDatapage(){
        this.props.changeDatapage(this.state.data_block)
    },*/
    onChangeInput(block, fieldId, value) {

        /* let name =  'block'+block*/

        let data = this.state.data_block
        let block_change = (block == '1') ? data.block1 : (block == '2' ? data.block2 : data.block3)
        let newData = []
        let check = false
        if (_.isEmpty(block_change)) {
            block_change.push({
                id: fieldId,
                value: value
            })
        } else {
            for (let i = 0; i < block_change.length; i++) {
                if (block_change[i].id == fieldId) {
                    block_change[i].value = value;
                    check = true
                    break
                }
            }
            if (!check) {
                block_change.push({
                    id: fieldId,
                    value: value
                })

            }
        }
        console.log(block_change);

        let updateBlock = update(this.state, {
            data_block: {
                ['block'+block]: { $set: block_change }
            }
        })
        this.setState(updateBlock)
            /*   let check = false*/
            /* _.forEach(data[block], function(object, index) {
                if (data[block][index].label == id) {
                    data[block][index].value = value
                    check = true
                }
            })
            if (!check) {
                if (data[block] != undefined) {
                    newData.push({
                        label: id,
                        value: value
                    })
                    newData = _.concat(newData , data[block])

                } else {
                    newData = {
                        label: id,
                        value: value
                    }
                }
                data[block] = newData
            }*/
            /*newData.push({
                label: id,
                value: value
            })
            console.log(data[block])
            if(data[block] != undefined){
                 data[block] = _.concat(newData, data[block])
            }
            console.log(newData)
            this.setState({ data_block: newData })*/
        this.props.changeDatapage(this.state.data_block)
    },
    clickComfirm() {

        this.setState({ complete: 1, readOnly: true }),
            console.log('readOnly', this.state.readOnly)
    },
    clickValidate1() {
        this.setState({ complete: 2, readOnly1: true })
    },
    editButton(value, readOnly) {
        switch (value) {
            case 1:
                {
                    this.setState({ readOnly: false })
                    if (readOnly == false) {
                        this.setState({ readOnly: true })
                    }
                }
                break;
            case 2:
                {
                    this.setState({ readOnly1: false })
                    if (readOnly == false) {
                        this.setState({ readOnly1: true })
                    }
                }
                break;
            case 3:
                {
                    $("#block1_step1").find("input").prop('disabled', false);
                    $("#block1_step1").find("select").attr("disabled", false);
                    $("#block1_step1").find("a").css('pointer-events', 'auto');
                    this.setState({ readOnly2: false })
                    if (readOnly == false) {
                        $("#block1_step1").find("input").prop('disabled', true);
                        $("#block1_step1").find("a").css('pointer-events', 'none');
                        $("#block1_step1").find("select").attr("disabled", true);
                        this.setState({ readOnly2: true })
                    }
                }
                break;
        }

    },
    addSLA(value) {

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
        this.setState({ complete: 3, readOnly: true }),
            $("#block1_step1").find("input").prop('disabled', true);
        $("#block1_step1").find("select").attr("disabled", true);
        $("#block1_step1").find("a").css('pointer-events', 'none');
        this.props.nextStep(2)
    },
    render: template
});

module.exports = Admin_Step1
