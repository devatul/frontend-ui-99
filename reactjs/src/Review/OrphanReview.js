import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './OrphanReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import 'jquery'
import chart from '../script/chart-review.js'
import Constant from '../Constant.js'

var OrphanReview = React.createClass({
    displayName: 'OrphanReview',
    getInitialState() {
        return {
            orphan_current: {},
            list_orphan: [] 
        };
    },
    componentDidMount() {
        chart();
        this.getOrphan();
        this.chooseCluster();
    },
    getOrphan() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/documents/",
            dataType: 'json',
            //data: JSON.stringify(bodyRequest),
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    list_orphan: {$set: data},
                    orphan_current: {$set: data[0]}
                });
                this.setState(updateState);
                console.log("List document ok: ", data);
            }.bind(this),
            error: function(error) {
                console.log("List document error: " + error);
            }.bind(this)
        });
    },
    chooseCluster() {
        $('#choose_cluster').change(function(element){
                console.log(element.target.value);
                var orphan_selected = element.target.value;
                var updateState = update(this.state, {
                    orphan_current: {$set: this.state.list_orphan[orphan_selected]}
                });
                this.setState(updateState);
                console.log("orpahan: ", this.state.orphan_current);
        }.bind(this));
    },
    render:template
});

module.exports = OrphanReview;