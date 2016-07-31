import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ReviewValidation.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import javascript from '../script/javascript.js';
import Constant from '../Constant.js';
import 'jquery'
import javascriptTodo from '../script/javascript.todo.js'
import loadScript from '../script/load.scripts.js';
import _ from 'lodash';
//import elementUndo from '../script/elementUndo.js'

var ReviewValidation = React.createClass({
    displayName: 'ReviewValidation',
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            categories: [],
            confidentiality: [],
            categoryCurrent: null,
            reviewers: [],
            reviewerCurrent: null,
            reviewValidations: [],
            reviewCurrent: null,
            reviewValidCurrent: null,
            challengedDocs: [],
            challengedDocCurrent: null,
            summary: [],
            documentPreview: null,
            stackChange: [],
            shouldUpdate: null
        };
    },
    componentWillMount() {
        this.getCategories();
    },
    componentDidMount() {
        console.log("sfdssss", this.state.categories);
        this.getReviewers();
        this.getConfidentiality();
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.categoryCurrent != nextState.categoryCurrent) {
            return true;
        }
        if(this.state.reviewers != nextState.reviewers) {
            return true;
        }
        if(this.state.reviewerCurrent != nextState.reviewerCurrent) {
            return true;
        }
        if(this.state.reviewValidations != nextState.reviewValidations) {
            return true;
        }
        if(this.state.reviewCurrent != nextState.reviewCurrent) {
            return true;
        }
        if(this.state.documentPreview != nextState.documentPreview) {
            return true;
        }
        if(this.state.shouldUpdate != nextState.shouldUpdate) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.categoryCurrent != prevState.categoryCurrent) {
            this.getReviewers();
        }
        if(this.state.reviewerCurrent != prevState.reviewerCurrent) { 
            this.getReviewValidation();
        }
        if(this.state.reviewCurrent != prevState.reviewCurrent) {
            //return true;
        }
        if(this.state.documentPreview != prevState.documentPreview) {
            loadScript("/assets/vendor/gdocsviewer/jquery.gdocsviewer.min.js", function() {
                $('#previewModal').on('show.bs.modal', function(e) {

                    //get data-id attribute of the clicked element
                    var fileURL = $(e.relatedTarget).attr('data-file-url');

                    console.log(fileURL);
                    
                    $('#previewModal .file-preview').html('<a href="'+fileURL+'" id="embedURL"></a>');
                    $('#embedURL').gdocsViewer();
                });
            }.bind(this));
        }
        if(this.state.shouldUpdate != prevState.shouldUpdate) {
            
        }
    },
    getCategories() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/category/",
            dataType: 'json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                for(var i = 0; i < data.length; i++) {
                    data[i].totalValidate = 0;
                }
                var updateState = update(this.state, {
                    categories: {$set: data},
                    categoryCurrent: {$set: data[0] }
                });
                this.setState(updateState);
                console.log("categories ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("categories error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getConfidentiality: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/confidentiality/",
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                data.reverse();
                this.setState(update(this.state, {
                    confidentiality: {$set: data}
                }));
            }.bind(this),
            error: function(xhr, error) {
              if(xhr.status == 401) {
                browserHistory.push('/Account/SignIn');
              }
            }.bind(this)
        });
    },
    getReviewers() {
        /*$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/reviewer/",
            dataType: 'json',
            async: false,
            data: {"id": this.state.categoryCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    reviewers: {$set: data}
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });*/
        var data = [{
                id: 1,
                first_name: "chiris",
                last_name: "quyen"
            },
            {
                id: 2,
                first_name: "chiris1",
                last_name: "quyen2"
            },
            {
                id: 3,
                first_name: "chiris",
                last_name: "quyen"
            }];
        var updateState = update(this.state, {
            reviewers: {$set: data },
            reviewerCurrent: {$set: data[0] }
        });
        this.setState(updateState);
    },
    setReviewerCurrent: function(reviewerIndex) {
        var reviewers = this.state.reviewers;
        var setReviewer = update(this.state, {
            reviewerCurrent: { $set: this.state.reviewers[reviewerIndex]}
        });
        this.setState(setReviewer);
    },
    setCategoryCurrent: function(categoryIndex) {
        var setCategory = update(this.state, {
            categoryCurrent: { $set: this.state.categories[categoryIndex] }
        });
        this.setState(setCategory);
    },
    getChallengedDoc(reviewId) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/challenged_docs/",
            dataType: 'json',
            async: false,
            data: {"id": reviewId},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    challenged_docs: {$set: data},
                });
                this.setState(updateState);
                console.log("reviewers ok: ", data);

            }.bind(this),
            error: function(xhr,error) {
                console.log("reviewers error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });

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
    getReviewValidation() {
        var reviewerId = this.state.reviewerCurrent.id;
        var categoryId = this.state.categoryCurrent.id;
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/review_validation/",
            dataType: 'json',
            async: true,
            data: {
                "category_id": 5,
                "reviewer_id": 2
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                console.log(data);
                var check = 0;
                var reviewValidations = this.state.reviewValidations;
                for(var i = 0; i < reviewValidations.length; i++) {
                    if(reviewValidations[i].categoryId == categoryId && reviewValidations[i].reviewerId == reviewerId) {
                        check++;
                    }
                }
                for (var i = 0; i < data[1].documents.length; i++) {
                    data[1].documents[i]['2nd_line_validation'] = "normal";
                    data[1].documents[i].current_category = 0;
                    data[1].documents[i].current_confidentiality = 0;
                    data[1].documents[i].previous_category = null;
                    data[1].documents[i].previous_confidentiality = null;
                }
                if(check === 0) {
                    var reviewCurrent = {
                        reviewerId: reviewerId,
                        categoryId: categoryId,
                        documents: $.extend(true, {}, data[1].documents),
                        totalValidate: 0
                    };
                    reviewValidations.push(reviewCurrent);
                    var updateState = update(this.state, {
                        reviewValidations: {$set: reviewValidations },
                        reviewCurrent: {$set: reviewCurrent }
                    });
                } else {
                    var updateState = update(this.state, {
                        reviewValidations: {$set: reviewValidations },
                        reviewCurrent: {$set: reviewValidations[check - 1]}
                    });
                }
                this.setState(updateState);
                console.log("reviewValidations ok: ", reviewValidations[0].documents.length);
            }.bind(this),
            error: function(xhr,error) {
                console.log("reviewers error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });

    },
    size: function(obj) {
        return _.size(obj);
    },
    onChangeCategory: function(event, categoryId, reviewerId, docIndex) {
        var categoryIndex = event.target.value;
        var reviewValidations = this.state.reviewValidations;
        var indexValid = null;
        for (var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].categoryId == categoryId && reviewValidations[i].reviewerId) {
                indexValid = i;
            }
        }
        var saveDocument = $.extend(true, {}, reviewValidations[indexValid].documents[docIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: { categoryId: categoryId, reviewerId: reviewerId, docIndex: docIndex },
            contents: saveDocument
        });
        if(reviewValidations[indexValid].documents[docIndex].previous_category == null) {
            reviewValidations[indexValid].documents[docIndex].previous_category = reviewValidations[indexValid].documents[docIndex].current_category;
        }
        if(reviewValidations[indexValid].documents[docIndex].previous_category == categoryIndex){
            reviewValidations[indexValid].documents[docIndex].previous_category = null;
            reviewValidations[indexValid].documents[docIndex]['2nd_line_validation'] = "accepted";
            reviewValidations[indexValid].documents[docIndex].status = "accepted";
        } else {
            reviewValidations[indexValid].documents[docIndex]['2nd_line_validation'] = "editing";
            reviewValidations[indexValid].documents[docIndex].status = "editing";
        }
        reviewValidations[indexValid].documents[docIndex].current_category = categoryIndex;
        this.setState(update(this.state,{
            stackChange: {$set: stackList },
            reviewValidations: {$set: reviewValidations }
        }));
        this.setState({shouldUpdate: {name: 'updateCategory', categoryId:categoryId, reviewerId: reviewerId, docIndex: docIndex, categoryIndex: categoryIndex}});
    },
    onChangeConfidential: function(event, categoryId, reviewerId, docIndex) {
        var confidentialIndex = event.target.value;
        var reviewValidations = this.state.reviewValidations;
        var indexValid = null;
        for (var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].categoryId == categoryId && reviewValidations[i].reviewerId) {
                indexValid = i;
            }
        }
        var saveDocument = $.extend(true, {}, reviewValidations[indexValid].documents[docIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: { categoryId: categoryId, reviewerId: reviewerId, docIndex: docIndex },
            contents: saveDocument
        });
        if(reviewValidations[indexValid].documents[docIndex].previous_confidentiality == null) {
            reviewValidations[indexValid].documents[docIndex].previous_confidentiality = reviewValidations[indexValid].documents[docIndex].current_confidentiality;
        }
        if(reviewValidations[indexValid].documents[docIndex].previous_confidentiality == confidentialIndex){
            reviewValidations[indexValid].documents[docIndex].previous_confidentiality = null;
            reviewValidations[indexValid].documents[docIndex]['2nd_line_validation'] = "accepted";
            reviewValidations[indexValid].documents[docIndex].status = "accepted";
        } else {
            reviewValidations[indexValid].documents[docIndex]['2nd_line_validation'] = "editing";
            reviewValidations[indexValid].documents[docIndex].status = "editing";
        }
        reviewValidations[indexValid].documents[docIndex].current_confidentiality = confidentialIndex;
        this.setState(update(this.state,{
            stackChange: {$set: stackList },
            reviewValidations: {$set: reviewValidations }
        }));
        this.setState({shouldUpdate: {name: 'updateConfidentiality', categoryId: categoryId, reviewerId: reviewerId, docIndex: docIndex, confidentialIndex: confidentialIndex }});
    },
    validateNumber: function() {
        var categoryId = this.state.categoryCurrent.id;
        var reviewerId = this.state.reviewerCurrent.id;
        var reviewValidations = this.state.reviewValidations;
        var categories = this.state.categories;
        var index = null;
        var validReviewer = 0;
        var validCategory = 0;
        for(var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].reviewerId == reviewerId && reviewValidations[i].categoryId == categoryId) {
                index = i;
                console.log('validateNumber', i);
            }
        }
        for(var i = 0; i < reviewValidations[index].documents.length; i++) {
            if(reviewValidations[index].documents[i]['2nd_line_validation'] == "accepted")
            validReviewer++;
        }
        for (var i = 0; i < categories.length; i++) {
            if(categories[i].id == reviewValidations[index].categoryId)
                categories[i].totalValidate += validReviewer;
        }
        this.setState(update(this.state, {
            reviewValidations: {$set: reviewValidations },
            categories: {$set: categories }
        }));
        this.setState({shouldUpdate: { name: 'validateNumber',  categoryId:  categoryId, reviewerId: reviewerId, indexReview: index }});
    },
    onClickValidationButton: function(categoryId, reviewerId, docIndex) {
        var reviewValidations = this.state.reviewValidations;
        var indexValid = null;
        for (var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].categoryId == categoryId && reviewValidations[i].reviewerId) {
                indexValid = i;
            }
        }
        var saveDocument = $.extend(true, {}, reviewValidations[indexValid].documents[docIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: { categoryId: categoryId, reviewerId: reviewerId, docIndex: docIndex },
            contents: saveDocument
        });
        if(reviewValidations[indexValid].documents[docIndex].previous_confidentiality != null) {
            reviewValidations[indexValid].documents[docIndex].previous_confidentiality = null;
        }
        if(reviewValidations[indexValid].documents[docIndex].previous_category != null) {
            reviewValidations[indexValid].documents[docIndex].previous_category = null;
        }
        reviewValidations[indexValid].documents[docIndex]['2nd_line_validation'] = "accepted";
        reviewValidations[indexValid].documents[docIndex].status = "accepted";
        var setUpdate = update(this.state,{
            stackChange: {$set: stackList },
            reviewValidations: {$set: reviewValidations}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdate: { name: 'updateValidate', categoryId: categoryId, reviewerId: reviewerId, docIndex: docIndex,  status: 'accepted' }});
    },
    getSummary() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/review_validation/summary/",
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    summary: {$set: data},
                });
                this.setState(updateState);
                console.log("summary ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("summary error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    endReviewHandle: function() {
        browserHistory.push('/Dashboard/OverView');
    },
    render:template
});

module.exports = ReviewValidation;