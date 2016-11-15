import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import template from './ClassificationCheck.rt';
import $ from 'jquery';

var ClassificationCheck = React.createClass({
    getInitialState() {
      return {
        data: {
          "number of results": 3,
          "elapsed time in second": 0.48,
          "documents": [
            {
              "type": {
                "name": "Excel",
                "id": 1
              },
              "name": "document.xls",
              "path": "/path/to/document",
              "category": {
                "name": "Accounting/Tax",
                "id": "1"
              },
              "confidentiality": {
                "name": "Banking Secrecy",
                "id": "1"
              },
              "last modifier": "FirstName.LastName",
              "reviewer": "FirstName.LastName",
              "involved in anomaly": true
            },
            {
              "type": {
                "name": "Excel",
                "id": 1
              },
              "name": "document1.xls",
              "path": "/path/to/document",
              "category": {
                "name": "Accounting/Tax",
                "id": "1"
              },
              "confidentiality": {
                "name": "Banking Secrecy",
                "id": "1"
              },
              "last modifier": "FirstName.LastName",
              "reviewer": "FirstName.LastName",
              "involved in anomaly": false
            },
            {
              "type": {
                "name": "Excel",
                "id": 1
              },
              "name": "document2.xls",
              "path": "/path/to/document",
              "category": {
                "name": "Accounting/Tax",
                "id": "1"
              },
              "confidentiality": {
                "name": "Banking Secrecy",
                "id": "1"
              },
              "last modifier": "FirstName.LastName",
              "reviewer": "FirstName.LastName",
              "involved in anomaly": false
            }
          ]
        },
        documents: [],
        stackChange: [],
        categories: [],
        confidentialities: [],
        shouldUpdate: false,
        documentPreview: 0,
        openPreview: false,
        result : false,
        className : 'smart-link1',
        hasNextDocument : true ,
      };
    },

   /* shouldComponentUpdate(nextProps, nextState) {
        return nextState.shouldUpdate;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.shouldUpdate === true) {
            this.setState({ shouldUpdate: false });
        }
    },*/

    onClickDocumentName(index) {
        let hasNextDocument = index == this.state.data.documents.length - 1 ? false : true
        if (index <= this.state.data.documents.length - 1) {
            this.setState({
                openPreview: true,
                documentPreview: index,
                hasNextDocument : hasNextDocument
            });
        }
    },
    handleOnMouseOver(){
        this.setState({className : 'smart-link'})
    },
    handleOnMouseOut(){
        this.setState({className : 'smart-link1'})
    },
    backScreen(){
        this.setState({result : false , className : 'smart-link1'})
    },
    handleUndo() {
        if (this.state.stackChange.length > 0) {
            let { documents, stackChange } = this.state,

                item = stackChange[stackChange.length - 1],

                updateDocuments = update(documents, {
                    [item.id]: {
                        $set: item.data
                    }
                }),

                updateStack = update(stackChange, {
                    $splice: [
                        [stackChange.length - 1, 1]
                    ]
                });

            this.setState({ documents: updateDocuments, stackChange: updateStack, shouldUpdate: true });
        }
    },
    closePreview() {
        this.setState({ openPreview: false, shouldUpdate: true });
    },


    search(event) {
        if(event.which == 13 || event.type == 'click' ) {
            this.setState({result : true})
        }
       /* this.setState({result : true})*/
       /* let value = event.target.value
        let data = _.cloneDeep(this.state.data)
        let newData = []
        _.forEach(data, function(object, index) {
            if ((object['name']).search(value) >= 0) {
                newData.push(
                    object
                )
            }

        })
        console.log(newData)*/
    },

    componentDidMount() {},

    render: template
});

module.exports = ClassificationCheck;
