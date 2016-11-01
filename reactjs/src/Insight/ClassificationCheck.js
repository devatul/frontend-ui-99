import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ClassificationCheck.rt'
import $ from 'jquery'
var ClassificationCheck = React.createClass({
    getInitialState() {
        return {
            data: [{
                'name': 'Contract Bank 2016.doc',
                'path': '/Document/Dathena99/contract/',
                'category': 'Accounting/Tax',
                'Confidentiality': 'Confidentiality',
                'Last Modify by': 'John.Hayt',
                'Reviewer': 'Billy.Barty',
                'Involved in Anomaly': 'Yes'
            }, {
                'name': 'Contract Bank 2016.doc',
                'path': '/Document/Dathena99/contract/',
                'category': 'Accounting/Tax',
                'Confidentiality': 'Confidentiality',
                'Last Modify by': 'John.Hayt',
                'Reviewer': 'Billy.Barty',
                'Involved in Anomaly': 'Yes'
            }, {
                'name': 'Contract Bank 2016.doc',
                'path': '/Document/Dathena99/contract/',
                'category': 'Accounting/Tax',
                'Confidentiality': 'Confidentiality',
                'Last Modify by': 'John.Hayt',
                'Reviewer': 'Billy.Barty',
                'Involved in Anomaly': 'Yes'
            }]
        };
    },
    search(event) {
        let value = event.target.value
        let data = _.cloneDeep(this.state.data)
        let newData = []
        _.forEach(data, function(object, index) {
            if ((object['name']).search(value) >= 0) {
                newData.push(
                    object
                )
            }

        })
        console.log(newData)
    },
    componentDidMount() {},
    render: template
});
module.exports = ClassificationCheck;
