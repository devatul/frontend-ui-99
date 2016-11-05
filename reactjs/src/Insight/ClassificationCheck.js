import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ClassificationCheck.rt'
import $ from 'jquery'
var ClassificationCheck = React.createClass({
    getInitialState() {
        return {
            data: [{
                'index': 0,
                'name': 'Contract Bank 2016.doc',
                'path': '/Document/Dathena99/contract/',
                'category':'Accounting/Tax',
                'Confidentiality': 'Confidentiality',
                'Last Modify by': 'John.Hayt',
                'Reviewer': 'Billy.Barty',
                'Involved in Anomaly': 'Yes'
            }, {
                'index': 1,
                'name': 'Contract Bank 2016.doc',
                'path': '/Document/Dathena99/contract/',
                'category':'Accounting/Tax',
                'Confidentiality': 'Confidentiality',
                'Last Modify by': 'John.Hayt',
                'Reviewer': 'Billy.Barty',
                'Involved in Anomaly': 'Yes'
            }, {
                'index': 2,
                'name': 'Contract Bank 2016.doc',
                'path': '/Document/Dathena99/contract/',
                'category':'Accounting/Tax',
                'Confidentiality': 'Confidentiality',
                'Last Modify by': 'John.Hayt',
                'Reviewer': 'Billy.Barty',
                'Involved in Anomaly': 'Yes'
            }],
            documents: [],
            stackChange: [],
            categories: [],
            confidentialities: [],
            shouldUpdate: false,
            documentPreview: 0,
            openPreview: false,
        };
    },
    onClickDocumentName(index) {
          this.setState({
                openPreview: true,
                documentPreview: index,
                //shouldUpdate: true
            });
    },
    handleUndo() {
        if(this.state.stackChange.length > 0) {
            let { documents, stackChange } = this.state,

                item = stackChange[stackChange.length - 1],

                updateDocuments = update(documents, {
                    [item.id]: {
                        $set: item.data
                    }
                }),

                updateStack = update(stackChange, {
                    $splice: [[stackChange.length - 1, 1]]
                });

            this.setState({ documents: updateDocuments, stackChange: updateStack, shouldUpdate: true });
        }
    },
    closePreview() {
        this.setState({ openPreview: false, shouldUpdate: true });
    },
    handleTableRowOnClick(event, index) {
        switch(event.currentTarget.id) {
            case 'documentName': {
                this.onClickDocumentName(index);
            }
            break;
            case 'documentStatus': {
                this.onClickButtonStatus(index);
            }
        }
    },
    handleTableRowOnChange(event, index) {

        switch(event.target.id) {
            case 'checkbox': {
                this.onChangeCheckBox(event, index);
            }
            break;

            case 'selectCategory': {
                this.onChangeCategory(event, index);
            }
            break;

            case 'selectConfidentiality': {
                this.onChangeConfidentiality(event, index);
            }
        }
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
