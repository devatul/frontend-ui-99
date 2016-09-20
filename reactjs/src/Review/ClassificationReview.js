import React, { Component } from 'react'
import { render } from 'react-dom'
import template from './ClassificationReview.rt'
import update from 'react/lib/update'
import Constant from '../Constant.js'
import { cloneDeep, isEqual } from 'lodash'
import { makeRequest } from '../utils/http'

var ClassificationReview = React.createClass({

    getInitialState() {
        return {
            dataReview: [],
            categories: [],
            confidentialities: [],
            shouldUpdate: false,
            openPreview: false,
            current: {
                doc: 0,
                review: 0
            },
            stackChange: []
        };
    },

    componentDidMount() {
        this.getCategories();
        this.getConfidentialities();
        this.getClassificationReview();
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.shouldUpdate;  
    },

    componentDidUpdate(prevProps, prevState) {
        let { dataReview, current } = this.state;
        if(this.state.shouldUpdate === true) {
            this.setState({ shouldUpdate: false });
        }
        debugger
        if(prevState.dataReview[current.review] && !isEqual(dataReview[current.review].documents, prevState.dataReview[current.review].documents)) {
            this.checkValidNumber(dataReview[current.review].documents);
        }
    },

    checkValidNumber(documents) {
        let numCheck = 0, numValid = 0, updateData = {},
            { dataReview, current } = this.state,
            docLength = documents.length;

        for(let i = docLength - 1; i >= 0; i--) {
            if(documents[i].checked === true) {
                numCheck++;
            }
            if(documents[i].status === "valid") {
                numValid++;
            }
        }

        updateData = update(dataReview, {
            [current.review]: {
                checkedNumber: {
                    $set: numCheck
                },
                validateNumber: {
                    $set: numValid
                },
                checkedAll: {
                    $set: (numCheck === docLength)
                }
            }
        });
        
        this.setState({ dataReview: updateData, shouldUpdate: true });
    },

    handleClickApproveButton(reviewIndex) {

        let updateData = update(this.state.dataReview, {
            [reviewIndex]: {
                documents: {
                    $apply: (data) => {
                        data = cloneDeep(data);
                        debugger
                        for(let i = data.length - 1; i >= 0; i--) {
                            if(data[i].checked) {
                                data[i].status = 'valid';
                                data[i].checked = false;
                            }
                        }

                        return data;
                    }
                }
            }
        });
        debugger
        this.setState({
            dataReview: updateData,
            current: {
                doc: this.state.current.doc,
                review: reviewIndex
            },
            shouldUpdate: true
        });
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

    onClickDocumentName(index) {
        let idx = index.split('_'),
            reviewIndex = parseInt(idx[0]),
            docIndex = parseInt(idx[1]);

        if(docIndex <= (this.state.dataReview[reviewIndex].documents.length - 1)) {
            this.setState({
                openPreview: true,
                current: {
                    doc: docIndex,
                    review: reviewIndex
                },
                shouldUpdate: true
            });
        }
    },

    onClickButtonStatus(index) {
        let idx = index.split('_'),
            reviewIndex = parseInt(idx[0]),
            docIndex = parseInt(idx[1]),
            document = this.state.dataReview[reviewIndex].documents[docIndex];
            debugger
        if(document.status === 'invalid') {
            let updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            status: { $set: 'valid' }
                        }
                    }
                }
            }),

            updateStack = update(this.state.stackChange, {
                $set: {
                    [reviewIndex]: []
                }
            });
            
            updateStack[reviewIndex].push({
                id: docIndex,
                data: Object.assign({}, document)
            });
            //debugger
            this.setState({
                dataReview: updateData,
                stackChange: updateStack,
                current: {
                    doc: docIndex,
                    review: reviewIndex
                },
                shouldUpdate: true
            });
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

    onChangeCheckBox(event, index) {
        debugger
        let idx = index.split('_'),
            reviewIndex = parseInt(idx[0]),
            docIndex = parseInt(idx[1]),
            document = this.state.dataReview[reviewIndex].documents[docIndex],
            
            updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            checked: { $set: event.target.checked }
                        }
                    }
                }
            }),

            updateStack = update(this.state.stackChange, {
                $set: {
                    [reviewIndex]: []
                }
            });
            
            updateStack[reviewIndex].push({
                id: docIndex,
                data: Object.assign({}, document)
            });

        this.setState({
            dataReview: updateData,
            stackChange: updateStack,
            current: {
                doc: docIndex,
                review: reviewIndex
            },
            shouldUpdate: true
        });
    },

    onChangeCategory(event, index) {
        let idx = index.split('_'),
            reviewIndex = parseInt(idx[0]),
            docIndex = parseInt(idx[1]),
            document = this.state.dataReview[reviewIndex].documents[docIndex],
            
            categoryIndex = event.target.value,

            updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            category: {
                                $set: this.state.categories[categoryIndex]
                            },
                            status: {
                                $set: 'valid'
                            }
                        }
                    }
                }
            }),

            updateStack = update(this.state.stackChange, {
                $set: {
                    [reviewIndex]: []
                }
            });
            
            updateStack[reviewIndex].push({
                id: docIndex,
                data: Object.assign({}, document)
            });
        this.setState({
            dataReview: updateData,
            stackChange: updateStack,
            current: {
                doc: docIndex,
                review: reviewIndex
            },
            shouldUpdate: true
        });
    },

    onChangeConfidentiality(event, index) {
        let idx = index.split('_'),
            reviewIndex = parseInt(idx[0]),
            docIndex = parseInt(idx[1]),
            document = this.state.dataReview[reviewIndex].documents[docIndex],

            confidentialityIndex = event.target.value,

            updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            confidentiality: {
                                $set: this.state.confidentialities[confidentialityIndex]
                            },
                            status: {
                                $set: 'valid'
                            }
                        }
                    }
                }
            }),

            updateStack = update(this.state.stackChange, {
                $set: {
                    [reviewIndex]: []
                }
            });
            
            updateStack[reviewIndex].push({
                id: docIndex,
                data: Object.assign({}, document)
            });
            debugger
        this.setState({
            dataReview: updateData,
            stackChange: updateStack,
            current: {
                doc: docIndex,
                review: reviewIndex
            },
            shouldUpdate: true
        });
    },

    handleCheckAll(event, index) {
        debugger
        let updateData = update(this.state.dataReview, {
            [index]: {
                documents: {
                    $apply: (data) => {
                        data = cloneDeep(data);
                        for(let i = data.length - 1; i >= 0; i--) {
                            data[i].checked = event.target.checked
                        }
                        return data;
                    }
                },

                checkedAll: {
                    $set: event.target.checked
                }
            }
        });
        debugger
        this.setState({ dataReview: updateData, shouldUpdate: true });
    },

    handleUndo(reviewIndex) {
        if(this.state.stackChange[reviewIndex].length > 0) {
            let { stackChange } = this.state,
                stackLength = stackChange[reviewIndex].length,
                item = stackChange[reviewIndex][stackLength - 1],

                updateData = update(this.state.dataReview, {
                    [reviewIndex]: {
                        documents: {
                            [item.id]: {
                                $set: item.data
                            }
                        }
                    }
                }),

                updateStack = update(stackChange, {
                    [reviewIndex]: {
                        $splice: [[stackLength - 1, 1]]
                    }
                });
                debugger
            this.setState({
                dataReview: updateData,
                stackChange: updateStack,
                current: {
                    doc: item.id,
                    review: reviewIndex
                },
                shouldUpdate: true
            });
        }
    },

    closePreview() {
        this.setState({ openPreview: false, shouldUpdate: true });
    },

    getClassificationReview() {
        let data = [
            {
                "urgency": "high",
                "language": "EN",
                "category": {
                    "id": 1,
                    "name": "accounting/tax"
                },
                "confidentiality": {
                    "id": 1,
                    "name": "public"
                },
                "documents": [
                    {
                        confidence_level: 87,
                        confidentiality_label: "yes/no",
                        creation_date: "2012-04-23",
                        image_url: "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                        legal_retention_until: "2012-04-23",
                        modification_date: "2012-04-23",
                        name: "IonaTechnologiesPlcG07.doc",
                        number_of_classification_challenge: 1,
                        owner: "owner_name",
                        path: "assets/orphan/01/IonaTechnologiesPlcG07.doc",
                        category: {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        confidentiality: {
                            id: 1, 
                            name: "Confidential"
                        }
                    }
                ]
            },
            {
                "urgency": "high",
                "language": "EN",
                "category": {
                    "id": 1,
                    "name": "accounting/tax"
                },
                "confidentiality": {
                    "id": 1,
                    "name": "public"
                },
                "documents": [
                    {
                        confidence_level: 87,
                        confidentiality_label: "yes/no",
                        creation_date: "2012-04-23",
                        image_url: "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                        legal_retention_until: "2012-04-23",
                        modification_date: "2012-04-23",
                        name: "IonaTechnologiesPlcG07.doc",
                        number_of_classification_challenge: 1,
                        owner: "owner_name",
                        path: "assets/orphan/01/IonaTechnologiesPlcG07.doc",
                        category: {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        confidentiality: {
                            id: 1, 
                            name: "Confidential"
                        }
                    }
                ]
            }
        ]
        // makeRequest({
        //     path: "api/classification_review/",
        //     success: (res) => {

        //     }
        // });

        for(let i = data.length - 1; i >= 0; i--) {
            data[i].validateNumber = 0;
            data[i].checkedNumber = 0;
            data[i].checkedAll = false;

            for(let j = data[i].documents.length - 1; j >= 0; j--) {
                data[i].documents[j].checked = false;
                data[i].documents[j].status = 'invalid';
            }
        }
        //debugger
        this.setState({ dataReview: data, shouldUpdate: true });


    },

    getCategories() {
        let arr = [];
        makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                this.setState({ categories: data, shouldUpdate: true });
            }
        });
    },

    getConfidentialities() {
        let arr = [];
        makeRequest({
            path: 'api/label/confidentiality/',
            success: (data) => {
                this.setState({ confidentialities: data, shouldUpdate: true });
            }
        });
    },

    render:template
});

module.exports = ClassificationReview;