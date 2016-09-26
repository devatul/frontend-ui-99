import React, { Component } from 'react'
import { render } from 'react-dom'
import template from './ClassificationReview.rt'
import update from 'react/lib/update'
import Constant from '../Constant.js'
import { cloneDeep, isEqual, find } from 'lodash'
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
            init: {
                categories: [],
                confidentialities: []
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
            if(documents[i].status === "accepted") {
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
                                data[i].status = 'accepted';
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
        //if(document.status === 'reject') {
            let updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            status: { $set: 'accepted' }
                        }
                    }
                }
            }),

            updateStack = this.state.stackChange[reviewIndex] ? 

            update(this.state.stackChange, {
                [reviewIndex]: {
                    $push: [{
                        id: docIndex,
                        data: document
                    }]
                }
            })
            :
            update(this.state.stackChange, {
                $set: {
                    [reviewIndex]: [{
                        id: docIndex,
                        data: document
                    }]
                }
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
        //}
    },

    handleTableRowOnChange(event, index) {
        debugger
        let { stackChange } = this.state,
            splitIndex = index.split('_'), reviewIndex = splitIndex[0], docIndex = splitIndex[1],
            document = this.state.dataReview[reviewIndex].documents[docIndex];

        let updateStack = [];

        if(stackChange[reviewIndex]) {
            updateStack = update(stackChange, {
                [reviewIndex]: {
                    $push: [{
                        id: docIndex,
                        data: document
                    }]
                }
            })
        } else {
            updateStack = update(stackChange, {
                $set: {
                    [reviewIndex]: [{
                        id: docIndex,
                        data: document
                    }]
                }
            });
        }

        this.setState({
            stackChange: updateStack
        });

        switch(event.target.id) {
            case 'checkbox': {
                this.onChangeCheckBox(event, reviewIndex, docIndex, document);
            }
            break;

            case 'selectCategory': {
                this.onChangeCategory(event, reviewIndex, docIndex, document);
            }
            break;

            case 'selectConfidentiality': {
                this.onChangeConfidentiality(event, reviewIndex, docIndex, document);
            }
        }
    },

    onChangeCheckBox(event, reviewIndex, docIndex, document) {
        debugger
        let updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            checked: { $set: event.target.checked }
                        }
                    }
                }
            });
            

        this.setState({
            dataReview: updateData,
            current: {
                doc: docIndex,
                review: reviewIndex
            },
            shouldUpdate: true
        });
    },

    onChangeCategory(event, reviewIndex, docIndex, document) {
        let categoryIndex = event.target.value,
            initCategory = find(this.state.init.categories, { id: reviewIndex + '_' + docIndex }),

            updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            category: {
                                $set: this.state.categories[categoryIndex]
                            },
                            status: {
                                $set: initCategory && isEqual(initCategory.data, this.state.categories[categoryIndex]) ? 'accepted' : 'editing'
                            }
                        }
                    }
                }
            });
        
        
        if(!initCategory) {
            let { categories } = this.state.init;
            categories.push({
                id: reviewIndex + '_' + docIndex,
                data: Object.assign({}, document.category)
            });
        }
        debugger
        this.setState({
            dataReview: updateData,
            current: {
                doc: docIndex,
                review: reviewIndex
            },
            shouldUpdate: true
        });
    },

    onChangeConfidentiality(event, reviewIndex, docIndex, document) {
        let confidentialityIndex = event.target.value,
            initConfidentiality = find(this.state.init.confidentialities, { id: reviewIndex + '_' + docIndex }),

            updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            confidentiality: {
                                $set: this.state.confidentialities[confidentialityIndex]
                            },
                            status: {
                                $set: initConfidentiality && isEqual(initConfidentiality.data, this.state.confidentialities[confidentialityIndex]) ? 'accepted' : 'editing'
                            }
                        }
                    }
                }
            });

        if(!initConfidentiality) {
            let { confidentialities } = this.state.init;
            debugger
            confidentialities.push({
                id: reviewIndex + '_' + docIndex,
                data: Object.assign({}, document.confidentiality)
            });
        }
            debugger
        this.setState({
            dataReview: updateData,
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

        let updateCurrent = update(this.state.current, {
            review: {
                $set: index
            }
        });
        debugger
        this.setState({ dataReview: updateData, current: updateCurrent, shouldUpdate: true });
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
                "language": {
                "id": 1,
                "short_name": "EN"
                },
                "category": {
                "id": 1,
                "name": "Accounting/Tax"
                },
                "confidentiality": {
                "id": 1,
                "name": "Banking Secrecy"
                },
                "documents": [
                {
                    "name": "doc_name.doc",
                    "path": "/doc_path/doc_name.doc",
                    "owner": "owner_name",
                    "confidence_level": 40,
                    "centroid_distance": 1.5,
                    "group_min_centroid_distance": 1.6,
                    "group_max_centroid_distance": 2,
                    "group_avg_centroid_distance": 42,
                    "image_url": "http://54.254.145.121/static/group/01/IonaTechnologiesPlcG07.doc",
                    "creation_date": "2012-04-23",
                    "modification_date": "2012-04-23",
                    "legal_retention_until": "2012-04-23",
                    "number_of_classification_challenge": 1,
                    "category": {
                    "id": 1,
                    "name": "Accounting/Tax"
                    },
                    "confidentiality": {
                    "id": 1,
                    "name": "Public"
                    }
                }
                ]
            },
            {
                "language": {
                "id": 1,
                "short_name": "FR"
                },
                "category": {
                "id": 1,
                "name": "Accounting/Tax"
                },
                "confidentiality": {
                "id": 1,
                "name": "Banking Secrecy"
                },
                "documents": [
                {
                    "name": "doc_name.doc",
                    "path": "/doc_path/doc_name.doc",
                    "owner": "owner_name",
                    "confidence_level": 40,
                    "centroid_distance": 1.5,
                    "group_min_centroid_distance": 1.6,
                    "group_max_centroid_distance": 2,
                    "group_avg_centroid_distance": 42,
                    "image_url": "http://54.254.145.121/static/group/01/IonaTechnologiesPlcG07.doc",
                    "creation_date": "2012-04-23",
                    "modification_date": "2012-04-23",
                    "number_of_classification_challenge": 1,
                    "legal_retention_until": "2012-04-23",
                    "category": {
                    "id": 1,
                    "name": "Accounting/Tax"
                    },
                    "confidentiality": {
                    "id": 1,
                    "name": "Public"
                    }
                }
                ]
            }
        ];
        let data1 = [
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
        makeRequest({
            path: "api/classification_review/",
            success: (res) => {
                debugger
            }
        });

        for(let i = data.length - 1; i >= 0; i--) {
            data[i].validateNumber = 0;
            data[i].checkedNumber = 0;
            data[i].checkedAll = false;

            for(let j = data[i].documents.length - 1; j >= 0; j--) {
                data[i].documents[j].checked = false;
                data[i].documents[j].status = 'reject';
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