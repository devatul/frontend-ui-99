import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import template from './DocumentReview.rt'
import update from 'react-addons-update'
import Constant from '../Constant.js'
import loadScript from '../script/load.scripts.js';
import { makeRequest } from '../utils/http'
import 'jquery'

var DocumentReview = React.createClass({
    getInitialState() {
        return {

            Actions: null,
            Action1: null,
            ChallengedDocuments: [],
            documentPreview: null,
            challengedPreview: null,
            shouldUpdate: {
                type: '',
                value: []
            },
            shouldUpdateChall: null,
            stackChange: [],
            oldActions: [],
            oldReview : [],
            undo: '',
            confidentialities: [],
            categories: [],
            stackChangeChallenged: [],
            icon: [],
            iconChallengedDocument: [],
            iconReview: '',
            iconChallengedPreview: '',

        };
    },
    componentWillMount() {
        /*   this.getActions();*/

        //this.getDummyAction()
        this.getActions()
    },
    componentDidMount() {
        this.getCategories();
        this.getConfidentialities();
        // this.getDummyChalengge();
        this.getChallengedDocument();


    },
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.Actions != nextState.Actions) {
            return true
        }
        if (this.state.documentOld != nextState.documentOld) {
            return true
        }
        if (this.state.documentPreview != nextState.documentPreview) {
            return true;
        }
        if (this.state.confidentialities != nextState.confidentialities) {
            return true
        }
        if (this.state.categories != nextState.categories) {
            return true
        }
        if (this.state.ChallengedDocuments != nextState.ChallengedDocuments) {
            return true;
        }

        if (this.state.challengedPreview != nextState.challengedPreview) {
            return true;
        }
        if (this.state.shouldUpdate != nextState.shouldUpdate) {
            return true;
        }
        if (this.state.shouldUpdateChall != nextState.shouldUpdateChall) {
            return true;
        }

        return false;
    },
    componentDidUpdate(prevProps, prevState) {

        if (this.state.shouldUpdate != prevState.shouldUpdate) {
            var update = this.state.shouldUpdate.value;
            this.setState({ documentPreview: this.state.Actions[update[0]].documents[1] })
        }
        if (this.state.oldActions != prevState.oldActions) {
            this.setState({ stackChange: this.state.oldActions })
        }
        if (this.state.ChallengedDocuments != prevState.ChallengedDocuments) {
            console.log('ChallengedDocuments', this.state.ChallengedDocuments);
            console.log('challengedPreview', this.state.challengedPreview);
            $('.select-group select').focus(function() {
                var selectedRow = $(this).parents('tr');
                $('.table-my-actions tr').each(function() {
                    if (!$(this).find('.checkbox-item').prop('checked')) {
                        $(this).addClass('inactive');
                    }
                });
                selectedRow.removeClass('inactive');
            });

            $('.select-group select').blur(function() {
                $('.table-my-actions tr').removeClass('inactive');
            });
            $('.file-name-1[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner large" style="max-width: 500px; width: auto;"></div></div>'
            });
            $("a.more").click(function() {
                $(this).prev().toggleClass("height-2nd");
                $(this).children(".more1").toggleClass("display-none");
                $(this).children(".zoom-out").toggleClass("zoom-out-block");
            });
            $(".my-doc-path").each(function(index) {
                var hi = "18";
                var h = $(this).height();
                if (h > hi) {
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
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                if(!data.length) {
                    return;
                }
                for (let i = data.length - 1; i >= 0; i--) {
                    data[i].validateNumber = 0;
                    data[i].checkedNumber = 0;
                    data[i].checkedAll = false;
                    data[i].docLength = data[i].documents.length
                    for (let j = data[i].documents.length - 1; j >= 0; j--) {
                        data[i].documents[j].color = this.progressbar(data[i].documents[j].centroid_distance, data[i].documents[j].group_avg_centroid_distance, data[i].documents[j].group_max_centroid_distance, data[i].documents[j].group_min_centroid_distance);
                        data[i].documents[j].checked = false;
                        data[i].documents[j].status = 'normal';
                        data[i].documents[j].icon = this.getIcon(data[i].documents[j].name)
                    }
                }
                debugger
                var documentPreview = data[0].documents[0];
                documentPreview.index = { actionIndex: 0, docIndex: 0 };
                var oldActions = []
                oldActions.push(data)
                    /*  var updateState = update(this.state, {
                                Actions: { $set: data },
                                documentPreview: { $set: documentPreview },
                                icon: { $set: listIcon }
                            });*/
                this.setState({ Actions: data });
                this.setState({ Action1: data });
                /* this.setState({oldActions : oldActions})*/
                this.setState({ documentPreview: documentPreview })
                
                
                /*console.log('dataaaa', data);
                data[0].category = "Legal/Compliance/ Secret";
                data[0].urgency = "very high";

                data[1].category = "Legal/Compliance/ Confidential";
                data[1].urgency = "high";
                var listIcon = [];
                for (var i = 0; i < data.length; i++) {
                    data[i].checkAll = false;
                    data[i].checkedNumber = 0;
                    data[i].validateNumber = 0;
                    for (var j = 0; j < data[i].documents.length; j++) {
                        listIcon.push({
                            'type': this.getIcon(data[i].documents[j].name)
                        });

                        data[i].documents[j].confidential_confidence_level = Math.floor(Math.random() * (99 - 70 + 1) + 40);
                        data[i].documents[j].confidence_level = Math.floor(Math.random() * (99 - 70 + 1) + 25);
                        data[i].documents[j].current = {
                            checked: false,
                            category: 4,
                            confidential: 1,
                            status: "normal"
                        };
                    }
                }
                console.log('listIcon', listIcon)

                var documentPreview = data[0].documents[0];
                console.log('documentPreview', documentPreview)
                documentPreview.index = { actionIndex: 0, docIndex: 0 };
                var updateState = update(this.state, {
                    Actions: { $set: data },
                    documentPreview: { $set: documentPreview },
                    icon: { $set: listIcon }
                });
                this.setState(updateState);
                console.log("Documents ok: ", data);*/
            }.bind(this),
            error: function(xhr, error) {
                console.log("Documents error: " + error);
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getDummyAction() {
        let data = [{
            "language": {
                "id": 1,
                "short_name": "EN",
                "name":"English"
            },
            "category": {
                "id": 1,
                "name": "Accounting/Tax"
            },
            "confidentiality": {
                "id": 1,
                "name": "Banking Secrecy"
            },
            /* "category": "legal",
             "confidentiality": "secret",*/
            "urgency": "very high",
            "latest_date": "5 July",
            "documents": [{
                    "name": "doc_name.doc",
                    "path": "doc_path",
                    "owner": "owner_name",
                    "category": {
                        "id": 1,
                        "name": "Accounting/Tax"
                    },
                    "confidentiality": {
                        "id": 1,
                        "name": "Banking Secrecy"
                    },
                    "confidence_level": 40,
                    "centroid_distance": 1.5,
                    "group_min_centroid_distance": 1.6,
                    "group_max_centroid_distance": 2,
                    "group_avg_centroid_distance": 2,
                    "image_url": "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                    "creation_date": "2012-04-23",
                    "modification_date": "2012-04-23",
                    "legal_retention_until": "2012-04-23",
                    "confidentiality_label": "yes/no",
                    "number_of_classification_challenge": 1
                },

                {
                    "name": "doc_name.xls",
                    "path": "doc_path",
                    "owner": "owner_name",
                    "category": {
                        "id": 1,
                        "name": "Accounting/Tax"
                    },
                    "confidentiality": {
                        "id": 1,
                        "name": "Banking Secrecy"
                    },
                    "confidence_level": 40,
                    "centroid_distance": 1.5,
                    "group_min_centroid_distance": 1.6,
                    "group_max_centroid_distance": 2,
                    "group_avg_centroid_distance": 2,
                    "image_url": "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                    "creation_date": "2012-04-23",
                    "modification_date": "2012-04-23",
                    "legal_retention_until": "2012-04-23",
                    "confidentiality_label": "yes/no",
                    "number_of_classification_challenge": 1
                }, {
                    "name": "doc_name",
                    "path": "doc_path",
                    "owner": "owner_name",
                    "category": {
                        "id": 1,
                        "name": "Accounting/Tax"
                    },
                    "confidentiality": {
                        "id": 1,
                        "name": "Banking Secrecy"
                    },
                    "confidence_level": 40,
                    "centroid_distance": 1.5,
                    "group_min_centroid_distance": 1.6,
                    "group_max_centroid_distance": 2,
                    "group_avg_centroid_distance": 2,
                    "image_url": "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                    "creation_date": "2012-04-23",
                    "modification_date": "2012-04-23",
                    "legal_retention_until": "2012-04-23",
                    "confidentiality_label": "yes/no",
                    "number_of_classification_challenge": 1
                }
            ]
        }, {
            "language": {
                "id": 1,
                "short_name": "EN",
                "name":"English"
            },
            "category": {
                "id": 1,
                "name": "Accounting/Tax"
            },
            "confidentiality": {
                "id": 1,
                "name": "Banking Secrecy"
            },
            /*"category": "legal",
            "confidentiality": "confidential",*/
            "urgency": "high",
            "latest_date": "5 July",
            "documents": [{
                "name": "doc_name",
                "path": "doc_path",
                "owner": "owner_name",
                "category": {
                    "id": 1,
                    "name": "Accounting/Tax"
                },
                "confidentiality": {
                    "id": 1,
                    "name": "Banking Secrecy"
                },
                "confidence_level": 40,
                "centroid_distance": 1.5,
                "group_min_centroid_distance": 1.6,
                "group_max_centroid_distance": 2,
                "group_avg_centroid_distance": 2,
                "image_url": "http://54.254.145.121/static/orphan/01/IonaTechnologiesPlcG07.doc",
                "creation_date": "2012-04-23",
                "modification_date": "2012-04-23",
                "legal_retention_until": "2012-04-23",
                "confidentiality_label": "yes/no",
                "number_of_classification_challenge": 1
            }]
        }]

        for (let i = data.length - 1; i >= 0; i--) {
            data[i].validateNumber = 0;
            data[i].checkedNumber = 0;
            data[i].checkedAll = false;
            data[i].docLength = data[i].documents.length
            for (let j = data[i].documents.length - 1; j >= 0; j--) {
                data[i].documents[j].color = this.progressbar(data[i].documents[j].centroid_distance, data[i].documents[j].group_avg_centroid_distance, data[i].documents[j].group_max_centroid_distance, data[i].documents[j].group_min_centroid_distance);
                data[i].documents[j].checked = false;
                data[i].documents[j].status = 'normal';
                data[i].documents[j].icon = this.getIcon(data[i].documents[j].name)
            }
        }
        debugger
        var documentPreview = data[0].documents[0];
        documentPreview.index = { actionIndex: 0, docIndex: 0 };
        var oldActions = []
        oldActions.push(data)
            /*  var updateState = update(this.state, {
                         Actions: { $set: data },
                         documentPreview: { $set: documentPreview },
                         icon: { $set: listIcon }
                     });*/
        this.setState({ Actions: data });
        this.setState({ Action1: data });
        /* this.setState({oldActions : oldActions})*/
        this.setState({ documentPreview: documentPreview })
            /*console.log(this.state)*/
    },

    setDocumentPreview: function(actionIndex, docIndex) {


        /*   loadScript("/assets/vendor/gdocsviewer/jquery.gdocsviewer.min.js")*/
        var documentCurrent = this.state.Actions[actionIndex].documents[docIndex];
        if (documentCurrent != null) {
            documentCurrent.index = { actionIndex: actionIndex, docIndex: docIndex };
            var setDocumentCurrent = update(this.state, {
                documentPreview: { $set: documentCurrent },

            });
            $('#previewModal .file-preview').html('<a href="' + documentCurrent.image_url + '" id="embedURL"></a>');
            $('#embedURL').gdocsViewer();
            /*  loadScript("/assets/vendor/gdocsviewer/jquery.gdocsviewer.min.js", function() {
             */

            //get data-id attribute of the clicked element


            /*      $('#previewModal .file-preview').html('<a href="'+fileURL+'" id="embedURL"></a>');
                  $('#embedURL').gdocsViewer();*/
            /* }).bind(this);*/

            /* $('#previewModal .file-preview').html('<a href="' + documentCurrent.image_url + '" id="embedURL"></a>');
             $('#embedURL').gdocsViewer();*/
        }
        this.setState(setDocumentCurrent)

        /* this.setState({ iconReview: icon })*/

    },
    setChallengedPreview: function(challengedIndex, docChallIndex) {
        debugger
        var challengedCurrent = this.state.ChallengedDocuments[challengedIndex].documents[docChallIndex];
        if (challengedCurrent != null) {
            challengedCurrent.index = { actionIndex: challengedIndex, docIndex: docChallIndex }
            var setChallengedCurrent = update(this.state, {
                challengedPreview: { $set: challengedCurrent },
            });
            this.setState(setChallengedCurrent);

            $('#previewModal3 .file-preview').html('<a href="' + challengedCurrent.image_url + '" id="embedURL3"></a>');
            $('#embedURL3').gdocsViewer();
        }
    },

    progressbar: function(value, value1, value2, value3) {
        var valueX = value2 - value3
        if (value < value1) {
            return 'progress-bar-success'
        }
        if (value1 < value < 2 * valueX / 3) {
            return 'progress-bar-warning'
        }
        if (value > 2 / 3 * valueX) {
            return 'progress-bar-danger'
        }
    },
    onChangeCategory: function(event, actionIndex, docIndex) {
        debugger
        var valueChange = [actionIndex, docIndex]
        var categoryIndex = event.target.value;
        /*var categoryID = this.getIDCategory(categoryIndex);*/
        for(var i =0; i< this.state.categories.length ; i++){
            if(categoryIndex == this.state.categories[i].name){
                var categoryID = this.state.categories[i].id
            }
        }
        var status = ''

        var action1 = this.state.Action1;

        var stackList = [];
        var actions = _.cloneDeep(this.state.Actions);
        if (this.state.oldActions != null) {
            stackList = _.cloneDeep(this.state.oldActions)

        }
        stackList.push(
            {
                docID : docIndex,
                contents : actions
            }
        )

        if (categoryIndex == action1[actionIndex].documents[docIndex].category.name) {
            status = 'accept'
        } else {
            status = 'editing'
        }


        var updateCategory = update(this.state, {
            Actions: {
                [actionIndex]: {
                    documents: {
                        [docIndex]: {
                            status: { $set: status },
                            category: {
                                id : {$set : categoryID},
                                name: { $set: categoryIndex }
                            }
                        }

                    }
                }
            },
            documentPreview: {

                category: {
                    id : {$set : categoryID},
                    name: { $set: categoryIndex }
                },
                status: { $set: status },

            },
            oldActions: { $set: stackList }

        })
        this.setState(updateCategory)
    },
    onChangeConfidential: function(event, actionIndex, docIndex) {
        debugger
        var categoryIndex = event.target.value;
        var status = ''
        var action1 = this.state.Action1;
        var stackList = [];
        for(var i =0; i< this.state.confidentialities.length ; i++){
            if(categoryIndex == this.state.confidentialities[i].name){
                var categoryID = this.state.confidentialities[i].id
            }
        }
        var actions = _.cloneDeep(this.state.Actions);
        if (this.state.oldActions != null) {
            stackList = _.cloneDeep(this.state.oldActions)

        }
        stackList.push(
            {
                docID : docIndex,
                contents : actions
            }
        )
        if (categoryIndex == action1[actionIndex].documents[docIndex].confidentiality.name) {
            status = 'accept'
        } else {
            status = 'editing'
        }
        var updateCategory = update(this.state, {
            Actions: {
                [actionIndex]: {
                    documents: {
                        [docIndex]: {
                            status: { $set: status },
                            confidentiality: {
                                id : {$set : categoryID},
                                name: { $set: categoryIndex }
                            }
                        }
                    }
                }
            },
            documentPreview: {

                confidentiality: {
                    id : {$set : categoryID},
                    name: { $set: categoryIndex }
                },
                status: { $set: status },

            },
            oldActions: { $set: stackList }
        })
        this.setState(updateCategory)
            /*console.log('actionIndex: ', actionIndex)
            console.log('docIndex: ', docIndex)
            var confidentialIndex = event.target.value;
            var actions = this.state.Actions;
            var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
            console.log('saveDocument', saveDocument)
            console.log('stackList', this.state.stackList)
            var stackList = this.state.stackChange;
            stackList.push({
                index: { actionIndex: actionIndex, docIndex: docIndex },
                contents: saveDocument
            });
            console.log('stackList', stackList)
            actions[actionIndex].documents[docIndex].current.confidential = confidentialIndex;
            console.log("confidentialIndex", confidentialIndex)
            if (actions[actionIndex].documents[docIndex].current.confidential == 1) {
                actions[actionIndex].documents[docIndex].current.status = "accept";
            } else {
                actions[actionIndex].documents[docIndex].current.status = "editing";
            }

            var setUpdate = update(this.state, {
                stackChange: { $set: stackList },
                Actions: { $set: actions }
            });
            this.setState(setUpdate);
            this.setState({ shouldUpdate: { name: 'updateConfidential', actionIndex: actionIndex, docIndex: docIndex, confidentialIndex: confidentialIndex } });*/
    },
    checkedNumber: function(actionIndex) {
        var actions = this.state.Actions;
        var num = 0;
        for (var i = 0; i < actions[actionIndex].documents.length; i++) {
            if (actions[actionIndex].documents[i].current.checked === true) {
                num++;
            }
        }
        actions[actionIndex].checkedNumber = num;
        this.setState(update(this.state, {
            Actions: { $set: actions }
        }));
        this.setState({ shouldUpdate: { name: 'checkedNumber', actionIndex: actionIndex } });
    },
    onClickCheckbox: function(event, actionIndex, docIndex) {
        debugger
        var documentPreview = _.cloneDeep(this.state.documentPreview)
            /*var valueChange = [actionIndex , docIndex]*/

        var checked = event.target.checked;
        var stackList = [];


        var actions = _.cloneDeep(this.state.Actions);

        if (this.state.oldActions != null) {
            stackList = _.cloneDeep(this.state.oldActions)

        }

        stackList.push(
            {
                docID : docIndex,
                contents : actions
            }
        )


        if (checked == true) {
            var numberCheck = this.state.Actions[actionIndex].checkedNumber + 1
        } else {
            var numberCheck = this.state.Actions[actionIndex].checkedNumber - 1
        }

        /* var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
         var stackList = this.state.stackChange;
         stackList.push({
             index: { actionIndex: actionIndex, docIndex: docIndex },
             contents: saveDocument
         });
         actions[actionIndex].documents[docIndex].current.checked = checked;*/
        var setUpdate = update(this.state, {
            /* stackChange: { $set: stackList },*/

            Actions: {
                [actionIndex]: {
                    checkedNumber: { $set: numberCheck },
                    documents: {
                        [docIndex]: {
                            checked: { $set: checked }
                        }
                    }
                }
            },
            documentPreview: {
                checked: { $set: checked }
            },
            /*shouldUpdate : {
               type: {$set : 'checkbox'},
               value : {$set : valueChange}

            },*/
            oldActions: { $set: stackList }
        });

        this.setState(setUpdate);
        /*this.setState({ shouldUpdate: { name: 'updateCheckBox', actionIndex: actionIndex, docIndex: docIndex, checked: checked } });*/

    },
    validateNumber: function(actionIndex) {
        var actions = this.state.Actions;
        var num = 0;
        for (var i = 0; i < actions[actionIndex].documents.length; i++) {
            if (actions[actionIndex].documents[i].current.status === "editing" || actions[actionIndex].documents[i].current.status === "accept") {
                num++;
            }
        }
        actions[actionIndex].validateNumber = num;
        this.setState(update(this.state, {
            Actions: { $set: actions }
        }));
        this.setState({ shouldUpdate: { name: 'validateNumber', actionIndex: actionIndex, number: num } });
    },
    onClickValidationButton: function(event, actionIndex, docIndex) {
        debugger
        this.postDocument(actionIndex, docIndex);
        var valueChange = [actionIndex, docIndex]
        var docLength = this.state.Actions[actionIndex].docLength
        if (docLength > 0) {
            docLength = this.state.Actions[actionIndex].docLength - 1
        }
        var stackList = []
        var checked = event.target.checked;
        var actions = _.cloneDeep(this.state.Actions);
        if (this.state.oldActions != null) {
            stackList = _.cloneDeep(this.state.oldActions)

        }

        stackList.push(
            {
                docID : docIndex,
                contents : actions
            }
        )

        /* var actions = this.state.Actions;
         var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
         var stackList = this.state.stackChange;
         stackList.push({
             index: { actionIndex: actionIndex, docIndex: docIndex },
             contents: saveDocument
         });
         actions[actionIndex].documents[docIndex].current.status = "accept";
         var setUpdate = update(this.state, {
             stackChange: { $set: stackList },
             Actions: { $set: actions }
         });
         $.ajax({
                 url: Constant.SERVER_API + 'api/review/documents/',
                 type: 'PUT',
                 dataType: 'Json',
                 beforeSend: function(xhr) {
                     xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
                 },
                 data: JSON.stringify({
                     "id": "1",
                     "documents": [{
                         "id": "document_id",
                         "category": {
                             "name": "tax",
                             "confidence_level": 10
                         },
                         "confidentiality": {
                             "name": "secret",
                             "confidence_level": 10
                         }
                     }]
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
         this.setState({ shouldUpdate: { name: 'updateValidate', actionIndex: actionIndex, docIndex: docIndex, status: 'accept' } });*/
        //debugger;

        if (this.state.documentPreview != undefined) {
            var setUpdate = update(this.state, {
                /* stackChange: { $set: stackList },*/

                Actions: {
                    [actionIndex]: {
                        docLength: { $set: docLength },
                        documents: {
                            [docIndex]: {
                                status: { $set: 'accept' }
                            }
                        }
                    }
                },

                documentPreview: {

                    status: { $set: 'accept' }
                },
                oldActions: { $set: stackList }


            });
        } else {
            var setUpdate = update(this.state, {
                /* stackChange: { $set: stackList },*/

                Actions: {
                    [actionIndex]: {
                        docLength: { $set: docLength },
                        documents: {
                            [docIndex]: {
                                status: { $set: 'accept' }
                            }
                        }
                    }
                },
                oldActions: { $set: stackList }


            });
        }

        this.setState(setUpdate);

    },
    approveButon: function(actionIndex) {

        var actions = _.cloneDeep(this.state.Actions);
        if ((actions[actionIndex].docLength > 0)) {
            var docLength = actions[actionIndex].docLength - 1
        }
        /* var approveIndex = '';
         for (var i = 0; i < actions[actionIndex].documents.length; i++) {
             if (actions[actionIndex].documents[i].current.checked === true) {
                 actions[actionIndex].documents[i].current.status = "accept";
                 actions[actionIndex].documents[i].current.checked = false;
                 approveIndex += "_" + i;
             }
         }
         actions[actionIndex].checkAll = false;
         var setUpdate = update(this.state, {
             Actions: { $set: actions }
         });
         this.setState(setUpdate);
         this.setState({ shouldUpdate: { name: 'approveButon', actionIndex: actionIndex, listApprove: approveIndex } });*/
        if (actions[actionIndex].checkedNumber == actions[actionIndex].documents.length) {

            for (let i = 0; i < actions[actionIndex].documents.length; i++) {

                actions[actionIndex].checkedNumber = 0
                actions[actionIndex].docLength = 0
                actions[actionIndex].checkedAll = false
                actions[actionIndex].documents[i].checked = false
                actions[actionIndex].documents[i].status = 'accept'

            }
            this.setState({ Actions: actions })

        } else {
            for (let i = 0; i < actions[actionIndex].documents.length; i++) {

                if (actions[actionIndex].documents[i].checked == true && actions[actionIndex].documents[i].status != 'accept') {
                    /*  var updateApprove = update(this.state, {
                          Actions: {
                              [actionIndex]: {
                                  checkedNumber: { $set: 0 },
                                  docLength: { $set: docLength },
                                  documents: {
                                      [i]: {
                                          checked: { $set: false },
                                          status: { $set: 'accept' }
                                      }
                                  }
                              }
                          }
                      })*/
                    actions[actionIndex].checkedNumber = 0
                    actions[actionIndex].checkedAll = false
                    actions[actionIndex].documents[i].checked = false,
                        actions[actionIndex].documents[i].status = 'accept'
                }

            }
            this.setState({ Actions: actions })
        }
    },
    checkAllButton: function(event, actionIndex) {

        var checked = event.target.checked;
        var actions = _.cloneDeep(this.state.Actions);
        var length = actions[actionIndex].documents.length
            /*  for (var i = 0; i < actions[actionIndex].documents.length; i++) {
                  actions[actionIndex].documents[i].current.checked = checked;
              }
              actions[actionIndex].checkAll = checked;
              var setUpdate = update(this.state, {
                  Actions: { $set: actions }
              });
              this.setState(setUpdate);
              this.setState({ shouldUpdate: { name: 'updateCheckAll', actionIndex: actionIndex, checked: checked } });*/
        actions[actionIndex].checkedAll = checked;
        if (checked == true) {

            actions[actionIndex].checkedNumber = length;
        } else {
            actions[actionIndex].checkedNumber = 0;
        }

        for (let i = 0; i < length; i++) {

            actions[actionIndex].documents[i].checked = checked

        }
        var setUpdate = update(this.state, {
            Actions: { $set: actions }
        });
        this.setState(setUpdate);
        /*  this.setState(update(this.state , {
                    Actions : {$set : actions}
                }));
*/


    },
    undoHandle: function(actionIndex,docIndex) {

        debugger
        console.log('stackChange', this.state.oldActions);

        var old = []
        var oldDoc = []
        old = _.cloneDeep(this.state.oldActions)
       /* oldDoc = old[old.length-1][actionIndex].documents[old]*/
       /* var documentPreview = _.cloneDeep(this.setState.documentPreview)
*/

        if (old.length > 0) {
            if(docIndex == undefined){
                 var docIndex = old[old.length - 1].docID
            }


            var oldActions = old[old.length - 1].contents
            oldDoc = old[old.length-1].contents[actionIndex].documents[docIndex]
            old.pop()
            var updateUndo = update(this.state, {
                Actions: { $set: oldActions },
                oldActions: { $set: old },
                documentPreview : {$set : oldDoc}
            })
            this.setState(updateUndo)
        }

        /* if (this.state.stackChange.length > 0) {
             var newStackChange = this.state.stackChange;
             var actions = this.state.Actions;
             var documentOld = newStackChange[this.state.stackChange.length - 1];*/
        /*actions[documentOld.index.actionIndex].documents[documentOld.index.docIndex] = documentOld.contents;
        newStackChange.pop();
        var setUpdate = update(this.state, {
            Actions: { $set: actions },
            stackChange: { $set: newStackChange },
            documentPreview: { $set: actions[documentOld.index.actionIndex].documents[documentOld.index.docIndex] }
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdate: { name: 'undoAction', actionIndex: documentOld.index.actionIndex, docIndex: documentOld.index.docIndex, stack: newStackChange.length } })*/






    },
    urgency: function(value) {
        for (var i = 0; i < Constant.urgency.length; i++) {
            if (value == Constant.urgency[i].name) {
                return Constant.urgency[i]['class'];
            }
        }
    },
    alertClose: function() {
        $(".alert-close[data-hide]").closest(".alert-success").hide();
    },
    cutPath: function(str) {
        if (str.length > 0) {
            return str.substring(0, str.lastIndexOf('/') + 1);
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
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                debugger
                if(!data.length) {
                    return;
                }
                for (var i = 0; i < data.length; i++) {
                    data[i].checkAll = false;
                    data[i].checkedNumber = 0;
                    data[i].validateNumber = 0;

                    for (var j = 0; j < data[i].documents.length; j++) {
                        data[i].documents[j].icon = this.getIcon(data[i].documents[j].name)
                        data[i].documents[j].current = {
                            checked: false,
                            category: 4,
                            confidential: 0,
                            status: "normal",
                            comment: 'Explain your choice',
                            prevCategory: null,
                            prevConfidential: 1
                        };
                    }
                }

                var challengedPreview = data[0].documents[0];
                challengedPreview.index = { actionIndex: 0, docIndex: 0 };
                var updateState = update(this.state, {
                    ChallengedDocuments: { $set: data },
                    challengedPreview: { $set: challengedPreview },

                });
                this.setState(updateState);
                console.log("Doc ok: ", this.state.ChallengedDocuments);
            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getDummyChalengge(){
        debugger
        let data=[
                  {
                    "language": {
                      "id": 1,
                      "short_name": "EN",
                      "name":"English"
                    },
                    "category": {
                      "id": 1,
                      "name": "Accounting/Tax"
                    },
                    "confidentiality": {
                      "id": 1,
                      "name": "Banking Secrecy"
                    },
                    "urgency": "very high",
                    "latest_date": "5 July",
                    "documents": [
                      {
                        "id": 1,
                        "name": "doc_name",
                        "path": "doc_path",
                        "owner": "owner_name",
                        "image_url": "http://backend-host/doc.jpg",
                        "creation_date": "2012-04-23",
                        "modification_date": "2012-04-23",
                        "legal_retention_until": "2012-04-23",
                        "comment": "comment from 2nd line user",
                        "number_of_classification_challenge": 1,
                        "current_category": {
                          "id": 1,
                          "name": "Accounting/Tax"
                        },
                        "current_confidentiality": {
                          "id": 1,
                          "name": "Public"
                        },
                        "previous_category": {
                          "id": 1,
                          "name": "Accounting/Tax"
                        },
                        "previous_confidentiality": {
                          "id": 1,
                          "name": "Public"
                        }
                      }
                    ]
                  }
                ]

        for (var i = 0; i < data.length; i++) {
                    data[i].checkAll = false;
                    data[i].checkedNumber = 0;
                    data[i].validateNumber = 0;

                    for (var j = 0; j < data[i].documents.length; j++) {
                        data[i].documents[j].icon = this.getIcon(data[i].documents[j].name)
                        data[i].documents[j].current = {
                            checked: false,
                            category: 4,
                            confidential: 0,
                            status: "normal",
                            comment: 'Explain your choice',
                            prevCategory: null,
                            prevConfidential: 1
                        };
                    }
                }

                var challengedPreview = data[0].documents[0];
                challengedPreview.index = { actionIndex: 0, docIndex: 0 };
                var updateState = update(this.state, {
                    ChallengedDocuments: { $set: data },
                    challengedPreview: { $set: challengedPreview },

                });
                this.setState(updateState);
    },
    onChangeCategoryChallenged: function(event, actionIndex, docIndex) {
        debugger
        var categoryIndex = event.target.value;
        var actions = this.state.ChallengedDocuments;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChangeChallenged;

        stackList.push({
            index: { actionIndex: actionIndex, docIndex: docIndex },
            contents: saveDocument
        });

        actions[actionIndex].documents[docIndex].current.prevCategory = actions[actionIndex].documents[docIndex].current.category;

        actions[actionIndex].documents[docIndex].current.category = categoryIndex;
        if (actions[actionIndex].documents[docIndex].current.category == 4) {
            actions[actionIndex].documents[docIndex].current.prevCategory = null;
            actions[actionIndex].documents[docIndex].current.status = "accept";
        } else {
            actions[actionIndex].documents[docIndex].current.status = "editing";
        }

        /* if(actions[actionIndex].documents[docIndex].current.category == 0)
             actions[actionIndex].documents[docIndex].current.status = "accept";
         else
             actions[actionIndex].documents[docIndex].current.status = "editing";*/
        this.setState(update(this.state, {
            stackChangeChallenged: { $set: stackList },
            ChallengedDocuments: { $set: actions }
        }));
        this.setState({ shouldUpdateChall: { name: 'updateCategory', actionIndex: actionIndex, docIndex: docIndex, categoryIndex: categoryIndex } });
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
        //if(actions[actionIndex].documents[docIndex].current.prevConfidential == null) {
        actions[actionIndex].documents[docIndex].current.prevConfidential = actions[actionIndex].documents[docIndex].current.confidential;
        //}
        actions[actionIndex].documents[docIndex].current.confidential = confidentialIndex;
        if (actions[actionIndex].documents[docIndex].current.confidential == 0) {
            /* actions[actionIndex].documents[docIndex].current.prevConfidential = null;*/
            actions[actionIndex].documents[docIndex].current.status = "accept";
        } else {

            actions[actionIndex].documents[docIndex].current.status = "editing";
        }


        /*if(actions[actionIndex].documents[docIndex].current.confidential == 0 && actions[actionIndex].documents[docIndex].current.category == 0)
            actions[actionIndex].documents[docIndex].current.status = "accept";
        else
            actions[actionIndex].documents[docIndex].current.status = "editing";*/
        var setUpdate = update(this.state, {
            stackChangeChallenged: { $set: stackList },
            ChallengedDocuments: { $set: actions }
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdateChall: { name: 'updateConfidentialChall', actionIndex: actionIndex, docIndex: docIndex, confidentialIndex: confidentialIndex } });
    },

    onChangeCommentChallenged(event, actionIndex, docIndex) {
        let document = this.state.ChallengedDocuments[actionIndex].documents[docIndex];

        if(document) {
            let updateDocument = update(this.state.ChallengedDocuments, {
                [actionIndex]: {
                    documents: {
                        [docIndex]:{
                            $merge: {
                                reviewer_comment: event.target.value
                            }
                        }
                    }
                }
            });
            debugger
            this.setState({ ChallengedDocuments: updateDocument });
        }
    },

    checkedNumberChallenged: function(actionIndex) {
        var actions = this.state.ChallengedDocuments;
        var num = 0;
        for (var i = 0; i < actions[actionIndex].documents.length; i++) {
            if (actions[actionIndex].documents[i].current.checked === true) {
                num++;
            }
        }
        actions[actionIndex].checkedNumber = num;
        this.setState(update(this.state, {
            ChallengedDocuments: { $set: actions }
        }));
        this.setState({ shouldUpdateChall: { name: 'checkedNumber', actionIndex: actionIndex } });
    },
    postDocument(actionIndex, docIndex){
        debugger
        let documentPost = this.state.Actions[actionIndex].documents[docIndex];
        let dataPost = [{
              "document_id": documentPost.id,
              "name": documentPost.name,
              "path": documentPost.path,
              "owner": documentPost.owner,
              "category": documentPost.category,
              "confidentiality": documentPost.confidentiality
        }]
        console.log('data request', dataPost);
        debugger
        makeRequest({
            method: 'PUT',
            path: 'api/review/documents/',
            params: JSON.stringify(dataPost),
            success: (res) => {
                console.log('update document', res)
            }
        });

    },
    onClickCheckboxChallenged: function(event, actionIndex, docIndex) {
        debugger
        var checked = event.target.checked;
        var actions = this.state.ChallengedDocuments;
        var saveDocument = $.extend(true, {}, actions[actionIndex].documents[docIndex]);
        var stackList = this.state.stackChangeChallenged;
        stackList.push({
            index: { actionIndex: actionIndex, docIndex: docIndex },
            contents: saveDocument
        });
        actions[actionIndex].documents[docIndex].current.checked = checked;
        if(checked == true){
            actions[actionIndex].checkedNumber += 1 ;
        }else {
            if(actions[actionIndex].checkedNumber > 0) {
                actions[actionIndex].checkedNumber -= 1
            }else {
                actions[actionIndex].checkedNumber = 0
            }

        }
        var setUpdate = update(this.state, {
            stackChangeChallenged: { $set: stackList },
            ChallengedDocuments: { $set: actions }
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdateChall: { name: 'updateCheckBox', actionIndex: actionIndex, docIndex: docIndex, checked: checked } });
    },
    validateNumberChallenged: function(actionIndex) {
        var actions = this.state.ChallengedDocuments;
        var num = 0;
        for (var i = 0; i < actions[actionIndex].documents.length; i++) {
            if (actions[actionIndex].documents[i].current.status === "editing" || actions[actionIndex].documents[i].current.status === "accept") {
                num++;
            }
        }
        actions[actionIndex].validateNumber = num;
        this.setState(update(this.state, {
            ChallengedDocuments: { $set: actions }
        }));
        this.setState({ shouldUpdateChall: { name: 'validateNumber', actionIndex: actionIndex, number: num } });
    },
    onClickValidationButtonChallenged: function(event, actionIndex, docIndex) {
        debugger
        var actions = this.state.ChallengedDocuments;
        var document =  actions[actionIndex].documents[docIndex];
        var stackList = this.state.stackChangeChallenged;

        stackList.push({
            index: { actionIndex: actionIndex, docIndex: docIndex },
            contents: Object.assign({}, document)
        });
        if (document.current.prevConfidential != null) {
            document.current.prevConfidential = null;
        }
        if (document.current.prevCategory != null) {
            document.current.prevCategory = null;
        }
        document.current.status = "accept";
        actions[actionIndex].validateNumber += 1
        debugger
        this.challengeDocument(document)

        var setUpdate = update(this.state, {
            stackChangeChallenged: { $set: stackList },
            ChallengedDocuments: { $set: actions }
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdateChall: { name: 'updateValidate', actionIndex: actionIndex, docIndex: docIndex, status: 'accept' } });
        //debugger;
    },
    challengeDocument(document){
        let dataPost = [{
              "document_id": document.id,
              "name": document.name,
              "path": document.path,
              "owner": document.owner,
              "comment": document.reviewer_comment ? document.reviewer_comment : " ",
              "category": this.state.categories[document.current.category],
              "confidentiality": this.state.confidentialities[document.current.confidential]
        }]
        console.log('data request', dataPost);
        debugger
        return makeRequest({
            method: 'PUT',
            path: 'api/review/challenged_docs/',
            params: JSON.stringify(dataPost),
            success: (res) => {
                console.log('update document', res)
            }
        });

    },
    approveButonChallenged: function(actionIndex) {
        var actions = this.state.ChallengedDocuments;
        var approveIndex = '';
        for (var i = 0; i < actions[actionIndex].documents.length; i++) {
            if (actions[actionIndex].documents[i].current.checked === true) {
                actions[actionIndex].documents[i].current.status = "accept";
                actions[actionIndex].documents[i].current.checked = false;
                approveIndex += "_" + i;
                 actions[actionIndex].validateNumber ++ ;
            }
        }
        actions[actionIndex].checkAll = false;
        actions[actionIndex].checkedNumber = 0

        var setUpdate = update(this.state, {
            ChallengedDocuments: { $set: actions }
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdateChall: { name: 'approveButon', actionIndex: actionIndex, listApprove: approveIndex } });
    },
    checkAllButtonChallenged: function(event, actionIndex) {
        var checked = event.target.checked;
        var actions = this.state.ChallengedDocuments;
        for (var i = 0; i < actions[actionIndex].documents.length; i++) {
            actions[actionIndex].documents[i].current.checked = checked;
        }
        if(checked == true){
            actions[actionIndex].checkedNumber =  actions[actionIndex].documents.length
        }else {
            actions[actionIndex].checkedNumber =  0
        }
        actions[actionIndex].checkAll = checked;
        var setUpdate = update(this.state, {
            ChallengedDocuments: { $set: actions }
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdateChall: { name: 'updateCheckAll', actionIndex: actionIndex, checked: checked } });
    },
    undoHandleChallenged: function() {
        console.log('stackChange', this.state.stackChangeChallenged);
        if (this.state.stackChangeChallenged.length > 0) {
            var newStackChange = this.state.stackChangeChallenged;
            var actions = this.state.ChallengedDocuments;
            var documentOld = newStackChange[this.state.stackChangeChallenged.length - 1];
            actions[documentOld.index.actionIndex].documents[documentOld.index.docIndex] = documentOld.contents;
            newStackChange.pop();
            var setUpdate = update(this.state, {
                ChallengedDocuments: { $set: actions },
                stackChangeChallenged: { $set: newStackChange },
                challengedPreview: { $set: actions[documentOld.index.actionIndex].documents[documentOld.index.docIndex] }
            });
            this.setState(setUpdate);
            this.setState({ shouldUpdateChall: { name: 'undoActionChallenged', actionIndex: documentOld.index.actionIndex, docIndex: documentOld.index.docIndex, stack: newStackChange.length } })
        }
    },
    getCategories() {
        let arr = [];
        makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                this.setState({ categories: data });
            }
        });
    },

    getConfidentialities() {
        let arr = [];
        makeRequest({
            path: 'api/label/confidentiality/',
            success: (data) => {
                this.setState({ confidentialities: data });
            }
        });
    },
    getIDCategory(value){
        switch(value){
            case "Accounting/Tax" : return 1;
            case "Client/Customer" : return 2;
            case "Corporate Entity" : return 3;
            case "Employee" : return 4;
            case "Legal/Compliance" : return 5;
            case "Transaction" : return 6
        }
    },
    getIDConfidentialities(value){
        switch(value){
            case "Banking Secrecy" : return 1;
            case "Confidential" : return 2;
            case "Internal" : return 3;
            case "Public" : return 4;
            case "Secret" : return 5;
            case "Unrestricted" : return 7
        }
    },
    getIcon(value) {
        if (_.endsWith(value, '.ppt')) {
            return "fa fa-file-powerpoint-o action-file-icon"
        }
        if (_.endsWith(value, '.xls')) {
            return "fa fa-file-excel-o action-file-icon "
        }
        if (_.endsWith(value, '.pdf')) {
            return "fa fa-file-pdf-o action-file-icon"
        }
        if (_.endsWith(value, '.txt')) {
            return "fa fa-file-text-o action-file-icon"
        }
        if (_.endsWith(value, '.doc') || _.endsWith(value, '.docx')) {
            return "fa fa-file-word-o action-file-icon"
        }

        return "fa fa-file-o action-file-icon"

    },

    render: template
});
module.exports = DocumentReview;
