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
            summary: [
	            {"id":1,
				      "name":"accounting/tax",
				      "docs_sampled" : 20,
				      "number_of_assigned": 30,
				      "total_challenged_docs": 9,
				      "total_number_document_classified": 70256,
				      "reviewers": [{"id":0,"first_name": "Alice","last_name":"Ghostley", "number_docs":135},{"id":1,"first_name": "Jack","last_name":"Gilford", "number_docs":122},{"id":2,"first_name": "Leo","last_name":"Gordon", "number_docs":112},{"id":3,"first_name": "Farley","last_name":"Granger", "number_docs":108},{"id":4,"first_name": "Buddy","last_name":"Hackett", "number_docs":101},{"id":5,"first_name": "Sid","last_name":"Haig", "number_docs":96},{"id":6,"first_name": "Jonathan","last_name":"Harris", "number_docs":80},{"id":7,"first_name": "Marcel","last_name":"Hillaire", "number_docs":72},{"id":8,"first_name": "Bob","last_name":"Hope", "number_docs":60},{"id":9,"first_name": "John","last_name":"Hoyt", "number_docs":45},{"id":10,"first_name": "Conrad","last_name":"Janis", "number_docs":42},{"id":11,"first_name": "Gordon","last_name":"Jump", "number_docs":38},{"id":12,"first_name": "Ted","last_name":"Knight", "number_docs":36},{"id":13,"first_name": "James","last_name":"Komack", "number_docs":31},{"id":14,"first_name": "Martin","last_name":"Landau", "number_docs":28},{"id":15,"first_name": "Charles","last_name":"Lane", "number_docs":26},{"id":16,"first_name": "Len","last_name":"Lesser", "number_docs":25},{"id":17,"first_name": "Laurie","last_name":"Main", "number_docs":25},{"id":18,"first_name": "Kenneth","last_name":"Mars", "number_docs":23},{"id":19,"first_name": "Judith","last_name":"McConnell", "number_docs":22},{"id":20,"first_name": "Pat","last_name":"McCormick", "number_docs":20},{"id":21,"first_name": "Robert","last_name":"Middleton", "number_docs":18},{"id":22,"first_name": "Al","last_name":"Molinaro", "number_docs":16},{"id":23,"first_name": "Howard","last_name":"Morton", "number_docs":15},{"id":24,"first_name": "Burt","last_name":"Mustin", "number_docs":12},{"id":25,"first_name": "Barry","last_name":"Newman", "number_docs":9},{"id":26,"first_name": "Julie","last_name":"Newmar", "number_docs":7},{"id":27,"first_name": "Leonard","last_name":"Nimoy", "number_docs":6},{"id":28,"first_name": "Alan","last_name":"Oppenheimer", "number_docs":6},{"id":29,"first_name": "Pat","last_name":"Paulsen", "number_docs":4}] },
				{"id":2,
				       "name":"corporate entity",
				       "docs_sampled" : 20,
				       "number_of_assigned": 30,
				       "total_challenged_docs": 7,
				       "total_number_document_classified": 35128,
				       "reviewers": [{"id":0,"first_name": "Alice","last_name":"Ghostley", "number_docs":135},{"id":1,"first_name": "Jack","last_name":"Gilford", "number_docs":122},{"id":2,"first_name": "Leo","last_name":"Gordon", "number_docs":112},{"id":3,"first_name": "Farley","last_name":"Granger", "number_docs":108},{"id":4,"first_name": "Buddy","last_name":"Hackett", "number_docs":101},{"id":5,"first_name": "Sid","last_name":"Haig", "number_docs":96},{"id":6,"first_name": "Jonathan","last_name":"Harris", "number_docs":80},{"id":7,"first_name": "Marcel","last_name":"Hillaire", "number_docs":72},{"id":8,"first_name": "Bob","last_name":"Hope", "number_docs":60},{"id":9,"first_name": "John","last_name":"Hoyt", "number_docs":45},{"id":10,"first_name": "Conrad","last_name":"Janis", "number_docs":42},{"id":11,"first_name": "Gordon","last_name":"Jump", "number_docs":38},{"id":12,"first_name": "Ted","last_name":"Knight", "number_docs":36},{"id":13,"first_name": "James","last_name":"Komack", "number_docs":31},{"id":14,"first_name": "Martin","last_name":"Landau", "number_docs":28},{"id":15,"first_name": "Charles","last_name":"Lane", "number_docs":26},{"id":16,"first_name": "Len","last_name":"Lesser", "number_docs":25},{"id":17,"first_name": "Laurie","last_name":"Main", "number_docs":25},{"id":18,"first_name": "Kenneth","last_name":"Mars", "number_docs":23},{"id":19,"first_name": "Judith","last_name":"McConnell", "number_docs":22},{"id":20,"first_name": "Pat","last_name":"McCormick", "number_docs":20},{"id":21,"first_name": "Robert","last_name":"Middleton", "number_docs":18},{"id":22,"first_name": "Al","last_name":"Molinaro", "number_docs":16},{"id":23,"first_name": "Howard","last_name":"Morton", "number_docs":15},{"id":24,"first_name": "Burt","last_name":"Mustin", "number_docs":12},{"id":25,"first_name": "Barry","last_name":"Newman", "number_docs":9},{"id":26,"first_name": "Julie","last_name":"Newmar", "number_docs":7},{"id":27,"first_name": "Leonard","last_name":"Nimoy", "number_docs":6},{"id":28,"first_name": "Alan","last_name":"Oppenheimer", "number_docs":6},{"id":29,"first_name": "Pat","last_name":"Paulsen", "number_docs":4}] },
				{"id":3,
				       "name":"Client/Customer",
				       "docs_sampled" : 20,
				       "number_of_assigned": 30,
				       "total_challenged_docs": 9,
				       "total_number_document_classified": 122947,
				       "reviewers": [{"id":0,"first_name": "Alice","last_name":"Ghostley", "number_docs":135},{"id":1,"first_name": "Jack","last_name":"Gilford", "number_docs":122},{"id":2,"first_name": "Leo","last_name":"Gordon", "number_docs":112},{"id":3,"first_name": "Farley","last_name":"Granger", "number_docs":108},{"id":4,"first_name": "Buddy","last_name":"Hackett", "number_docs":101},{"id":5,"first_name": "Sid","last_name":"Haig", "number_docs":96},{"id":6,"first_name": "Jonathan","last_name":"Harris", "number_docs":80},{"id":7,"first_name": "Marcel","last_name":"Hillaire", "number_docs":72},{"id":8,"first_name": "Bob","last_name":"Hope", "number_docs":60},{"id":9,"first_name": "John","last_name":"Hoyt", "number_docs":45},{"id":10,"first_name": "Conrad","last_name":"Janis", "number_docs":42},{"id":11,"first_name": "Gordon","last_name":"Jump", "number_docs":38},{"id":12,"first_name": "Ted","last_name":"Knight", "number_docs":36},{"id":13,"first_name": "James","last_name":"Komack", "number_docs":31},{"id":14,"first_name": "Martin","last_name":"Landau", "number_docs":28},{"id":15,"first_name": "Charles","last_name":"Lane", "number_docs":26},{"id":16,"first_name": "Len","last_name":"Lesser", "number_docs":25},{"id":17,"first_name": "Laurie","last_name":"Main", "number_docs":25},{"id":18,"first_name": "Kenneth","last_name":"Mars", "number_docs":23},{"id":19,"first_name": "Judith","last_name":"McConnell", "number_docs":22},{"id":20,"first_name": "Pat","last_name":"McCormick", "number_docs":20},{"id":21,"first_name": "Robert","last_name":"Middleton", "number_docs":18},{"id":22,"first_name": "Al","last_name":"Molinaro", "number_docs":16},{"id":23,"first_name": "Howard","last_name":"Morton", "number_docs":15},{"id":24,"first_name": "Burt","last_name":"Mustin", "number_docs":12},{"id":25,"first_name": "Barry","last_name":"Newman", "number_docs":9},{"id":26,"first_name": "Julie","last_name":"Newmar", "number_docs":7},{"id":27,"first_name": "Leonard","last_name":"Nimoy", "number_docs":6},{"id":28,"first_name": "Alan","last_name":"Oppenheimer", "number_docs":6},{"id":29,"first_name": "Pat","last_name":"Paulsen", "number_docs":4}] },
				{"id":4,
				       "name":"Employee",
				       "docs_sampled" : 20,
				       "number_of_assigned": 30,
				       "total_challenged_docs": 7,
				       "total_number_document_classified": 17564,
				       "reviewers": [{"id":0,"first_name": "Alice","last_name":"Ghostley", "number_docs":135},{"id":1,"first_name": "Jack","last_name":"Gilford", "number_docs":122},{"id":2,"first_name": "Leo","last_name":"Gordon", "number_docs":112},{"id":3,"first_name": "Farley","last_name":"Granger", "number_docs":108},{"id":4,"first_name": "Buddy","last_name":"Hackett", "number_docs":101},{"id":5,"first_name": "Sid","last_name":"Haig", "number_docs":96},{"id":6,"first_name": "Jonathan","last_name":"Harris", "number_docs":80},{"id":7,"first_name": "Marcel","last_name":"Hillaire", "number_docs":72},{"id":8,"first_name": "Bob","last_name":"Hope", "number_docs":60},{"id":9,"first_name": "John","last_name":"Hoyt", "number_docs":45},{"id":10,"first_name": "Conrad","last_name":"Janis", "number_docs":42},{"id":11,"first_name": "Gordon","last_name":"Jump", "number_docs":38},{"id":12,"first_name": "Ted","last_name":"Knight", "number_docs":36},{"id":13,"first_name": "James","last_name":"Komack", "number_docs":31},{"id":14,"first_name": "Martin","last_name":"Landau", "number_docs":28},{"id":15,"first_name": "Charles","last_name":"Lane", "number_docs":26},{"id":16,"first_name": "Len","last_name":"Lesser", "number_docs":25},{"id":17,"first_name": "Laurie","last_name":"Main", "number_docs":25},{"id":18,"first_name": "Kenneth","last_name":"Mars", "number_docs":23},{"id":19,"first_name": "Judith","last_name":"McConnell", "number_docs":22},{"id":20,"first_name": "Pat","last_name":"McCormick", "number_docs":20},{"id":21,"first_name": "Robert","last_name":"Middleton", "number_docs":18},{"id":22,"first_name": "Al","last_name":"Molinaro", "number_docs":16},{"id":23,"first_name": "Howard","last_name":"Morton", "number_docs":15},{"id":24,"first_name": "Burt","last_name":"Mustin", "number_docs":12},{"id":25,"first_name": "Barry","last_name":"Newman", "number_docs":9},{"id":26,"first_name": "Julie","last_name":"Newmar", "number_docs":7},{"id":27,"first_name": "Leonard","last_name":"Nimoy", "number_docs":6},{"id":28,"first_name": "Alan","last_name":"Oppenheimer", "number_docs":6},{"id":29,"first_name": "Pat","last_name":"Paulsen", "number_docs":4}] },
				{"id":5,
				       "name":"Legal/Compliance",
				       "docs_sampled" : 20,
				       "number_of_assigned": 30,
				       "total_challenged_docs": 9,
				       "total_number_document_classified": 52692,
				       "reviewers": [{"id":0,"first_name": "Alice","last_name":"Ghostley", "number_docs":135},{"id":1,"first_name": "Jack","last_name":"Gilford", "number_docs":122},{"id":2,"first_name": "Leo","last_name":"Gordon", "number_docs":112},{"id":3,"first_name": "Farley","last_name":"Granger", "number_docs":108},{"id":4,"first_name": "Buddy","last_name":"Hackett", "number_docs":101},{"id":5,"first_name": "Sid","last_name":"Haig", "number_docs":96},{"id":6,"first_name": "Jonathan","last_name":"Harris", "number_docs":80},{"id":7,"first_name": "Marcel","last_name":"Hillaire", "number_docs":72},{"id":8,"first_name": "Bob","last_name":"Hope", "number_docs":60},{"id":9,"first_name": "John","last_name":"Hoyt", "number_docs":45},{"id":10,"first_name": "Conrad","last_name":"Janis", "number_docs":42},{"id":11,"first_name": "Gordon","last_name":"Jump", "number_docs":38},{"id":12,"first_name": "Ted","last_name":"Knight", "number_docs":36},{"id":13,"first_name": "James","last_name":"Komack", "number_docs":31},{"id":14,"first_name": "Martin","last_name":"Landau", "number_docs":28},{"id":15,"first_name": "Charles","last_name":"Lane", "number_docs":26},{"id":16,"first_name": "Len","last_name":"Lesser", "number_docs":25},{"id":17,"first_name": "Laurie","last_name":"Main", "number_docs":25},{"id":18,"first_name": "Kenneth","last_name":"Mars", "number_docs":23},{"id":19,"first_name": "Judith","last_name":"McConnell", "number_docs":22},{"id":20,"first_name": "Pat","last_name":"McCormick", "number_docs":20},{"id":21,"first_name": "Robert","last_name":"Middleton", "number_docs":18},{"id":22,"first_name": "Al","last_name":"Molinaro", "number_docs":16},{"id":23,"first_name": "Howard","last_name":"Morton", "number_docs":15},{"id":24,"first_name": "Burt","last_name":"Mustin", "number_docs":12},{"id":25,"first_name": "Barry","last_name":"Newman", "number_docs":9},{"id":26,"first_name": "Julie","last_name":"Newmar", "number_docs":7},{"id":27,"first_name": "Leonard","last_name":"Nimoy", "number_docs":6},{"id":28,"first_name": "Alan","last_name":"Oppenheimer", "number_docs":6},{"id":29,"first_name": "Pat","last_name":"Paulsen", "number_docs":4}] },
				{"id":6,
				       "name":"Transaction",
				       "docs_sampled" : 20,
				       "number_of_assigned": 30,
				       "total_challenged_docs": 4,
				       "total_number_document_classified": 52692,
				       "reviewers": [{"id":0,"first_name": "Alice","last_name":"Ghostley", "number_docs":135},{"id":1,"first_name": "Jack","last_name":"Gilford", "number_docs":122},{"id":2,"first_name": "Leo","last_name":"Gordon", "number_docs":112},{"id":3,"first_name": "Farley","last_name":"Granger", "number_docs":108},{"id":4,"first_name": "Buddy","last_name":"Hackett", "number_docs":101},{"id":5,"first_name": "Sid","last_name":"Haig", "number_docs":96},{"id":6,"first_name": "Jonathan","last_name":"Harris", "number_docs":80},{"id":7,"first_name": "Marcel","last_name":"Hillaire", "number_docs":72},{"id":8,"first_name": "Bob","last_name":"Hope", "number_docs":60},{"id":9,"first_name": "John","last_name":"Hoyt", "number_docs":45},{"id":10,"first_name": "Conrad","last_name":"Janis", "number_docs":42},{"id":11,"first_name": "Gordon","last_name":"Jump", "number_docs":38},{"id":12,"first_name": "Ted","last_name":"Knight", "number_docs":36},{"id":13,"first_name": "James","last_name":"Komack", "number_docs":31},{"id":14,"first_name": "Martin","last_name":"Landau", "number_docs":28},{"id":15,"first_name": "Charles","last_name":"Lane", "number_docs":26},{"id":16,"first_name": "Len","last_name":"Lesser", "number_docs":25},{"id":17,"first_name": "Laurie","last_name":"Main", "number_docs":25},{"id":18,"first_name": "Kenneth","last_name":"Mars", "number_docs":23},{"id":19,"first_name": "Judith","last_name":"McConnell", "number_docs":22},{"id":20,"first_name": "Pat","last_name":"McCormick", "number_docs":20},{"id":21,"first_name": "Robert","last_name":"Middleton", "number_docs":18},{"id":22,"first_name": "Al","last_name":"Molinaro", "number_docs":16},{"id":23,"first_name": "Howard","last_name":"Morton", "number_docs":15},{"id":24,"first_name": "Burt","last_name":"Mustin", "number_docs":12},{"id":25,"first_name": "Barry","last_name":"Newman", "number_docs":9},{"id":26,"first_name": "Julie","last_name":"Newmar", "number_docs":7},{"id":27,"first_name": "Leonard","last_name":"Nimoy", "number_docs":6},{"id":28,"first_name": "Alan","last_name":"Oppenheimer", "number_docs":6},{"id":29,"first_name": "Pat","last_name":"Paulsen", "number_docs":4}] }
	       	],
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
	        	filter.numberuser = 10;
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
        	if(bodyRequest.numberuser <= 15){
	        	var heightChart= bodyRequest.numberuser*39;
	        }else{
	        	var heightChart= bodyRequest.numberuser*36.5;
	        }

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
        var heightChart= 10*39;
        $('#userReviewChart').css("height", heightChart);
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/reviewer/",
            dataType: 'json',
            data: {
            	"id": categoryId,
            	"timeframe":6,
            	"type" : "last_modifier",
            	"numberuser":10
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
        	numberuser:10,
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
        /*$.ajax({
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
        });*/
    },
    render:template
});

module.exports = UserAssignment;