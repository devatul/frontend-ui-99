import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ReviewValidation.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import javascript from '../script/javascript.js';
import Constant from '../Constant.js';
import 'jquery'

var ReviewValidation = React.createClass({
    displayName: 'ReviewValidation',
    getInitialState() {
        return {
        	categories: [],
            category_current: {},
            reviewers: [],
            reviewer_current: [],
            review_validations: [],
            review_valid_current: [],
            challenged_docs: [],
            challenged_doc_current: []
        };
    },
    componentWillMount() {
        //this.getChallengedDocs();          
    },
    componentDidMount() {
        this.getCategories();
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.reviewer_current != nextState.reviewer_current) {
            return true;
        }
        if(this.state.category_current != nextState.category_current) {
            return true;
        }
        if(this.state.reviewer_current != nextState.reviewer_current) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.category_current != prevState.category_current) {
            this.getReviewers(this.state.category_current.id);
            console.log("id category: ", this.state.category_current.id);
        }
        if(this.state.reviewer_current != prevState.reviewer_current) {
            this.getChallengedDoc(this.state.reviewer_current.id);
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
                var updateState = update(this.state, {
                    categories: {$set: data},
                    category_current: {$set: data[0]}
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
    getReviewers(categoryId) {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/reviewer/",
            dataType: 'json',
            data: {"id": categoryId},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    reviewers: {$set: data},
                    reviewer_current: {$set: data[0] }
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
        var setReviewer = update(this.state, {
            reviewer_current: this.state.reviewers[reviewerIndex]
        });
        this.setState(setReviewer); 
    },
    setCategoryCurrent: function(categoryIndex) {
        this.setState(update(this.state, {
            category_current: { $set: this.state.categories[categoryIndex]}
        }));
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
        for(var i = 0; i < this.state.challenged_docs.length; i++) {
            if(this.state.challenged_docs[i].id == this.state.reviewer_current.id) {
                var updateState = update(this.state, {
                    challenged_doc_current: { $set: this.state.challenged_docs[i] }
                });
                this.setState(updateState);
            }
        }
    },
    getReviewValidation(reviewId) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review_validation/",
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
    setReviewValidation() {
        for(var i = 0; i < this.state.review_validations.length; i++) {
            if(this.state.review_validations[i].id == this.state.reviewer_current.id) {
                var updateState = update(this.state, {
                    review_valid_current: { $set: this.state.review_validations[i] }
                });
                this.setState(updateState);
            }
        }
    },
    categoryOnChange() {

    },
    confidentialityOnChange() {

    },
    buttonAccept() {

    },
    buttonReject() {

    },
    render:template
});

module.exports = ReviewValidation;