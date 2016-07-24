import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DocumentReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import chart from '../script/chart-group-review.js'
import Constant from '../Constant.js'
import undo from '../script/Undo.js'
import javascript_todo from '../script/javascript.todo.js'
import javascript_docs from '../script/javascript.docs.js'
import help_guide from '../script/help_guide.js';
import nanoscroller from '../script/nanoscroller.js'
import loadScript from '../script/load.scripts.js';
import 'jquery'

var DocumentReview = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            Actions: null,
            category_confidence_level: null,
            category_level_current: null,
            confidential_confidence_level: null,
            confidential_level_current: null,
            ChallengedDocuments: [],
            documentPreview: null,
            documentPreviewIndex: null,
            challengedDocPreview: null,
            challengedDocPreviewIndex: null

        };
    },
    componentWillMount() {
        this.getActions();
    },
    componentDidMount() {
        this.getChallengedDocument();
        loadScript("/assets/vendor/gdocsviewer/jquery.gdocsviewer.min.js", function() {
            $('#previewModal').on('show.bs.modal', function(e) {

                //get data-id attribute of the clicked element
                var fileURL = $(e.relatedTarget).attr('data-file-url');

                console.log(fileURL);
                
                $('#previewModal .file-preview').html('<a href="'+fileURL+'" id="embedURL"></a>');
                $('#embedURL').gdocsViewer();
            });
            $('#previewModal3').on('show.bs.modal', function(e) {

                //get data-id attribute of the clicked element
                var fileURL = $(e.relatedTarget).attr('data-file-url');

                console.log(fileURL);
                
                $('#previewModal3 .file-preview').html('<a href="'+fileURL+'" id="embedURL3"></a>');
                $('#embedURL3').gdocsViewer();
            });
        }.bind(this));
        console.log("ddddddd", this.state.category_confidence_level);
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.documentPreview != nextState.documentPreview) {
            return true;
        }
        if(this.state.challengedDocPreview != nextState.challengedDocPreview) {
            return true;
        }
        if(this.state.category_level_current != nextState.category_level_current) {
            return true;
        }
        if(this.state.confidential_level_current != nextState.confidential_level_current) {
            return true;
        }
        if(this.state.ChallengedDocuments != nextState.ChallengedDocuments) {
            return true;
        }
        return false;  
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.ChallengedDocuments != prevState.ChallengedDocuments) {
            javascript_todo();
            help_guide();
            nanoscroller();
            undo.setup(function(dataUndo, val) {
                console.log('undo: ', dataUndo );
                var element = dataUndo.obj;
                var id = dataUndo.id;
                console.log("element: ", element, val);
                if(element.dataset.value != null) var data = element.dataset.value.split(':');
                if(data != null && data[2] === "Category") {
                    var new_category_level = this.state.category_confidence_level;
                    new_category_level[data[0]][data[1]] = val;
                    this.setState(update(this.state, {
                        category_confidence_level: {$set: new_category_level},
                        category_level_current: {$set: data[0] + ':' + data[1] + ':' + val}
                    }));
                }
                if(data != null && data[2] ==="Confidential") {
                    var new_confidential_level = this.state.confidential_confidence_level;
                    new_confidential_level[data[0]][data[1]] = val;
                    this.setState(update(this.state, {
                        confidential_confidence_level: {$set: new_confidential_level},
                        confidential_level_current: {$set: data[1] + ':' + val}
                    }));
                }
            }.bind(this));
        }
    },
    getActions: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/documents/",
            dataType: 'json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var category = [];
                var category_lv = [];
                var confidential = [];
                var confidential_lv = [];
                for(var i = 0; i < data.length; i++) {
                    category = [];
                    confidential = [];
                    for (var j = 0; j < data[i].documents.length; j++) {
                        category.push(data[i].documents[j].categories[0].confidence_level);
                        confidential.push(data[i].documents[j].confidentialities[0].confidence_level);
                    }
                    category_lv.push(category);
                    confidential_lv.push(confidential);
                }
                var updateState = update(this.state, {
                    Actions: {$set: data},
                    documentPreview: {$set: data[0].documents[0] },
                    documentPreviewIndex: {$set: [0, 0] },
                    category_confidence_level: {$set: category_lv },
                    confidential_confidence_level: {$set: confidential_lv }
                });
                this.setState(updateState);
                console.log("Documents ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("Documents error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getChallengedDocument: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/review/challenged_docs/",
            dataType: 'json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    ChallengedDocuments: {$set: data},
                    challengedDocPreview: {$set: data[0].documents[0]},
                    challengedDocPreviewIndex: {$set: [0, 0] }
                });
                this.setState(updateState);
                console.log("Doc ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("Doc error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    setDocumentPreview: function(actionIndex, docIndex) {
        var documentCurrent = this.state.Actions[actionIndex].documents[docIndex];
        var setDocumentCurrent = update(this.state, {
            documentPreview: { $set: documentCurrent },
            documentPreviewIndex: { $set: [actionIndex, docIndex] }
        });
        this.setState(setDocumentCurrent);
    },
    setChallengedCurrent: function(challengedIndex, docChallIndex) {
        var challengedDocCurrent = this.state.ChallengedDocuments[challengedIndex].documents[docChallIndex];
        var setChallengedDocCurrent = update(this.state, {
            challengedDocPreview: { $set: challengedDocCurrent },
            challengedDocPreviewIndex: { $set: [challengedIndex, docChallIndex] }
        });
        this.setState(setChallengedDocCurrent);
    },
    progressbar: function(value) {
        if(value <= Constant.progressValue.level1) {
            return Constant.progressBar.level1;
        } else if(value > Constant.progressValue.level1 && value <= Constant.progressValue.level2) {
            return Constant.progressBar.level2;
        }
        return Constant.progressBar.level3;
    },
    onChangeCategory: function(event, index) {
        var val = event.target.value;
        var new_category_level = this.state.category_confidence_level;
        new_category_level[index[0]][index[1]] = val;
        var updateState = update(this.state, {
            category_confidence_level: {$set: new_category_level},
            category_level_current: {$set: index[0] + ':' + index[1] + ':' + val}
        });
        this.setState(updateState);
    },
    onChangeConfidential: function(event, index) {
        var val = event.target.value;
        var new_confidential_level = this.state.confidential_confidence_level;
        new_confidential_level[index[0]][index[1]] = val;
        
        var updateState = update(this.state, {
            confidential_confidence_level: {$set: new_confidential_level},
            confidential_level_current: {$set: index[0] + '' + index[1] + ':' + val}
        });
        this.setState(updateState); 
    },
    urgency: function(value) {
        for(var i = 0; i < Constant.urgency.length; i++) {
            if(value == Constant.urgency[i].name) {
                return Constant.urgency[i]['class'];
            }
        }
    },
    endReviewHandle: function() {
        browserHistory.push('/Dashboard/OverView');
    },
    render:template
});
module.exports = DocumentReview;