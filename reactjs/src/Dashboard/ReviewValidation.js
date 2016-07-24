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

var ReviewValidation = React.createClass({
    displayName: 'ReviewValidation',
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            categories: [],
            categoryCurrent: null,
            reviewers: [],
            reviewerCurrent: null,
            reviewValidations: null,
            reviewValidCurrent: null,
            challengedDocs: [],
            challengedDocCurrent: null,
            summary: [],
            shouldUpdate: false,
            documentPreview: null
        };
    },
    componentWillMount() {
        //this.getCategories();
    },
    componentDidMount() {
        console.log("sfdssss", this.state.categories);
        this.getCategories();
        
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.categories != nextState.categories) {
            return true;
        }
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
        if(this.state.shouldUpdate != nextState.shouldUpdate) {
            return true;
        }
        if(this.state.documentPreview != nextState.documentPreview) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.categories != prevState.categories) {
            $("#Category_0").click();
        }
        if(this.state.categoryCurrent != prevState.categoryCurrent) {
            $('#Category_' + this.state.categoryCurrent).click();
            this.getReviewers();
        }
        if(this.state.reviewerCurrent != prevState.reviewerCurrent) {
            $('#Reviewer_' + this.state.reviewerCurrent).click();
            this.getReviewValidation();
        }
        if(this.state.reviewValidations != prevState.reviewValidations) {
//            javascriptTodo();
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
    },
    getCategories() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/category/",
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    categories: {$set: data},
                    categoryCurrent: {$set: 0 }
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
    getReviewers() {
        var categoryIndex = this.state.categoryCurrent;
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/reviewer/",
            dataType: 'json',
            data: {"id": this.state.categories[categoryIndex]},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    reviewers: {$set: data},
                    reviewerCurrent: {$set: 0 }
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
    setReviewerCurrent: function(reviewerIndex) {
        
        var reviewers = this.state.reviewers;
        var shouldUpdate = this.state.shouldUpdate;
        if(reviewerIndex <= (reviewers.length - 1)) {
            var setReviewer = update(this.state, {
                reviewerCurrent: { $set: reviewerIndex}
            });
            this.setState(setReviewer);
        }
        if(shouldUpdate) {
            this.setState({ shouldUpdate: false });
        } else {
            this.setState({ shouldUpdate: true });
        }
    },
    setCategoryCurrent: function(categoryIndex) {
        
        var categories = this.state.categories;
        if(categoryIndex <= (categories.length - 1)) {
            var setCategory = update(this.state, {
                categoryCurrent: { $set: categoryIndex }
            });
            this.setState(setCategory);
        }
        if(shouldUpdate) {
            this.setState({ shouldUpdate: false });
        } else {
            this.setState({ shouldUpdate: true });
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
        var reviewId = this.state.reviewers[this.state.reviewerCurrent].id;
        var categoryId = this.state.categories[this.state.categoryCurrent].id;
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/review_validation/",
            dataType: 'json',
            async: true,
            data: {
                "review_id": reviewId,
                "category_id": categoryId
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                console.log(this.state.reviewerCurrent.id);
                var updateState = update(this.state, {
                    reviewValidations: {$set: data},
                    documentPreview: {$set: 0 }
                });
                this.setState(updateState);
                console.log("reviewValidations ok: ", data);
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
    setDocumentPreview(docIndex) {
        var updateState = update(this.state, {
            documentPreview: { $set: docIndex }
        });
        this.setState(updateState);
    },
    categoryOnChange() {

    },
    confidentialityOnChange() {

    },
    buttonAccept() {

    },
    buttonReject() {

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