import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './UserAssignment.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import javascript from '../script/javascript.js';
import Constant from '../Constant.js'
import userAssignment from '../script/chart-user-assignment.js'
import chartFilterAssignment from '../script/chart-filter-assignment.js'
import javascriptAssignement from '../script/javascript.assignement.js'
import 'jquery'

var UserAssignment = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            categories: [],
            categoryCurrent:[],
            categoryInfo: [],
            reviewers:[],
            filter: [],
            summary:[]
        };
    },
    componentWillUnmount() {  
    },
    componentDidMount() {
    	this.getCategories();
    	javascript();
    	javascriptAssignement();
    },
    addCommas(nStr)
    {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    shouldComponentUpdate(nextProps, nextState) {
       if(this.state.categories != nextState.categories) {
    		return true;
    	}
        if(this.state.categoryInfo != nextState.categoryInfo) {
        	return true;
        }
        if(this.state.filter != nextState.filter) {
        	return true;
        }
        if(this.state.categoryCurrent != nextState.categoryCurrent) {
            return true;
        }
        if(this.state.reviewers != nextState.reviewers) {
            return true;
        }
        
        if(this.state.summary != nextState.summary) {
            return true;
        }
        return false;
        
    },
    select(index){
    	$('#select_'+index).toggleClass("on");
    },
    selectAll(){
    	$("div.off").toggleClass("on");
    },
    componentDidUpdate(prevProps, prevState) {
    	if(this.state.categoryInfo != prevState.categoryInfo) {
        	this.chartAssignment(this.state.categoryInfo);
        }
    	/*if(prevState.filter != this.state.filter) {
    		this.chartUserFilter();
    	}*/
        if(this.state.categories != prevState.categories) {
            $("#Category_"+ this.state.categories[0].id).click();
            this.getCategoryInfo(this.state.categories[0].id);
            this.getReviewers();
        }
        if(this.state.categoryCurrent != prevState.categoryCurrent) {
            $('#Category_' + this.state.categoryCurrent.id).click();
            this.getCategoryInfo(this.state.categoryCurrent.id);
            this.getReviewers();
        }
        if(this.state.reviewers != prevState.reviewers) {
        	
            this.chartUserFilter(this.state.reviewers);
        }
        
    },
    getReviewers() {
        //var categoryIndex = this.state.categoryCurrent.;
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/reviewer/",
            dataType: 'json',
            data: {"id": this.state.categoryCurrent.id},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    reviewers: {$set: data}
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
                });

               	this.setState(updateState);
                //this.state.categories = data;
                console.log("categories: ", data);
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
    getCategoryInfo(id) {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/category/",
            dataType: 'json',
            async: false,
            data: { "id": id},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    categoryInfo: {$set: data},
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
    setCategoryCurrent: function(categoryIndex) {

        var categories = this.state.categories;
        if(categoryIndex <= (categories.length - 1)) {
            var setCategory = update(this.state, {
                categoryCurrent: { $set: this.state.categories[categoryIndex] }
            });
            this.setState(setCategory);
        }
    },
    filterOnchange(event) {
    	var value = event.target.value;
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/reviewer/",
            dataType: 'json',
            async: false,
            data: { "id": id, "timeframe": "", "type": ""},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    categoryInfo: {$set: data},
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    chartAssignment(categoryInfo) {
    	userAssignment(categoryInfo);
    },
    chartUserFilter(reviewers) {    	
    	 chartFilterAssignment(reviewers);
    },
    getSummary() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/summary/",
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
    render:template
});

module.exports = UserAssignment;