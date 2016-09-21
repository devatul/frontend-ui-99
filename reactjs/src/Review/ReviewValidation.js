import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ReviewValidation.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react/lib/update'
import { makeRequest } from '../utils/http'
//import javascript from '../script/javascript.js';
import Constant from '../Constant.js';
import 'jquery'
//import javascriptTodo from '../script/javascript.todo.js'
import loadScript from '../script/load.scripts.js';
import { isEqual } from 'lodash';

var ReviewValidation = React.createClass({
    displayName: 'ReviewValidation',

    statics: {
        challenge: "panel1",
        challengeBack: "panel2"
    },

    getInitialState() {
        return {
            confidentialities: [],
            categories: [],
            categoryCurrent: {},
            reviewers: {},
            reviewerCurrent: {},
            dataReview: {
                totalValid: 0,
                documents: []
            },
            backReview: {
                totalValid: 0,
                documents: []
            },
            reviewerProgress: 0,
            categoryProgress: 0,
            summary: [],
            current: {
                panel: 'name panel',
                doc: 0,
                reviewer: "default",
                category: 0
            },
            stackChange: [],
            openPreview: false,
            shouldUpdate: false
        };
    },
    
    componentDidMount() {
        //console.log("sfdssss", this.state.categories);
        this.getCategories();
        this.getConfidentialities();
    },
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.shouldUpdate;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.shouldUpdate === true) {
            this.setState({ shouldUpdate: false });
        }

        if(this.state.categoryCurrent != prevState.categoryCurrent) {
            if(this.state.categoryCurrent.id === "summary") {
                this.getSummary();
            } else {
                this.getReviewers();
            }
        }
        if(this.state.reviewerCurrent != prevState.reviewerCurrent) {
            debugger
            this.getReviewValidation();
            this.getChallengedBackReview();
        }
        if(!isEqual(this.state.dataReview.documents, prevState.dataReview.documents)) {
            debugger
            this.reviewerProgress();
        }
    },

    getCategories() {
        makeRequest({
            path: "api/label/category/",
            success: (res) => {
                debugger
                res[res.length] = {
                    id: 'summary',
                    name: 'Summary'
                }

                this.setState({
                    categories: res,
                    categoryCurrent: res[0],
                    shouldUpdate: true
                });
            } 
        });
    },

    getConfidentialities() {
        makeRequest({
            path: "api/label/confidentiality/",
            success: (res) => {

                this.setState({
                    confidentialities: res,
                    shouldUpdate: true
                });
            }
        });
    },

    getReviewers() {
        var data = {
                "total_reviewers": 2,
                "reviewers": [
                    {
                    "id": 1,
                    "first_name": "John",
                    "last_name": "McClane",
                    "type": "last_modifier"
                    },
                    {
                    "id": 2,
                    "first_name": "Al",
                    "last_name": "Molinaro",
                    "type": "last_modifier"
                    }
                ]
            };
        // makeRequest({
        //     path: "api/review/reviewer_list",
        //     params: {
        //         "id": this.state.categoryCurrent.id
        //     },
        //     success: (res) => {
        //         this.setState({
        //             reviewers: data,
        //             reviewerCurrent: data.reviewers[0],
        //             shouldUpdate: true
        //         });
        //     }
        // });
        
        this.setState({
            reviewers: data,
            reviewerCurrent: data.reviewers[0],
            shouldUpdate: true
        });
    },

    setReviewerCurrent: function(event) {
        let setReviewer = update(this.state.reviewerCurrent, {
            $set: this.state.reviewers.reviewers[event.target.value]
        });
        this.setState({ reviewerCurrent: setReviewer, shouldUpdate: true });
    },

    setCategoryCurrent(categoryIndex) {
        debugger
        if(categoryIndex < this.state.categories.length) {
            let updateCurrent = update(this.state.current, {
                category: {
                    $set: categoryIndex
                }
            });

            this.setState({
                categoryCurrent: this.state.categories[categoryIndex],
                current: updateCurrent,
                shouldUpdate: true
            });
        }
    },

    getChallengedBackReview(reviewId) {

        let reviewerId = this.state.reviewerCurrent.id,
            categoryId = this.state.categoryCurrent.id,

            data = {
                "id": "assignment_id",
                "category": "accounting/tax",
                "challenged_docs": 4,
                "validation_progress": 55,
                "documents": [
                    {
                        "sla_percent": 60,
                        "name": "IonaTechnologiesPlcG07.doc",
                        "owner": "owner_name",
                        "current_category": {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        "previous_category": {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        "current_confidentiality": {
                            id: 1, 
                            name: "Confidential"
                        },
                        "previous_confidentiality": {
                            id: 1, 
                            name: "Confidential"
                        },
                        "2nd_line_comment": "2nd line comment",
                        "2nd_line_validation": "accept",
                        confidentiality_label: "yes/no",
                        creation_date: "2012-04-23",
                        image_url: "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                        legal_retention_until: "2012-04-23",
                        modification_date: "2012-04-23",
                        number_of_classification_challenge: 1,
                        path: "assets/orphan/01/IonaTechnologiesPlcG07.doc"
                    },
                    {
                        "sla_percent": 60,
                        "name": "IonaTechnologiesPlcG07.doc",
                        "owner": "owner_name",
                        "current_category": {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        "previous_category": {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        "current_confidentiality": {
                            id: 1, 
                            name: "Confidential"
                        },
                        "previous_confidentiality": {
                            id: 1, 
                            name: "Confidential"
                        },
                        "2nd_line_comment": "2nd line comment",
                        "2nd_line_validation": "accept",
                        confidentiality_label: "yes/no",
                        creation_date: "2012-04-23",
                        image_url: "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                        legal_retention_until: "2012-04-23",
                        modification_date: "2012-04-23",
                        number_of_classification_challenge: 1,
                        path: "assets/orphan/01/IonaTechnologiesPlcG07.doc"
                    }
                ]
            };
        this.setState({
            backReview: data,
            shouldUpdate: true
        });

        // $.ajax({
        //     method: 'GET',
        //     url: Constant.SERVER_API + "api/review/challenged_docs/",
        //     dataType: 'json',
        //     async: false,
        //     data: {"id": reviewId},
        //     beforeSend: function(xhr) {
        //         xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
        //     },
        //     success: function(data) {
        //         var updateState = update(this.state, {
        //             challenged_docs: {$set: data},
        //         });
        //         this.setState(updateState);
        //         console.log("reviewers ok: ", data);

        //     }.bind(this),
        //     error: function(xhr,error) {
        //         console.log("reviewers error: " + error);
        //         if(xhr.status === 401)
        //         {
        //             browserHistory.push('/Account/SignIn');
        //         }
        //     }.bind(this)
        // });

    },
    setChallengedDoc() {
        for(var i = 0; i < this.state.challengedDocs.length; i++) {
            if(this.state.challengedDocs[i].id == this.state.reviewerCurrent.id) {
                var updateState = update(this.state, {
                    challengedDocCurrent: { $set: this.state.challengedDocs[i] }
                });
                this.setState(updateState);
            }
        }
    },

    handleTableRowOnClick(event, index) {
        let idx = index.split('_'),
            panel = idx[0],
            docIndex = idx[1];
        switch(event.currentTarget.id) {
            case 'documentName':
                this.onClickDocumentName(panel, docIndex);
                break;
            case 'validationButton':
                this.onClickValidationButton(panel, docIndex);
        }
    },

    onClickDocumentName(panel, docIndex) {
        let current = (this.constructor.challenge === panel ? 'dataReview' : 'backReview');

        if(docIndex <= (this.state[current].documents.length - 1)) {

            let document = this.state[current].documents[docIndex],

                updateCurrent = update(this.state.current, {
                    panel: {
                        $set: panel
                    },
                    doc: {
                        $set: docIndex
                    }
                });

            this.setState({
                openPreview: !this.state.openPreview,
                docPreview: document,
                current: updateCurrent,
                shouldUpdate: true
            });

        }
    },

    onClickValidationButton(panel, docIndex) {
        debugger
        let current = (this.constructor.challenge === panel ? "dataReview" : "backReview"),

            updateData = update(this.state[current], {
                documents: {
                    [docIndex]: {
                        ['2nd_line_validation']: {
                            $set: 'accepted'
                        }
                    }
                }
            }),

            updateStack = update(this.state.stackChange, {
                $push: [{
                    id: panel + '_' + docIndex,
                    data: this.state[current].documents[docIndex]
                }]
            });
        
        this.setState({ [current]: updateData, stackChange: updateStack, shouldUpdate: true });
    },

    handleTableRowOnChange(event, index) {
        let idx = index.split('_'),
            panel = idx[0],
            docIndex = idx[1],
            current = (panel === constructor.challenge ? 'dataReview' : 'backReview'),

            updateStack = update(this.state.stackChange, {
                $push: [{
                    id: panel + '_' + docIndex,
                    data: this.state[current].documents[docIndex]
                }]
            });
        this.setState({ stackChange: updateStack });

        switch(event.target.id) {
            case 'SelectCategory':
                this.onChangeCategory(panel, docIndex, event.target.value);
                break;
            case 'SelectConfidentiality':
                this.onChangeConfidentiality(panel, docIndex, event.target.value);
        }

    },

    onChangeCategory(panel, docIndex, categoryIndex) {
        let current = (this.constructor.challenge === panel ? "dataReview" : "backReview"),
            document = this.state[current].documents[docIndex],

            updateData = update(this.state[current], {
                documents: {
                    [docIndex]: {
                        current_category: {
                            $set: this.state.categories[categoryIndex]
                        },
                        previous_category: {
                            $set: document.current_category
                        },
                        ['2nd_line_validation']: {
                            $set: 'editing'
                        }
                    }
                }
            });
        this.setState({ [current]: updateData, shouldUpdate: true });
    },

    onChangeConfidentiality(panel, docIndex, confidentialityIndex) {
        let current = (this.constructor.challenge === panel ? "dataReview" : "backReview"),
            document = this.state[current].documents[docIndex],

            updateData = update(this.state[current], {
                documents: {
                    [docIndex]: {
                        current_confidentiality: {
                            $set: this.state.confidentialities[confidentialityIndex]
                        },
                        previous_confidentiality: {
                            $set: document.current_confidentiality
                        },
                        ['2nd_line_validation']: {
                            $set: 'editing'
                        }
                    }
                }
            });
        this.setState({ [current]: updateData, shouldUpdate: true });
    },

    handleNextDocument() {

        let { doc, panel } = this.state.current,
            current = (this.constructor.challenge === panel ? 'dataReview' : 'backReview');
            doc = parseInt(doc);
        debugger
        if(doc < this.state[current].documents.length - 1) {

            let updateCurrent = update(this.state.current, {
                panel: {
                    $set: panel
                },
                doc: {
                    $set: doc + 1
                }
            });

            this.setState({ current: updateCurrent, shouldUpdate: true });
        }
    },

    closePreview() {
        this.setState({
            openPreview: !this.state.openPreview,
            shouldUpdate: true
        });
    },

    getReviewValidation() {
        let reviewerId = this.state.reviewerCurrent.id,
            categoryId = this.state.categoryCurrent.id,

            data = {
                "id": "assignment_id",
                "category": "accounting/tax",
                "challenged_docs": 4,
                "validation_progress": 55,
                "documents": [
                    {
                        "sla_percent": 60,
                        "name": "IonaTechnologiesPlcG07.doc",
                        "owner": "owner_name",
                        "current_category": {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        "previous_category": {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        "current_confidentiality": {
                            id: 1, 
                            name: "Confidential"
                        },
                        "previous_confidentiality": {
                            id: 1, 
                            name: "Confidential"
                        },
                        "2nd_line_comment": "2nd line comment",
                        "2nd_line_validation": "accept",
                        confidentiality_label: "yes/no",
                        creation_date: "2012-04-23",
                        image_url: "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                        legal_retention_until: "2012-04-23",
                        modification_date: "2012-04-23",
                        number_of_classification_challenge: 1,
                        path: "assets/orphan/01/IonaTechnologiesPlcG07.doc"
                    },
                    {
                        "sla_percent": 60,
                        "name": "IonaTechnologiesPlcG07.doc",
                        "owner": "owner_name",
                        "current_category": {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        "previous_category": {
                            id: 1,
                            name: "Accounting/Tax"
                        },
                        "current_confidentiality": {
                            id: 1, 
                            name: "Confidential"
                        },
                        "previous_confidentiality": {
                            id: 1, 
                            name: "Confidential"
                        },
                        "2nd_line_comment": "2nd line comment",
                        "2nd_line_validation": "accept",
                        confidentiality_label: "yes/no",
                        creation_date: "2012-04-23",
                        image_url: "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG0722.doc",
                        legal_retention_until: "2012-04-23",
                        modification_date: "2012-04-23",
                        number_of_classification_challenge: 1,
                        path: "assets/orphan/01/IonaTechnologiesPlcG07.doc"
                    }
                ]
            };

        data.totalValid = 0;
        
        this.setState({
            dataReview: data,
            shouldUpdate: true
        });

        // makeRequest({
        //     path: "api/review/review_validation/",
        //     params: {
        //         "category_id": 5,
        //         "reviewer_id": 2
        //     },
        //     success: (res) => {
        //         this.setState({
        //             dataReview: res
        //         });
        //     }
        // });
    },

    handleUndo() {
        debugger
        let { stackChange } = this.state,
            stackLength = stackChange.length - 1;
        if(stackLength >= 0) {
            let item = stackChange[stackLength],
                index = item.id.split('_'),
                current = (index[0] === this.constructor.challenge ? "dataReview" : "backReview"),
            
            updateData = update(this.state[current], {
                documents: {
                    [index[1]]: {
                        $set: item.data
                    }
                }
            }),

            updateStack = update(this.state.stackChange, {
                $splice: [[stackLength, 1]]
            });

            this.setState({ [current]: updateData, stackChange: updateStack, shouldUpdate: true });
        }
    },

    validateCategory: function() {
        var categoryId = this.state.categoryCurrent.id;
        var reviewerId = this.state.reviewerCurrent.id;
        var categories = this.state.categories;
        var reviewValidations = this.state.reviewValidations;
        var validCategory = 0;
        for(var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].Id[0] == categoryId) {
                validCategory += reviewValidations[i].totalValidate;
            }
        }

        for (var i = 0; i < categories.length; i++) {
            if(categories[i].id == categoryId) {
                categories[i].totalValidate = validCategory;
            }
        }
        this.setState(update(this.state, {
            categories: {$set: categories }
        }));
        this.setState({shouldUpdate: { name: 'validateCategory',  categoryId:  categoryId, reviewerId: reviewerId, Number: validCategory}});
    },

    reviewerProgress() {
        let num = 0,
            updateData = {},
            { documents } = this.state.dataReview;

        for(let i = documents.length - 1; i >= 0; i--) {
            if(documents[i]["2nd_line_validation"] === "accepted" || documents[i]["2nd_line_validation"] === "editing") {
                num++;
            }
        }

        updateData = update(this.state.dataReview, {
            totalValid: {
                $set: num
            }
        });

        this.setState({
            dataReview: updateData,
            reviewerProgress: Math.round((num * 100) / documents.length),
            categoryProgress: Math.round((num * 100) / (this.state.reviewers.reviewers.length * documents.length)) + this.state.categoryProgress,
            shouldUpdate: true
        });
    },
    
    handleNextReviewer() {
        let { current } = this.state,
            indexReviewer = current.reviewer == 'default' ? 0 : parseInt(current.reviewer);
        debugger
        if(indexReviewer < this.state.reviewers.total_reviewers) {
            let { current } = this.state,
                updateCurrent = update(current, {
                    reviewer: {
                        $set: (indexReviewer + 1)
                    }
                });
                
            this.setState({ current: updateCurrent, shouldUpdate: true });
        }
    },
    getSummary() {
        let data = [
            {
                "id": 1,
                "name": "accounting/tax",
                "total_challenged_docs": 20,
                "number_of_assigned": 2,
                "total_classified_docs": 70,
                "reviewers": [
                    {
                        "id": 1,
                        "first_name": "chris",
                        "last_name": "muffat",
                        "number_challenged_docs": 10,
                        "number_classified_docs": 50
                    },
                    {
                        "id": 1,
                        "first_name": "tony",
                        "last_name": "gomez",
                        "number_challenged_docs": 10,
                        "number_classified_docs": 20
                    }
                ]
            },
            {
                "id": 1,
                "name": "corporate entity",
                "total_challenged_docs": 20,
                "number_of_assigned": 2,
                "total_classified_docs": 40,
                "reviewers": [
                    {
                        "id": 1,
                        "first_name": "chris",
                        "last_name": "muffat",
                        "number_challenged_docs": 10,
                        "number_classified_docs": 20,
                        "type": "last_modifier"
                    },
                    {
                        "id": 1,
                        "first_name": "tony",
                        "last_name": "gomez",
                        "number_challenged_docs": 10,
                        "number_classified_docs": 20,
                        "type": "last_modifier"
                    }
                ]
            }
        ];
        // makeRequest({
        //     path: "api/review/review_validation/summary/",
        //     success: (res) => {
        //         this.setState({ summary: res });
        //     }
        // });
        this.setState({ summary: data, shouldUpdate: true });
    },

    progressSummary(category, reviewer) {
        return Math.round((reviewer.number_classified_docs * 100) / category.total_classified_docs);
    },

    endReviewHandle: function() {
        browserHistory.push('/Dashboard/OverView');
    },
    render:template
});

module.exports = ReviewValidation;