import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DocumentReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import dropdown from '../script/drop-down.js'
import Constant from '../Constant.js'
import multiselect from '../script/multiselect.js'
import 'jquery'
var OverView = React.createClass
({
	getInitialState() {
	    return {
	         DocumentReviews: [],
	         ChallengedDocuments: []
	    };
	},
	componentWillMount() {
	      
	},
	componentDidMount() {
	      
	},
	componentDidUpdate(prevProps, prevState) {
	      
	},
	getDocmentReview(reviewerId) {
		$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/documents/",
            dataType: 'json',
            async: false,
            data: {"reviewer_id": reviewerId}
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    DocumentReviews: {$set: data}
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
	getChallengedDocuments() {
		$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/challenged_docs/",
            dataType: 'json',
            async: false,
            data: {"reviewer_id": reviewerId}
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    ChallengedDocuments: {$set: data}
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
	render:template
});