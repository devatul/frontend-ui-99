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
        this.getSummary();
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.categoryCurrent != nextState.categoryCurrent) {
            return true;
        }
        if(this.state.reviewers != nextState.reviewers) {
            return true;
        }
        if(this.state.summary != nextState.summary) {
            return true;
        }
        if(this.state.stackChange != nextState.stackChange) {
            return true;
        }
        if(this.state.reviewerCurrent != nextState.reviewerCurrent) {
            return true;
        }
        if(this.state.confidentiality != nextState.confidentiality) {
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
            var update = this.state.shouldUpdate;
            if( update.name == 'updateValidate' || update.name == 'updateCategory' || update.name == 'updateConfidentiality') {
                this.validateReviewer();
            }
            if(update.name == 'validateReviewer' && update.Number > 0 ) {
                this.validateCategory();
            }
        }
        if(this.state.reviewCurrent != prevState.reviewCurrent) {
            $('.file-name-1[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner large" style="max-width: 500px; width: auto;"></div></div>'
            });
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
                var category = data[0];
                category.index = 0;
                var updateState = update(this.state, {
                    categories: {$set: data},
                    categoryCurrent: {$set: category }
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
        var data = [{"last_name":"Gilford","first_name":"Jack","number_hits":74,"type":"last_modifier","id":9},{"last_name":"McConnell","first_name":"Judith","number_hits":52,"type":"last_modifier","id":24},{"last_name":"Granger","first_name":"Farley","number_hits":51,"type":"last_modifier","id":7},{"last_name":"Haig","first_name":"Sid","number_hits":37,"type":"last_modifier","id":10},{"last_name":"Hope","first_name":"Bob","number_hits":35,"type":"last_modifier","id":13},{"last_name":"Ghostley","first_name":"Alice","number_hits":34,"type":"last_modifier","id":6},{"last_name":"Gordon","first_name":"Leo","number_hits":27,"type":"last_modifier","id":33},{"last_name":"Harris","first_name":"Jonathan","number_hits":17,"type":"last_modifier","id":11},{"last_name":"Hillaire","first_name":"Marcel","number_hits":13,"type":"last_modifier","id":12},{"last_name":"Hackett","first_name":"Buddy","number_hits":11,"type":"last_modifier","id":8}];
        var reviewer = data[0];
        reviewer.index = 0;
        var updateState = update(this.state, {
            reviewers: {$set: data },
            reviewerCurrent: {$set: reviewer }
        });
        this.setState(updateState);
    },
    setReviewerCurrent: function(reviewerIndex) {
        if(reviewerIndex < this.state.reviewers.length) {
            var Reviewer = this.state.reviewers[reviewerIndex];
            Reviewer.index = reviewerIndex;
            var setReviewer = update(this.state, {
                reviewerCurrent: { $set: Reviewer}
            });
            this.setState(setReviewer);
        }
    },
    setCategoryCurrent: function(categoryIndex) {
        if(categoryIndex < this.state.categories.length) {
            var category = this.state.categories[categoryIndex];
            category.index = categoryIndex;
            var setCategory = update(this.state, {
                categoryCurrent: { $set: category }
            });
            this.setState(setCategory);
        } else {
            $("#gotosummary").click();
        }
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
                console.log('data', data);
                var check = null;
                var reviewValidations = this.state.reviewValidations;
                for(var i = 0; i < reviewValidations.length; i++) {
                    if(reviewValidations[i].Id[0] == categoryId && reviewValidations[i].Id[1] == reviewerId) {
                        check = i;
                        console.log('i', i);
                    }
                }
                console.log('ii', check, check===null, null === 0);
                for (var i = 0; i < data.documents.length; i++) {
                    data.documents[i]['2nd_line_validation'] = "normal";
                    data.documents[i].current_category = 0;
                    data.documents[i].current_confidentiality = 0;
                    data.documents[i].previous_category = null;
                    data.documents[i].previous_confidentiality = null;
                }
                if(check === null) {
                    var reviewCurrent = {
                        Id: [categoryId,reviewerId],
                        documents: $.extend(true, {}, data.documents),
                        totalValidate: 0
                    };
                    reviewValidations.push(reviewCurrent);
                    var documentPreview = reviewValidations[0].documents[0];
                    documentPreview.index = 0;
                    var updateState = update(this.state, {
                        reviewValidations: {$set: reviewValidations },
                        reviewCurrent: {$set: reviewCurrent },
                        documentPreview: {$set: documentPreview}
                    });
                } else {
                    var documentPreview = reviewValidations[check].documents[0];
                    documentPreview.index = 0;
                    var updateState = update(this.state, {
                        reviewValidations: {$set: reviewValidations },
                        reviewCurrent: {$set: reviewValidations[check]},
                        documentPreview: {$set: documentPreview}
                    });
                }
                this.setState(updateState);
                console.log("reviewValidations ok: ", reviewValidations);
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
    cutPath: function(str) {
        if(str.length > 0) {
            return str.substring(0,str.lastIndexOf('/') + 1);
        }
    },
    size: function(obj) {
        return _.size(obj);
    },
    onChangeCategory: function(event, categoryId, reviewerId, docIndex) {
        var categoryIndex = event.target.value;
        var reviewValidations = this.state.reviewValidations;
        var indexValid = null;
        for (var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].Id[0] == categoryId && reviewValidations[i].Id[1] == reviewerId) {
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
            if(reviewValidations[i].Id[0] == categoryId && reviewValidations[i].Id[1] == reviewerId) {
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
    undoHandle: function() {
        var cateId = this.state.categoryCurrent.id;
        var revId = this.state.reviewerCurrent.id;
        if(this.state.stackChange.length > 0) {
            var stackChange = this.state.stackChange;
            var reviewValidations = this.state.reviewValidations;
            var stack = null;
            var index = null;
            var index2 = null;
            for (var i = stackChange.length - 1; i >= 0; i--) {
                if(stackChange[i].index.categoryId == cateId && stackChange[i].index.reviewerId == revId) {
                    index = i;
                    stack = stackChange[i];
                    break;
                }
            }
            for(var i = 0; i < reviewValidations.length; i++) {
                if(reviewValidations[i].Id[0] == cateId && reviewValidations[i].Id[1] == revId) {
                    index2 = i;
                    reviewValidations[i].documents[stack.index.docIndex] = stack.contents;
                }
            }
            stackChange.splice(index, index+1);
            var setUpdate = update(this.state, {
                reviewValidations: {$set: reviewValidations },
                stackChange: {$set: stackChange },
                documentPreview: {$set: reviewValidations[index2].documents[stack.index.docIndex] }
            });
            this.setState(setUpdate);
            this.setState({shouldUpdate: { name: 'undoAction',  categoryId:  cateId, reviewerId: revId, Number: index, stackChange: stackChange.length }});
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
    validateReviewer: function() {
        var categoryId = this.state.categoryCurrent.id;
        var reviewerId = this.state.reviewerCurrent.id;
        var reviewValidations = this.state.reviewValidations;
        var index = null;
        var validReviewer = 0;
        for(var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].Id[0] == categoryId && reviewValidations[i].Id[1] == reviewerId) {
                index = i;
                break;
            }
        }
        //debugger;
        console.log('i', i, _.size(reviewValidations[index].documents));
        for(var i = 0; i < _.size(reviewValidations[index].documents); i++) {
            if(reviewValidations[index].documents[i]['2nd_line_validation'] == "accepted") {
                validReviewer++;
            } 
        }
        reviewValidations[index].totalValidate = validReviewer;

        this.setState(update(this.state, {
            reviewValidations: {$set: reviewValidations }
        }));
        this.setState({shouldUpdate: { name: 'validateReviewer',  categoryId:  categoryId, reviewerId: reviewerId, Number: validReviewer}});
    },
    onClickValidationButton: function(categoryId, reviewerId, docIndex) {
        var reviewValidations = this.state.reviewValidations;
        var indexValid = null;
        for (var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].Id[0] == categoryId && reviewValidations[i].Id[1] == reviewerId) {
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
    parseInt: function(num) {
        return Math.round(num);
    },
    setDocumentPreview: function(categoryId, reviewerId, docIndex) {
        var reviewValidations = this.state.reviewValidations;
        var indexValid = null;
        for (var i = 0; i < reviewValidations.length; i++) {
            if(reviewValidations[i].Id[0] == categoryId && reviewValidations[i].Id[1] == reviewerId) {
                indexValid = i;
            }
        }
        var document = reviewValidations[indexValid].documents[docIndex];
        document.index = docIndex;
        if(indexValid != null) {
            this.setState(update(this.state, {
                documentPreview: {$set: document }
            }));
        }
    },
    nextReviewer: function(categoryId, reviewerId) {

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