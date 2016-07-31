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
import _ from 'lodash';

var UserAssignment = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            categories: [],
            categoryCurrent:{},
            categoryInfo: {},
            reviewers:[],
            filter: null,
            summary:[]
        };
    },
   	componentWillMount() {
        
        
    },
    componentDidMount() {
    	this.getCategories();
    	console.log(this.state);
    	javascript();
    	javascriptAssignement();
    	//this.handleOnChange();
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
        if(this.state.filter != nextState.filter) {
          return true;
      	}
        return false;
        
    },
    select(index){
    	$('#select_'+index).toggleClass("on");
    	this.state.reviewers[index].select = !this.state.reviewers[index].select 
    },
    selectAll(){
    	$("div.off").toggleClass("on");
    	for(var i=0; i< this.state.reviewers.length; i++){
    		this.state.reviewers[i].select = !this.state.reviewers[index].select
    	}
    },
    componentDidUpdate(prevProps, prevState) {
    	if(this.state.categoryInfo != prevState.categoryInfo) {
    		//debugger;
        	this.chartAssignment(this.state.categoryInfo);
        }
        if(this.state.categories != prevState.categories) {
        	
            $("#Category_"+ this.state.categories[0].id).click();
            //this.getCategoryInfo(this.state.categoryCurrent.id);
            this.handleOnChange();
        }
        if(this.state.categoryCurrent != prevState.categoryCurrent) {
        	
        	$("#Category_"+ this.state.categoryCurrent.id).click();
            this.getCategoryInfo(this.state.categoryCurrent.id);
            //this.chartAssignment(this.state.categoryInfo);
            //this.handleOnChange();
        }
        if(this.state.reviewers != prevState.reviewers) {
        	
            this.chartUserFilter(this.state.reviewers);
        }
        if(this.state.filter != prevState.filter) {
          this.handleFilter(this.state.filter);
          console.log("filter: ", this.state.filter);
      	}
    },
    handleOnChange: function() {
    	//debugger;
    	var filter = {};
    	if(this.state.categoryCurrent.id >= 0){
    		filter.id=this.state.categoryCurrent.id;
	    	if($('#timeframe :selected').val() == 0){
	        	filter.timeframe = 6;
	        }else{
	        	filter.timeframe = $('#timeframe :selected').val();
	    	}
	        
	        console.log("filter.timeframe: ", filter.timeframe);
	        if($('#usersnum :selected').val() == 0){
	        	filter.numberuser = 30;
	        }else{
	        	filter.numberuser = $('#usersnum :selected').val();
	    	}
	    	if($('#reviewertype :selected').val() == 0){
	        	filter.type = 'last_modifier';
	        }else{
	        	filter.type = $('#reviewertype :selected').val();
	    	}
	        console.log("filter.numberuser", filter.numberuser);
	        
	        console.log("filter.type", filter.type);
    	}
	    if(!_.isEmpty(filter)){
		      /*var updateFilter = update(this.state, {
		        filter: {$set: filter }
		      });
		      this.setState(updateFilter);*/
		      this.state.filter = filter;
		      this.handleFilter(filter);
		}else{
		  	this.handleFilter();
		}
    },
    handleFilter: function(bodyRequest) {
        console.log('bodyRequest', bodyRequest);
        if(!_.isEmpty(bodyRequest)) {
        	var heightChart= bodyRequest.numberuser*38;
        	$('#userReviewChart').css("height", heightChart);
            $.ajax({
                url: Constant.SERVER_API +  "api/assign/reviewer/",
                dataType: 'json',
                type: 'GET',
                data: bodyRequest,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
                },
                success: function(data) {
	            	for(var i = 0; i < data.length; i++){
	            		data[i]['select'] = false;	
	            	}
	            	console.log(data);
	                var updateState = update(this.state, {
	                    reviewers: {$set: data}
	                });
	                this.setState(updateState);
	                $("div.off").removeClass("on");
	                console.log("reviewers ok: ", data);
                }.bind(this),
                error: function(xhr, error) {
                    if(xhr.status === 401)
                    {
                        browserHistory.push('/Account/SignIn');
                    }
                }.bind(this)
            });
        } else {
            this.getReviewers();
        }
    },
    getReviewers() {
        var categoryId = this.state.categoryCurrent.id;
        var heightChart= 30*38;
        $('#userReviewChart').css("height", heightChart);
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/reviewer/",
            dataType: 'json',
            data: {
            	"id": categoryId,
            	"timeframe":6,
            	"type" : "last_modifier",
            	"numberuser":30
        	},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
            	
            	for(var i = 0; i< data.length; i++){
            		data[i]['select'] = false;	
            	}
            	console.log(data);
                var updateState = update(this.state, {
                    reviewers: {$set: data}
                });
                this.setState(updateState);
                $("div.off").removeClass("on");
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
            	//data[0].index = 0;
               	var updateState = update(this.state, {
                    categories: {$set: data},
                    categoryCurrent: {$set:data[0]}
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

        var categories = this.state.categories[categoryIndex];
        //categories.index = categoryIndex;
        var filter = {
        	id:categories.id,
        	timeframe:6,
        	numberuser:30,
        	type:'last_modifier'
        };
        if(categoryIndex <= (this.state.categories.length - 1)) {
            var setCategory = update(this.state, {
                categoryCurrent: { $set: categories },
                filter: { $set: filter }
            });
            this.setState(setCategory);
        }else{
        	var setCategory = update(this.state, {
                filter: { $set: filter }
            });
            this.setState(setCategory);
        }
    },
    chartAssignment(categoryInfo) {
    	//debugger;
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