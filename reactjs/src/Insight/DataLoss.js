import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DataLoss.rt'
import update from 'react-addons-update'
import Constant from '../Constant.js'
import 'jquery'

var DataLost = React.createClass({
    getInitialState() {
        return {
            dataLoss: {},
            language: [],
            default_data: []
        };
    },
    changeDefaul(language) {
        debugger
        let dataLoss = _.cloneDeep(this.state.dataLoss);
        for (let i = 0; i < dataLoss.length; i++) {
            if (dataLoss[i].language == language) {
                this.setState({ default_data: dataLoss[i] })
            }
        }
    },
    getDataLoss() {

        $.ajax({

            url: Constant.SERVER_API + 'api/insight/data-loss/',
            dataType: 'json',
            type: 'GET',

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {

                console.log('data', data)
                let arr = []
                    /* this.setState({ dataLoss: data })
                     this.setState({ default_data: data[0] })*/
                for (let i = 0; i < data.length; i++) {

                    arr.push(data[i].language)
                }
                /*  this.setState({language : arr})*/
                let updateDataLoss = update(this.state, {
                    dataLoss: { $set: data },
                    default_data: { $set: data[0] },
                    language: { $set: arr }
                })
                this.setState(updateDataLoss)
                console.log('data', data)
                console.log('default_data', this.state.default_data)

            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },

    componentDidMount() {
        this.getDataLoss()
    },
    render: template
});
module.exports = DataLost;
