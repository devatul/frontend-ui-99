import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ReviewValidation.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
//import javascript from '../script/javascript.js';
import Constant from '../Constant.js';
import 'jquery'
//import javascriptTodo from '../script/javascript.todo.js'
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
            summary: [{"id":1,
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
       "reviewers": [{"id":0,"first_name": "Alice","last_name":"Ghostley", "number_docs":135},{"id":1,"first_name": "Jack","last_name":"Gilford", "number_docs":122},{"id":2,"first_name": "Leo","last_name":"Gordon", "number_docs":112},{"id":3,"first_name": "Farley","last_name":"Granger", "number_docs":108},{"id":4,"first_name": "Buddy","last_name":"Hackett", "number_docs":101},{"id":5,"first_name": "Sid","last_name":"Haig", "number_docs":96},{"id":6,"first_name": "Jonathan","last_name":"Harris", "number_docs":80},{"id":7,"first_name": "Marcel","last_name":"Hillaire", "number_docs":72},{"id":8,"first_name": "Bob","last_name":"Hope", "number_docs":60},{"id":9,"first_name": "John","last_name":"Hoyt", "number_docs":45},{"id":10,"first_name": "Conrad","last_name":"Janis", "number_docs":42},{"id":11,"first_name": "Gordon","last_name":"Jump", "number_docs":38},{"id":12,"first_name": "Ted","last_name":"Knight", "number_docs":36},{"id":13,"first_name": "James","last_name":"Komack", "number_docs":31},{"id":14,"first_name": "Martin","last_name":"Landau", "number_docs":28},{"id":15,"first_name": "Charles","last_name":"Lane", "number_docs":26},{"id":16,"first_name": "Len","last_name":"Lesser", "number_docs":25},{"id":17,"first_name": "Laurie","last_name":"Main", "number_docs":25},{"id":18,"first_name": "Kenneth","last_name":"Mars", "number_docs":23},{"id":19,"first_name": "Judith","last_name":"McConnell", "number_docs":22},{"id":20,"first_name": "Pat","last_name":"McCormick", "number_docs":20},{"id":21,"first_name": "Robert","last_name":"Middleton", "number_docs":18},{"id":22,"first_name": "Al","last_name":"Molinaro", "number_docs":16},{"id":23,"first_name": "Howard","last_name":"Morton", "number_docs":15},{"id":24,"first_name": "Burt","last_name":"Mustin", "number_docs":12},{"id":25,"first_name": "Barry","last_name":"Newman", "number_docs":9},{"id":26,"first_name": "Julie","last_name":"Newmar", "number_docs":7},{"id":27,"first_name": "Leonard","last_name":"Nimoy", "number_docs":6},{"id":28,"first_name": "Alan","last_name":"Oppenheimer", "number_docs":6},{"id":29,"first_name": "Pat","last_name":"Paulsen", "number_docs":4}] }],
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
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
                for (var i = 0; i < data.documents.length; i++) {
                    data.documents[i]['2nd_line_validation'] = "normal";
                    data.documents[i].current_category = 0;
                    data.documents[i].current_confidentiality = 0;
                    data.documents[i].previous_category = null;
                    //data.documents[i].previous_confidentiality = null;
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
            //reviewValidations[indexValid].documents[docIndex].previous_confidentiality = null;
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
            if(reviewValidations[index].documents[i]['2nd_line_validation'] == "accepted" || reviewValidations[index].documents[i]['2nd_line_validation'] == "editing") {
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
            //reviewValidations[indexValid].documents[docIndex].previous_confidentiality = null;
        }
        if(reviewValidations[indexValid].documents[docIndex].previous_category != null) {
            //reviewValidations[indexValid].documents[docIndex].previous_category = null;
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
        if(indexValid != null) {
            var document = reviewValidations[indexValid].documents[docIndex];
            document.index = parseInt(docIndex);
            this.setState(update(this.state, {
                documentPreview: {$set: document }
            }));
            $('#previewModal .file-preview').html('<a href="'+document.image_url+'" id="embedURL"></a>');
            $('#embedURL').gdocsViewer();
        }
    },
    nextReviewer: function(categoryId, reviewerId) {

    },
    getSummary() {
        /*$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/review_validation/summary/",
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
    endReviewHandle: function() {
        browserHistory.push('/Dashboard/OverView');
    },
    render:template
});

module.exports = ReviewValidation;