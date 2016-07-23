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

var ReviewValidation = React.createClass({
    displayName: 'ReviewValidation',
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
        	categories: [],
            category_current: {},
            reviewers: [],
            reviewer_current: [],
            review_validations: [],
            review_valid_current: [],
            challenged_docs: [],
            challenged_doc_current: [],
            summary: [],
            elementAtReviewrs:0,
            elementAtCategories:0
        };
    },
    componentWillMount() {

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
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.category_current != prevState.category_current) {
            this.getReviewers(this.state.category_current.id);
            this.setState({elementAtReviewrs: 0});
            console.log("id category: ", this.state.category_current.id);
        }
        if(this.state.reviewer_current != prevState.reviewer_current) {
            this.getReviewValidation(this.state.reviewer_current.id);
        }
        //javascriptTodo();
        
    },
    getCategories() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/category/",
            dataType: 'json',
            async: true,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.getReviewers(data[0].id);

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
            reviewer_current: { $set: this.state.reviewers[reviewerIndex]}
        });
        this.setState(setReviewer);
        if(reviewerIndex <= this.state.reviewers.length-1)
        {
            
            this.setState({elementAtReviewrs: reviewerIndex});
            console.log("index ",reviewerIndex, ",elementAtReviewrs: ",this.state.elementAtReviewrs);
        }
    },
    setCategoryCurrent: function(categoryIndex) {
        this.setState(update(this.state, {
            category_current: { $set: this.state.categories[categoryIndex]}
        }));
        if(categoryIndex <= this.state.categories.length-1)
        {
            
            this.setState({elementAtCategories: categoryIndex});
            console.log("index ",categoryIndex, ",elementAtCategories: ",this.state.elementAtCategories);
        }
        //
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
            url: Constant.SERVER_API + "api/review/review_validation/",
            dataType: 'json',
            async: false,
            data: {
                "review_id": reviewId,
                "category_id": this.state.category_current.id

            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                console.log(this.state.reviewer_current.id);
                var updateState = update(this.state, {
                    review_validations: {$set: data},
                });
                this.setState(updateState);
                console.log("review_validations ok: ", data);
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

    getSummary() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/review_validation/summary/",
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                console.log(this.state.reviewer_current.id);
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
    
    render:template
});

module.exports = ReviewValidation;