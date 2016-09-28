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
import { isEqual, findIndex, find, cloneDeep } from 'lodash';

var ReviewValidation = React.createClass({
    displayName: 'ReviewValidation',

    statics: {
        challenge: "panel1",
        challengeBack: "panel2"
    },

    getInitialState() {
        return {
            categories: [],
            categoryCurrent: {},
            reviewers: {},
            reviewerCurrent: {},
            dataReview: {
                challenged_docs: 0,
                validation_progress: 0,
                challenge_docs: [],
                challenge_back_docs: []
            },
            confidentialities: [],
            categoriesReview: [],
            init: {
                categories: [],
                confidentialities: []
            },
            categoryProgress: 0,
            summary: [],
            currentIndex: {
                panel: 'name panel',
                docIndex: 0,
                documents: "challenge_docs",
                reviewer: "default",
                category: 0
            },
            bodyRequest: {
                reviewer_id: 0,
                category_id: 0,
                challenge_docs: [],
                challenge_back_docs: []
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
        }
        if(!isEqual(this.state.dataReview, prevState.dataReview)) {
            debugger
            this.reviewerProgress();
        }
    },

    getCategories() {
        makeRequest({
            path: "api/label/category/",
            success: (res) => {
                debugger
                let categoriesReview = cloneDeep(res);
                categoriesReview[res.length] = {
                    id: 'summary',
                    name: 'Summary'
                }

                let bodyRequest = update(this.state.bodyRequest, {
                    category_id: { 
                        $set: res[0].id 
                    }
                });

                this.setState({
                    categories: res,
                    categoriesReview: categoriesReview,
                    bodyRequest: bodyRequest,
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
        makeRequest({
            path: "api/review/reviewer_list/",
            params: {
                "id": this.state.categoryCurrent.id
            },
            success: (res) => {
                debugger
                let bodyRequest = update(this.state.bodyRequest, {
                        reviewer_id: {
                            $set: data.reviewers[0].id
                        }
                    });
                this.setState({
                    reviewers: res,
                    reviewerCurrent: res.reviewers[0],
                    bodyRequest: bodyRequest,
                    shouldUpdate: true
                });
            }
        });
        
        // this.setState({
        //     reviewers: data,
        //     reviewerCurrent: data.reviewers[0],
        //     bodyRequest: bodyRequest,
        //     shouldUpdate: true
        // });
    },

    setReviewerCurrent: function(event) {
        let setReviewer = update(this.state.reviewerCurrent, {
            $set: this.state.reviewers.reviewers[event.target.value]
        });
        this.setState({ reviewerCurrent: setReviewer, shouldUpdate: true });
    },

    setCategoryCurrent(categoryIndex) {
        debugger
        if(categoryIndex < this.state.categoriesReview.length) {
            let updateCurrent = update(this.state.currentIndex, {
                category: {
                    $set: categoryIndex
                }
            });

            this.setState({
                categoryCurrent: this.state.categoriesReview[categoryIndex],
                currentIndex: updateCurrent,
                shouldUpdate: true
            });
        }
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
        let current = (this.constructor.challenge === panel ? 'challenge_docs' : 'challenge_back_docs');

        if(docIndex <= (this.state.dataReview[current].length - 1)) {

            let document = this.state.dataReview[current][docIndex],

                updateCurrent = update(this.state.current, {
                    panel: {
                        $set: panel
                    },
                    docIndex: {
                        $set: docIndex
                    },
                    documents: {
                        $set: current
                    }
                });

            this.setState({
                openPreview: !this.state.openPreview,
                docPreview: document,
                currentIndex: updateCurrent,
                shouldUpdate: true
            });

        }
    },

    onClickValidationButton(panel, docIndex) {
        debugger
        let current = (this.constructor.challenge === panel ? 'challenge_docs' : 'challenge_back_docs'),

            document = this.state.dataReview[current][docIndex],

            indexDoc = findIndex(this.state.bodyRequest[current], { id: document.id }),

            updateData = update(this.state.dataReview, {
                [current]: {
                    [docIndex]: {
                        ['2nd_line_validation']: {
                            $set: 'accepted'
                        }
                    }
                }
            }),

            updateRequest = update(this.state.bodyRequest, {
                [current]: (indexDoc === -1) ? {
                    $push: [{
                        id: document.id,
                        name: document.name,
                        path: document.path,
                        owner: document.owner,
                        category: document.current_category,
                        confidentiality: document.current_confidentiality,
                        comment: document.comment
                    }]
                } : {
                    $splice: [[indexDoc, 1, {
                        id: document.id,
                        name: document.name,
                        path: document.path,
                        owner: document.owner,
                        category: document.current_category,
                        confidentiality: document.current_confidentiality,
                        comment: document.comments
                    }]]
                }
            }),

            updateStack = update(this.state.stackChange, {
                $push: [{
                    id: panel + '_' + docIndex,
                    data: document
                }]
            });
            debugger
        this.setState({ dataReview: updateData, bodyRequest: updateRequest, stackChange: updateStack, shouldUpdate: true });
    },

    handleTableRowOnChange(event, index) {
        let idx = index.split('_'),
            panel = idx[0],
            docIndex = idx[1],
            current = (panel === this.constructor.challenge ? 'challenge_docs' : 'challenge_back_docs'),
            { stackChange } = this.state;

            stackChange.push({
                    id: panel + '_' + docIndex,
                    data: this.state.dataReview[current][docIndex]
                });
                debugger
        switch(event.target.id) {
            case 'SelectCategory':
                this.onChangeCategory(panel, docIndex, event.target.value);
                break;
            case 'SelectConfidentiality':
                this.onChangeConfidentiality(panel, docIndex, event.target.value);
                break;
            case "CommentBox":
                this.onChangeComment(current, docIndex, event.target.value);
        }

    },

    onChangeComment(current, docIndex, value) {
        let updateComment = update(this.state.dataReview, {
            [current]: {
                [docIndex]: {
                    comments: { $set: value },

                    ['2nd_line_validation']: {
                        $set: 'editing'
                    }
                }
            }
        });
        debugger
        this.setState({ dataReview: updateComment, shouldUpdate: true });
    },

    onChangeCategory(panel, docIndex, categoryIndex) {
        let current = (this.constructor.challenge === panel ? "challenge_docs" : "challenge_back_docs"),
            document = this.state.dataReview[current][docIndex],
            { categories, init } = this.state,
            initCategory = find(init.categories, { id: panel + '_' + docIndex }),

            updateData = update(this.state.dataReview, {
                [current]: {
                    [docIndex]: {
                        current_category: {
                            $set: this.state.categories[categoryIndex]
                        },
                        ['2nd_line_validation']: {
                            $set: initCategory && isEqual(initCategory.data, categories[categoryIndex]) ? 'accepted' : 'editing'
                        }
                    }
                }
            });
            debugger
        if(!initCategory) {
            let { categories } = this.state.init;
            debugger
            categories.push({
                id: panel + '_' + docIndex,
                data: Object.assign({}, document.current_category)
            });
        }
        this.setState({ dataReview: updateData, shouldUpdate: true });
    },

    onChangeConfidentiality(panel, docIndex, confidentialityIndex) {
        let current = (this.constructor.challenge === panel ? "challenge_docs" : "challenge_back_docs"),
            document = this.state.dataReview[current][docIndex],
            { confidentialities, init } = this.state,
            initConfidentiality = find(init.confidentialities, { id: panel + '_' + docIndex }),

            updateData = update(this.state.dataReview, {
                [current]: {
                    [docIndex]: {
                        current_confidentiality: {
                            $set: confidentialities[confidentialityIndex]
                        },
                        ['2nd_line_validation']: {
                            $set: initConfidentiality && isEqual(initConfidentiality.data, confidentialities[confidentialityIndex]) ? 'accepted' : 'editing'
                        }
                    }
                }
            });

            if(!initConfidentiality) {
                let { confidentialities } = this.state.init;
                debugger
                confidentialities.push({
                    id: panel + '_' + docIndex,
                    data: Object.assign({}, document.current_confidentiality)
                });
            }
        this.setState({ dataReview: updateData, shouldUpdate: true });
    },

    handleNextDocument() {

        let { docIndex, panel } = this.state.current,
            current = (this.constructor.challenge === panel ? "challenge_docs" : "challenge_back_docs");
            docIndex = parseInt(docIndex);
        debugger
        if(doc < this.state.dataReview[current].length - 1) {

            let updateCurrent = update(this.state.current, {
                panel: {
                    $set: panel
                },
                doc: {
                    $set: docIndex + 1
                }
            });

            this.setState({ currentIndex: updateCurrent, shouldUpdate: true });
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
                "challenged_docs": 4,
                "validation_progress": 55,
                "challenge_docs": [
                    {
                    "id": 1,
                    "sla_percent": 60,
                    "name": "IonaTechnologiesPlcG07.doc",
                    "owner": "owner_name",
                    "path": "assets/orphan/01/IonaTechnologiesPlcG07.doc",
                    "creation_date": "2012-04-23",
                    "image_url": "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                    "legal_retention_until": "2012-04-23",
                    "modification_date": "2012-04-23",
                    "comments": "",
                    "number_of_classification_challenge": 1,
                    "current_category": {
                        "id": 1,
                        "name": "Accounting/Tax"
                    },
                    "previous_category": {
                        "id": 1,
                        "name": "Accounting/Tax"
                    },
                    "current_confidentiality": {
                        "id": 1,
                        "name": "Confidential"
                    },
                    "previous_confidentiality": {
                        "id": 1,
                        "name": "public"
                    }
                    }
                ],
                "challenge_back_docs": [
                    {
                    "id": 1,
                    "sla_percent": 60,
                    "name": "IonaTechnologiesPlcG07.doc",
                    "owner": "owner_name",
                    "path": "assets/orphan/01/IonaTechnologiesPlcG07.doc",
                    "reviewer_comment": "this is the comment",
                    "creation_date": "2012-04-23",
                    "image_url": "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                    "legal_retention_until": "2012-04-23",
                    "modification_date": "2012-04-23",
                    "number_of_classification_challenge": 1,
                    "current_category": {
                        "id": 1,
                        "name": "Accounting/Tax"
                    },
                    "previous_category": {
                        "id": 1,
                        "name": "Accounting/Tax"
                    },
                    "current_confidentiality": {
                        "id": 1,
                        "name": "Confidential"
                    },
                    "previous_confidentiality": {
                        "id": 1,
                        "name": "Confidential"
                    }
                    }
                ]
            };

        makeRequest({
            path: "api/review/review_validation/",
            params: {
                'category_id': this.state.categoryCurrent.id,
                'reviewer_id': this.state.reviewerCurrent.id
            },
            success: (res) => {
                debugger
                // this.setState({
                //     dataReview: res
                // });
            }
        });

        this.setState({
            dataReview: data,
            shouldUpdate: true
        });
    },

    handleUndo() {
        debugger
        let { stackChange } = this.state,
            stackLength = stackChange.length - 1;
        if(stackLength >= 0) {
            let item = stackChange[stackLength],
                index = item.id.split('_'),
                current = (index[0] === this.constructor.challenge ? "challenge_docs" : "challenge_back_docs"),
            
            updateData = update(this.state.dataReview, {
                [current]: {
                    [index[1]]: {
                        $set: item.data
                    }
                }
            }),

            updateStack = update(this.state.stackChange, {
                $splice: [[stackLength, 1]]
            });

            this.setState({ dataReview: updateData, stackChange: updateStack, shouldUpdate: true });
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
            { challenge_docs, challenge_back_docs } = this.state.dataReview,
            challengeLength = challenge_docs.length, challengeBackLength = challenge_back_docs.length;

        for(let i = challengeLength - 1; i >= 0; i--) {
            if(challenge_docs[i]["2nd_line_validation"] === "accepted" || challenge_docs[i]["2nd_line_validation"] === "editing") {
                num++;
            }
        }

        for(let i = challengeBackLength - 1; i >= 0; i--) {
            if(challenge_back_docs[i]["2nd_line_validation"] === "accepted" || challenge_back_docs[i]["2nd_line_validation"] === "editing") {
                num++;
            }
        }

        updateData = update(this.state.dataReview, {
            validation_progress: {
                $set: Math.round((num * 100) / (challengeLength + challengeBackLength))
            },
            challenged_docs: {
                $set: num
            }
        });
        debugger
        this.setState({
            dataReview: updateData,
            shouldUpdate: true
        });
    },

    validateDocuments() {

        makeRequest({
            method: 'PUT',
            path: "api/review/review_validation/",
            params: JSON.stringify(this.state.bodyRequest),
            success: (res) => {
                debugger
            }
        });
    },
    
    handleNextReviewer() {
        let { currentIndex } = this.state,
            { total_reviewers } = this.state.reviewers,
            indexReviewer = currentIndex.reviewer == 'default' ? 0 : parseInt(currentIndex.reviewer);
        debugger

        this.validateDocuments();

        let updateCurrent = update(currentIndex, {
                reviewer: {
                    $set: (indexReviewer + 1) < total_reviewers ? indexReviewer + 1 : 0
                }
            });
            
        this.setState({ currentIndex: updateCurrent, shouldUpdate: true });
    },
    getSummary() {
        // let data = [
        //     {
        //         "id": 1,
        //         "name": "accounting/tax",
        //         "total_challenged_docs": 20,
        //         "number_of_assigned": 2,
        //         "total_classified_docs": 70,
        //         "reviewers": [
        //             {
        //                 "id": 1,
        //                 "first_name": "chris",
        //                 "last_name": "muffat",
        //                 "number_challenged_docs": 10,
        //                 "number_classified_docs": 50
        //             },
        //             {
        //                 "id": 1,
        //                 "first_name": "tony",
        //                 "last_name": "gomez",
        //                 "number_challenged_docs": 10,
        //                 "number_classified_docs": 20
        //             }
        //         ]
        //     },
        //     {
        //         "id": 1,
        //         "name": "corporate entity",
        //         "total_challenged_docs": 20,
        //         "number_of_assigned": 2,
        //         "total_classified_docs": 40,
        //         "reviewers": [
        //             {
        //                 "id": 1,
        //                 "first_name": "chris",
        //                 "last_name": "muffat",
        //                 "number_challenged_docs": 10,
        //                 "number_classified_docs": 20,
        //                 "type": "last_modifier"
        //             },
        //             {
        //                 "id": 1,
        //                 "first_name": "tony",
        //                 "last_name": "gomez",
        //                 "number_challenged_docs": 10,
        //                 "number_classified_docs": 20,
        //                 "type": "last_modifier"
        //             }
        //         ]
        //     }
        // ];
        makeRequest({
            path: "api/review/review_validation/summary/",
            success: (res) => {
                debugger
                this.setState({ summary: res, shouldUpdate: true });
            }
        });
        //this.setState({ summary: data, shouldUpdate: true });
    },
    confirmValidation() {
        makeRequest({
            path: "api/review/review_validation/confirm/",
            method: 'POST',
            success: (res) => {
                debugger
            }
        });
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