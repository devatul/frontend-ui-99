import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DocumentReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import chart from '../script/chart-group-review.js'
import Constant from '../Constant.js'
import loadScript from '../script/load.scripts.js';
import 'jquery'

var DocumentReview = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            Actions: null,
            ChallengedDocuments: [],
            documentPreview: null,
            challengedPreview: null,
            shouldUpdate: null,
            shouldUpdateChall: null,
            stackChange: [],
            stackChangeChallenged: [],


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
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.ChallengedDocuments != nextState.ChallengedDocuments) {
            return true;
        }
        if(this.state.documentPreview != nextState.documentPreview) {
            return true;
        }
        if(this.state.challengedPreview != nextState.challengedPreview) {
             return true;
        }
        if(this.state.shouldUpdate != nextState.shouldUpdate) {
            return true;
        }
        if(this.state.shouldUpdateChall != nextState.shouldUpdateChall) {
            return true;
        }
        return false;  
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.shouldUpdate != prevState.shouldUpdate) {
            var update = this.state.shouldUpdate;
            if(update.name === 'updateValidate' || update.name === 'undoAction' || update.name === 'approveButon' || update.name === "updateCategory" || update.name === "updateConfidential") {
                debugger;
                this.validateNumber(update.actionIndex);
            }
            if(update.name === 'updateCheckBox' || update.name === 'undoAction' || update.name === "updateCheckAll" || update.name === 'approveButon') {
                this.checkedNumber(update.actionIndex);
            }
        }
        if(this.state.shouldUpdateChall != prevState.shouldUpdateChall) {
            var update = this.state.shouldUpdateChall;
            if(update.name === 'updateValidate' || update.name === "undoActionChallenged" || update.name === 'approveButon' || update.name === "updateCategory" || update.name === "updateConfidentialChall") {
                debugger;
                this.validateNumberChallenged(update.actionIndex);
            }
            if(update.name === 'updateCheckBox' || update.name === "undoActionChallenged" || update.name === "updateCheckAll" || update.name === 'approveButon') {
                this.checkedNumberChallenged(update.actionIndex);
            }
        }
        if(this.state.ChallengedDocuments != prevState.ChallengedDocuments) {
            console.log('challengedPreview', this.state.challengedPreview);
            $('.select-group select').focus(function(){
            var selectedRow = $(this).parents('tr');
                $('.table-my-actions tr').each(function(){
                    if(!$(this).find('.checkbox-item').prop('checked')){
                        $(this).addClass('inactive');
                    }
                });
                selectedRow.removeClass('inactive');
            });

            $('.select-group select').blur(function(){
                $('.table-my-actions tr').removeClass('inactive');
            });
            $('.file-name-1[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner large" style="max-width: 500px; width: auto;"></div></div>'
            });
            $("a.more").click(function(){ 
                $(this).prev().toggleClass("height-2nd");
                $(this).children(".more1").toggleClass("display-none");
                $(this).children(".zoom-out").toggleClass("zoom-out-block");
            });
            $( ".my-doc-path" ).each(function( index ) {
                var hi = "38"; 
                var h = $(this).height();
                if(h>hi){
                    $(this).css('height', hi);
                    $(this).next().addClass("display-block");
                    console.log(h);
                    console.log(hi);
                }
            });
        }
        if(this.state.challengedPreview != prevState.challengedPreview) {
            loadScript("/assets/vendor/gdocsviewer/jquery.gdocsviewer.min.js", function() {
                $('#previewModal3').on('show.bs.modal', function(e) {

                    //get data-id attribute of the clicked element
                    var fileURL = $(e.relatedTarget).attr('data-file-url');

                    console.log(fileURL);
                    
                    $('#previewModal3 .file-preview').html('<a href="'+fileURL+'" id="embedURL3"></a>');
                    $('#embedURL3').gdocsViewer();
                });
            }.bind(this));
            $( ".my-doc-path" ).each(function( index ) {
                var hi = "38"; 
                var h = $(this).height();
                if(h>hi){
                    $(this).css('height', hi);
                    $(this).next().addClass("display-block");
                    console.log(h);
                    console.log(hi);
                }
            });
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
                console.log('dataaaa', data);
                for(var i = 0; i < data.length; i++) {
                    data[i].checkAll = false;
                    data[i].checkedNumber = 0;
                    data[i].validateNumber = 0;
                    for(var j = 0; j < data[i].documents.length; j++) {
                        data[i].documents[j].confidential_confidence_level = Math.floor(Math.random()*(99-70+1)+70);
                        data[i].documents[j].confidence_level = Math.floor(Math.random()*(99-70+1)+70);
                        data[i].documents[j].current = {
                            checked: false,
                            category: 4,
                            confidential: (i == 0) ? 1 : 2,
                            status: "normal"
                        };
                    }
                }
                var documentPreview = data[0].documents[0];
                documentPreview.index = { actionIndex: 0, docIndex: 0};
                var updateState = update(this.state, {
                    Actions: {$set: data},
                    documentPreview: {$set: documentPreview}
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
    setDocumentPreview: function(actionIndex, docIndex) {
        var documentCurrent = this.state.Actions[actionIndex].documents[docIndex];
        documentCurrent.index = { actionIndex: actionIndex, docIndex: docIndex };
        var setDocumentCurrent = update(this.state, {
            documentPreview: { $set: documentCurrent },
        });
        this.setState(setDocumentCurrent);
    },
    progressbar: function(value) {
        if(value <= Constant.progressValue.level1) {
            return Constant.progressBar.level1;
        } else if(value > Constant.progressValue.level1 && value <= Constant.progressValue.level2) {
            return Constant.progressBar.level2;
        }
        return Constant.progressBar.level3;
    },
    onChangeCategory: function(event, actionIndex, docIndex) {
        var categoryIndex = event.target.value;
        var actions = this.state.Actions;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: { actionIndex: actionIndex,docIndex: docIndex },
            contents: saveDocument
        });
        actions[actionIndex].documents[docIndex].current.category = categoryIndex;
        if(actions[actionIndex].documents[docIndex].current.confidential == 0 && actions[actionIndex].documents[docIndex].current.category == 0)
            actions[actionIndex].documents[docIndex].current.status = "accept";
        else
            actions[actionIndex].documents[docIndex].current.status = "editing";
        this.setState(update(this.state,{
            stackChange: {$set: stackList },
            Actions: {$set: actions }
        }));
        this.setState({shouldUpdate: { name: 'updateCategory', actionIndex:  actionIndex, docIndex: docIndex, categoryIndex: categoryIndex}});
    },
    onChangeConfidential: function(event, actionIndex, docIndex) {
        var confidentialIndex = event.target.value;
        var actions = this.state.Actions;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: { actionIndex: actionIndex, docIndex: docIndex },
            contents: saveDocument
        });
        actions[actionIndex].documents[docIndex].current.confidential = confidentialIndex;
        if(actions[actionIndex].documents[docIndex].current.confidential == 0 && actions[actionIndex].documents[docIndex].current.category == 0)
            actions[actionIndex].documents[docIndex].current.status = "accept";
        else
            actions[actionIndex].documents[docIndex].current.status = "editing";
        var setUpdate = update(this.state,{
            stackChange: {$set:  stackList },
            Actions: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdate: { name: 'updateConfidential', actionIndex: actionIndex, docIndex: docIndex, confidentialIndex: confidentialIndex }}); 
    },
    checkedNumber: function(actionIndex) {
        var actions = this.state.Actions;
        var num = 0;
        for(var i = 0; i < actions[actionIndex].documents.length; i++) {
            if(actions[actionIndex].documents[i].current.checked === true) {
                num++;
            }
        }
        actions[actionIndex].checkedNumber = num;
        this.setState(update(this.state, {
            Actions: {$set: actions }
        }));
        this.setState({shouldUpdate: { name: 'checkedNumber', actionIndex: actionIndex }}); 
    },
    onClickCheckbox: function(event, actionIndex, docIndex) {
        var checked = event.target.checked;
        var actions = this.state.Actions;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: { actionIndex: actionIndex,docIndex: docIndex },
            contents: saveDocument
        });
        actions[actionIndex].documents[docIndex].current.checked = checked;
        var setUpdate = update(this.state,{
            stackChange: {$set: stackList },
            Actions: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdate: {name: 'updateCheckBox', actionIndex: actionIndex, docIndex: docIndex, checked: checked}});
    },
    validateNumber: function(actionIndex) {
        var actions = this.state.Actions;
        var num = 0;
        for(var i = 0; i < actions[actionIndex].documents.length; i++) {
            if(actions[actionIndex].documents[i].current.status === "editing" || actions[actionIndex].documents[i].current.status === "accept") {
                num++;
            }
        }
        actions[actionIndex].validateNumber = num;
        this.setState(update(this.state, {
            Actions: {$set: actions }
        }));
        this.setState({shouldUpdate: { name: 'validateNumber',  actionIndex:  actionIndex, number: num}});
    },
    onClickValidationButton: function(event, actionIndex, docIndex) {
        var actions = this.state.Actions;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: { actionIndex: actionIndex, docIndex: docIndex },
            contents: saveDocument
        });
        actions[actionIndex].documents[docIndex].current.status = "accept";
        var setUpdate = update(this.state,{
            stackChange: {$set: stackList },
            Actions: {$set: actions}
        });
        $.ajax({
            url: Constant.SERVER_API + 'api/review/documents/',
            type: 'PUT',
            dataType: 'Json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            data: JSON.stringify({
                    "id": "1",
                    "documents": [
                        {
                            "id": "document_id",
                            "category": {
                                "name": "tax",
                                "confidence_level": 10
                            },
                            "confidentiality": {
                                "name": "secret",
                                "confidence_level": 10
                            }
                        }
                    ]
                })
        })
        .done(function(data) {
            console.log("success", data);
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
        
        this.setState(setUpdate);
        this.setState({shouldUpdate: { name: 'updateValidate', actionIndex: actionIndex, docIndex: docIndex, status: 'accept' }});
        //debugger;
    },
    approveButon: function(actionIndex) {
        var actions = this.state.Actions;
        var approveIndex = '';
        for(var i = 0; i < actions[actionIndex].documents.length; i++) {
            if(actions[actionIndex].documents[i].current.checked === true) {
                actions[actionIndex].documents[i].current.status = "accept";
                actions[actionIndex].documents[i].current.checked = false;
                approveIndex += "_" + i;
            }
        }
        actions[actionIndex].checkAll = false;
        var setUpdate = update(this.state,{
            Actions: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdate: {name: 'approveButon', actionIndex: actionIndex, listApprove: approveIndex }});
    },
    checkAllButton: function(event, actionIndex) {
        var checked = event.target.checked;
        var actions = this.state.Actions;
        for (var i = 0; i < actions[actionIndex].documents.length; i++) {
            actions[actionIndex].documents[i].current.checked = checked;
        }
        actions[actionIndex].checkAll = checked;
        var setUpdate = update(this.state,{
            Actions: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdate: {name: 'updateCheckAll', actionIndex: actionIndex, checked: checked }});
    },
    undoHandle: function() {
        console.log('stackChange' , this.state.stackChange);
        if(this.state.stackChange.length > 0) {
            var newStackChange = this.state.stackChange;
            var actions = this.state.Actions;
            var documentOld = newStackChange[this.state.stackChange.length - 1];
            actions[documentOld.index.actionIndex].documents[documentOld.index.docIndex] = documentOld.contents;
            newStackChange.pop();
            var setUpdate = update(this.state, {
                Actions: {$set: actions },
                stackChange: {$set: newStackChange },
                documentPreview: {$set: actions[documentOld.index.actionIndex].documents[documentOld.index.docIndex] }
            });
            this.setState(setUpdate);
            this.setState({shouldUpdate: { name: 'undoAction', actionIndex:documentOld.index.actionIndex, docIndex: documentOld.index.docIndex, stack: newStackChange.length }})
        }
    },
    urgency: function(value) {
        for(var i = 0; i < Constant.urgency.length; i++) {
            if(value == Constant.urgency[i].name) {
                return Constant.urgency[i]['class'];
            }
        }
    },
    alertClose: function() {
        $(".alert-close[data-hide]").closest(".alert-success").hide();
    },
    cutPath: function(str) {
        if(str.length > 0) {
            return str.substring(0,str.lastIndexOf('/') + 1);
        }
    },


    //Challenged Document
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
                console.log('dataaaattt', data);
                for(var i = 0; i < data.length; i++) {
                    data[i].checkAll = false;
                    data[i].checkedNumber = 0;
                    data[i].validateNumber = 0;
                    for(var j = 0; j < data[i].documents.length; j++) {
                        data[i].documents[j].current = {
                            checked: false,
                            category: 4,
                            confidential: 0,
                            status: "normal",
                            comment: 'Explain your choice',
                            prevCategory: null,
                            prevConfidential: null
                        };
                    }
                }
                var challengedPreview = data[0].documents[0];
                challengedPreview.index = {actionIndex: 0, docIndex: 0 };
                var updateState = update(this.state, {
                    ChallengedDocuments: {$set: data},
                    challengedPreview: {$set: challengedPreview}
                });
                this.setState(updateState);
                debugger;
                console.log("Doc ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    setChallengedPreview: function(challengedIndex, docChallIndex) {
        var challengedCurrent = this.state.ChallengedDocuments[challengedIndex].documents[docChallIndex];
        challengedCurrent.index = { actionIndex: challengedIndex, docIndex: docChallIndex }
        var setChallengedCurrent = update(this.state, {
            challengedPreview: { $set: challengedCurrent },
        });
        this.setState(setChallengedCurrent);
    },
    onChangeCategoryChallenged: function(event, actionIndex, docIndex) {
        var categoryIndex = event.target.value;
        var actions = this.state.ChallengedDocuments;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChangeChallenged;
        stackList.push({
            index: { actionIndex: actionIndex,docIndex: docIndex },
            contents: saveDocument
        });
        if(actions[actionIndex].documents[docIndex].current.prevCategory == null) {
            actions[actionIndex].documents[docIndex].current.prevCategory = actions[actionIndex].documents[docIndex].current.category;
        }
        if(actions[actionIndex].documents[docIndex].current.prevCategory == categoryIndex){
            actions[actionIndex].documents[docIndex].current.prevCategory = null;
            actions[actionIndex].documents[docIndex].current.status = "accept";
        } else {
            actions[actionIndex].documents[docIndex].current.status = "editing";
        }
        actions[actionIndex].documents[docIndex].current.category = categoryIndex;
        /*if(actions[actionIndex].documents[docIndex].current.confidential == 0 && actions[actionIndex].documents[docIndex].current.category == 0)
            actions[actionIndex].documents[docIndex].current.status = "accept";
        else
            actions[actionIndex].documents[docIndex].current.status = "editing";*/
        this.setState(update(this.state,{
            stackChangeChallenged: {$set: stackList },
            ChallengedDocuments: {$set: actions }
        }));
        this.setState({shouldUpdateChall: { name: 'updateCategory', actionIndex:  actionIndex, docIndex: docIndex, categoryIndex: categoryIndex}});
    },
    onChangeConfidentialChallenged: function(event, actionIndex, docIndex) {
        var confidentialIndex = event.target.value;
        var actions = this.state.ChallengedDocuments;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChangeChallenged;
        stackList.push({
            index: { actionIndex: actionIndex, docIndex: docIndex },
            contents: saveDocument
        });
        if(actions[actionIndex].documents[docIndex].current.prevConfidential == null) {
            actions[actionIndex].documents[docIndex].current.prevConfidential = actions[actionIndex].documents[docIndex].current.confidential;
        }
        if(actions[actionIndex].documents[docIndex].current.prevConfidential == confidentialIndex) {
            actions[actionIndex].documents[docIndex].current.prevConfidential = null;
            actions[actionIndex].documents[docIndex].current.status = "accept";
        } else {
            debugger;
            actions[actionIndex].documents[docIndex].current.status = "editing";
        }
        debugger;
        actions[actionIndex].documents[docIndex].current.confidential = confidentialIndex;
        /*if(actions[actionIndex].documents[docIndex].current.confidential == 0 && actions[actionIndex].documents[docIndex].current.category == 0)
            actions[actionIndex].documents[docIndex].current.status = "accept";
        else
            actions[actionIndex].documents[docIndex].current.status = "editing";*/
        var setUpdate = update(this.state,{
            stackChangeChallenged: {$set:  stackList },
            ChallengedDocuments: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdateChall: { name: 'updateConfidentialChall', actionIndex: actionIndex, docIndex: docIndex, confidentialIndex: confidentialIndex }}); 
    },
    checkedNumberChallenged: function(actionIndex) {
        var actions = this.state.ChallengedDocuments;
        var num = 0;
        for(var i = 0; i < actions[actionIndex].documents.length; i++) {
            if(actions[actionIndex].documents[i].current.checked === true) {
                num++;
            }
        }
        actions[actionIndex].checkedNumber = num;
        this.setState(update(this.state, {
            ChallengedDocuments: {$set: actions }
        }));
        this.setState({shouldUpdateChall: { name: 'checkedNumber', actionIndex: actionIndex }}); 
    },
    onClickCheckboxChallenged: function(event, actionIndex, docIndex) {
        var checked = event.target.checked;
        var actions = this.state.ChallengedDocuments;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChangeChallenged;
        stackList.push({
            index: { actionIndex: actionIndex,docIndex: docIndex },
            contents: saveDocument
        });
        actions[actionIndex].documents[docIndex].current.checked = checked;
        var setUpdate = update(this.state,{
            stackChangeChallenged: {$set: stackList },
            ChallengedDocuments: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdateChall: {name: 'updateCheckBox', actionIndex: actionIndex, docIndex: docIndex, checked: checked}});
    },
    validateNumberChallenged: function(actionIndex) {
        var actions = this.state.ChallengedDocuments;
        var num = 0;
        for(var i = 0; i < actions[actionIndex].documents.length; i++) {
            if(actions[actionIndex].documents[i].current.status === "editing" || actions[actionIndex].documents[i].current.status === "accept") {
                num++;
            }
        }
        actions[actionIndex].validateNumber = num;
        this.setState(update(this.state, {
            ChallengedDocuments: {$set: actions }
        }));
        this.setState({shouldUpdateChall: { name: 'validateNumber',  actionIndex:  actionIndex, number: num}});
    },
    onClickValidationButtonChallenged: function(event, actionIndex, docIndex) {
        var actions = this.state.ChallengedDocuments;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChangeChallenged;
        stackList.push({
            index: { actionIndex: actionIndex, docIndex: docIndex },
            contents: saveDocument
        });
        if(actions[actionIndex].documents[docIndex].current.prevConfidential != null) {
            actions[actionIndex].documents[docIndex].current.prevConfidential = null;
        }
        if(actions[actionIndex].documents[docIndex].current.prevCategory != null) {
            actions[actionIndex].documents[docIndex].current.prevCategory = null;
        }
        actions[actionIndex].documents[docIndex].current.status = "accept";
        var setUpdate = update(this.state,{
            stackChangeChallenged: {$set: stackList },
            ChallengedDocuments: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdateChall: { name: 'updateValidate', actionIndex: actionIndex, docIndex: docIndex, status: 'accept' }});
        //debugger;
    },
    approveButonChallenged: function(actionIndex) {
        var actions = this.state.ChallengedDocuments;
        var approveIndex = '';
        for(var i = 0; i < actions[actionIndex].documents.length; i++) {
            if(actions[actionIndex].documents[i].current.checked === true) {
                actions[actionIndex].documents[i].current.status = "accept";
                actions[actionIndex].documents[i].current.checked = false;
                approveIndex += "_" + i;
            }
        }
        actions[actionIndex].checkAll = false;
        var setUpdate = update(this.state,{
            ChallengedDocuments: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdateChall: {name: 'approveButon', actionIndex: actionIndex, listApprove: approveIndex }});
    },
    checkAllButtonChallenged: function(event, actionIndex) {
        var checked = event.target.checked;
        var actions = this.state.ChallengedDocuments;
        for (var i = 0; i < actions[actionIndex].documents.length; i++) {
            actions[actionIndex].documents[i].current.checked = checked;
        }
        actions[actionIndex].checkAll = checked;
        var setUpdate = update(this.state,{
            ChallengedDocuments: {$set: actions}
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdateChall: {name: 'updateCheckAll', actionIndex: actionIndex, checked: checked }});
    },
    undoHandleChallenged: function() {

        console.log('stackChange' , this.state.stackChangeChallenged);
        if(this.state.stackChangeChallenged.length > 0) {
            var newStackChange = this.state.stackChangeChallenged;
            var actions = this.state.ChallengedDocuments;
            var documentOld = newStackChange[this.state.stackChangeChallenged.length - 1];
            actions[documentOld.index.actionIndex].documents[documentOld.index.docIndex] = documentOld.contents;
            newStackChange.pop();
            var setUpdate = update(this.state, {
                ChallengedDocuments: {$set: actions },
                stackChangeChallenged: {$set: newStackChange },
                challengedPreview: {$set: actions[documentOld.index.actionIndex].documents[documentOld.index.docIndex] }
            });
            this.setState(setUpdate);
            this.setState({shouldUpdateChall: { name: 'undoActionChallenged', actionIndex:documentOld.index.actionIndex, docIndex: documentOld.index.docIndex, stack: newStackChange.length }})
        }
        debugger;
    },
    render:template
});
module.exports = DocumentReview;