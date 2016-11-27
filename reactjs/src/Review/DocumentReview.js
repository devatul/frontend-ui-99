import React, { Component } from 'react'
import { render } from 'react-dom'
import template from './DocumentReview.rt'
import update from 'react/lib/update'
import Constant, { status } from '../App/Constant.js'
import { cloneDeep, isEqual, find, findIndex, orderBy } from 'lodash'
import { makeRequest } from '../utils/http'
import { getCategories, getConfidentialities, assignCategoryAndConfidentiality2nd } from '../utils/function'

var DocumentReview = React.createClass({

    statics: {
        challenge: 'challengedDocs',
        actions: 'actionsReview'
    },

    xhr: {
        categories: null,
        confidentialities: null,
        actionsReview: null,
        challengedDocs: null
    },

    getInitialState() {
        return {
            actionsReview: [],
            challengedDocs: [],
            categories: [],
            confidentialities: [],
            shouldUpdate: false,
            openPreview: false,
            current: {
                docIndex: 0,
                review: "actionsReview",
                actionIndex: 0,
                hasNextDocument: false,
                isNextCategory: false
            },
            stackChange: {
                challengedDocs: {},
                actionsReview: {}
            },
            dataRequest: []
        };
    },

    componentDidMount() {
        this.xhr.categories = this.getCategories();
        this.xhr.confidentialities = this.getConfidentialities();
        this.xhr.actionsReview = this.getActionsReview();
        this.xhr.challengedDocs = this.getChallengedDocs();
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.shouldUpdate;
    },

    componentDidUpdate(prevProps, prevState) {
        let { current } = this.state;
        if(this.state.shouldUpdate === true) {
            this.setState({ shouldUpdate: false });
        }
        if(prevState[current.review][current.actionIndex] && !isEqual(this.state[current.review][current.actionIndex].documents, prevState[current.review][current.actionIndex].documents)) {
            this.countCheckAndValidNumber();
        }
    },

    componentWillUnmount() {
        if(this.xhr.categories && this.xhr.categories.abort) {
            this.xhr.categories.abort();
        }

        if(this.xhr.confidentialities && this.xhr.confidentialities.abort) {
            this.xhr.confidentialities.abort();
        }

        if(this.xhr.actionsReview && this.xhr.actionsReview.abort) {
            this.xhr.actionsReview.abort()
        }

        if(this.xhr.challengedDocs && this.xhr.challengedDocs.abort) {
            this.xhr.challengedDocs.abort()
        }

        this.xhr = null;
    },

    countCheckAndValidNumber() {
        let numCheck = 0, numValid = 0, updateData = {},
            { current } = this.state,
            { documents } = this.state[current.review][current.actionIndex],
            _status = current.review === this.constructor.actions ? 'status' : '2nd_line_validation';

        for(let i = documents.length - 1; i >= 0; i--) {
            if(documents[i].checked) {
                numCheck++;
            }
            if(documents[i][_status] === status.ACCEPTED.name || documents[i][_status] === status.EDITING.name) {
                numValid++;
            }
        }

        this.setState({
            [current.review]: update(this.state[current.review], {
                [current.actionIndex]:
                {
                    $merge:
                    {
                        checkedNumber: numCheck,
                        validateNumber: numValid,
                        checkAll: (numCheck === documents.length)
                    }
                }
            }),

            shouldUpdate: true
        });
    },

    handleApproveButton(actionIndex, Review) {
        this.setState({
            [Review]: update(this.state[Review], {
                [actionIndex]:
                {
                    documents:
                    {
                        $apply: (data) => {
                            data = cloneDeep(data);
                            let _status = Review === this.constructor.actions ? 'status' : '2nd_line_validation';

                            for(let i = data.length - 1; i >= 0; i--) {
                                if(data[i].checked) {
                                    data[i][_status] = status.ACCEPTED.name;
                                    data[i].checked = false;
                                }
                            }

                            return data;
                        }
                    }
                }
            }),
            current: update(this.state.current, {
                $merge: {
                    review: Review,
                    actionIndex: actionIndex
                }
            }),
            shouldUpdate: true
        });
    },

    handleTableRowOnClick(actionIndex, docIndex, Review, event) {
        Review = (Review === this.constructor.actions ? this.constructor.actions : this.constructor.challenge);

        let dataReviews = this.state[Review],
            {
                documents
            } = dataReviews[actionIndex],

            docLength = documents.length;

        this.setState({
          current: update(this.state.current, {
            $merge: {
              docIndex: docIndex,
              review: Review,
              actionIndex: actionIndex,
              hasNextDocument: !((docIndex + 1) >= docLength && (actionIndex + 1) >= dataReviews.length),
              isNextCategory: (docLength === (docIndex + 1) ? true : false)
            }
          })
        });

        switch(event.currentTarget.id) {
            case 'documentName':
                return this.onClickDocumentName(event, actionIndex, docIndex, Review);
            case 'documentStatus':
                return this.onClickButtonStatus(event, actionIndex, docIndex, Review);
            case 'validationButton':
                return this.onClickButtonStatus(event, actionIndex, docIndex, Review);
        }
    },

    handleNextDocument() {
        let { current } = this.state,
            dataReviews = this.state[current.review],
            { documents } = dataReviews[current.actionIndex],
            isNextCategory = !((current.docIndex + 1) < documents.length && documents.length > 1),
            hasNextDocument = !((current.docIndex + 2) === documents.length && (current.actionIndex + 1) === dataReviews.length);

        if (isNextCategory) {
            this.setState({
                current: update(current, {
                    actionIndex: {
                        $set: current.actionIndex + 1
                    },
                    docIndex: {
                        $set: 0
                    },
                    isNextCategory: {
                        $set: !isNextCategory
                    },
                    hasNextDocument: {
                        $set: hasNextDocument
                    }
                }),
                shouldUpdate: true
            });

        } else {
            this.setState({
                current: update(current, {
                    docIndex: {
                        $set: (current.docIndex + 1)
                    },
                    isNextCategory: {
                        $set: ((current.docIndex + 2) >= documents.length)
                    },
                    hasNextDocument: {
                        $set: hasNextDocument
                    }
                }),
                shouldUpdate: true
            });
        }
    },

    onClickDocumentName(event, actionIndex, docIndex, Review) {

        if(docIndex <= (this.state[Review][actionIndex].documents.length - 1)) {
            this.setState({
                openPreview: true,
                shouldUpdate: true
            });
        }
    },

    onClickButtonStatus(event, actionIndex, docIndex, Review) {
        let document = this.state[Review][actionIndex].documents[docIndex],
            { stackChange } = this.state,
            _status = "";

        if(Review === this.constructor.actions)
        {
            this.updateDocuments([{
                "document_id": document.id,
                "name": document.name,
                "path": document.path,
                "owner": document.owner,
                "category": document.category,
                "confidentiality": document.confidentiality
            }]);

            _status = 'status';

        } else {
            this.challengeDocuments([{
                "document_id": document.id,
                "name": document.name,
                "path": document.path,
                "owner": document.owner,
                "comment": document.reviewer_comment ? document.reviewer_comment : " ",
                "category": document.current_category,
                "confidentiality": document.current_confidentiality
            }]);

            _status = '2nd_line_validation';
        }


        this.setState({
            [Review]: update(this.state[Review], {
                [actionIndex]: {
                    documents: {
                        [docIndex]: {
                            $merge:
                            {
                                [_status]: status.ACCEPTED.name
                            }
                        }
                    }
                }
            }),

            stackChange: update(stackChange, {
                [Review]: {
                    $merge: {
                        [actionIndex]: (stackChange[Review][actionIndex] ? update(stackChange[Review][actionIndex],{
                            $push: [{
                                id: docIndex,
                                data: document
                            }]
                        }) : [{
                                id: docIndex,
                                data: document
                        }])
                    }
                }
            }),
            shouldUpdate: true
        });
    },

    updateDocuments(documents) {
        return makeRequest({
            method: 'PUT',
            path: 'api/review/documents/',
            params: JSON.stringify(documents),
            success: (res) => {
            }
        });

    },

    challengeDocuments(documents){
        return makeRequest({
            method: 'PUT',
            path: 'api/review/challenged_docs/',
            params: JSON.stringify(documents),
            success: (res) => {
            }
        });

    },

    handleTableRowOnChange(actionIndex, docIndex, Review, event) {
        Review = (Review === this.constructor.actions ? this.constructor.actions : this.constructor.challenge);

        let dataReviews = this.state[Review],
            {
                documents
            } = dataReviews[actionIndex],

            docLength = documents.length;

        let { stackChange } = this.state,

            document = this.state[Review][actionIndex].documents[docIndex],

            newStack = update(stackChange, {
                [Review]: {
                    $merge: {
                        [actionIndex]: (stackChange[Review][actionIndex] ? update(stackChange[Review][actionIndex],{
                            $push: [{
                                id: docIndex,
                                data: document
                            }]
                        }) : [{
                                id: docIndex,
                                data: document
                        }])
                    }
                }
            });
        this.setState({
            stackChange: newStack,
            current: update(this.state.current, {
                $merge: {
                    docIndex: docIndex,
                    review: Review,
                    actionIndex: actionIndex,
                    hasNextDocument: !((docIndex + 1) >= docLength && (actionIndex + 1) >= dataReviews.length),
                    isNextCategory: (docLength === (docIndex + 1) ? true : false)
                }
            })
        });

        switch(event.target.id) {
            case 'checkbox': {
                return this.onChangeCheckBox(event, actionIndex, docIndex, Review);
            }

            case 'selectCategory': {
                return this.onChangeCategory(event, actionIndex, docIndex, Review);
            }

            case 'selectConfidentiality': {
                return this.onChangeConfidentiality(event, actionIndex, docIndex, Review);
            }

            case 'CommentBox':
                return this.onChangeCommentBox(event, actionIndex, docIndex, Review);
        }
    },

    onChangeCheckBox(event, actionIndex, docIndex, Review) {
        this.setState({
            [Review]: update(this.state[Review], {
                [actionIndex]:
                {
                    documents:
                    {
                        [docIndex]:
                        {
                            $merge: {
                                checked: event.target.checked
                            }
                        }
                    }
                }
            }),

            shouldUpdate: true
        });
    },

    onChangeCategory(event, actionIndex, docIndex, Review) {
        let categoryIndex = event.target.value,
            document = this.state[Review][actionIndex].documents[docIndex],
            { categories } = this.state,
            updateData = [];
        if(Review === this.constructor.actions) {
            updateData = update(this.state[Review], {
                [actionIndex]: {
                    documents: {
                        [docIndex]: {
                            category: {
                                $set: categories[categoryIndex]
                            },
                            $merge: {
                                status: document.init_category && (categories[categoryIndex].id == document.init_category.id) ? status.ACCEPTED.name : status.EDITING.name,
                                init_category: document.init_category && document.category
                            }
                        }
                    }
                }
            });
            this.updateDocuments([{
                "document_id": document.id,
                "name": document.name,
                "path": document.path,
                "owner": document.owner,
                "category": document.category,
                "confidentiality": document.confidentiality
            }]);
        } else {
            updateData = update(this.state[Review], {
                [actionIndex]: {
                    documents: {
                        [docIndex]: {
                            current_category: {
                                $set: categories[categoryIndex]
                            },
                            $merge: {
                                ['2nd_line_validation']: (categories[categoryIndex].id == document.previous_category.id ) ? status.ACCEPTED.name : status.EDITING.name
                            }
                        }
                    }
                }
            });
            this.challengeDocuments([{
                "document_id": document.id,
                "name": document.name,
                "path": document.path,
                "owner": document.owner,
                "comment": document.reviewer_comment ? document.reviewer_comment : " ",
                "category": document.current_category,
                "confidentiality": document.current_confidentiality
            }]);
        }

        this.setState({
            [Review]: updateData,
            shouldUpdate: true
        });
    },

    onChangeConfidentiality(event, actionIndex, docIndex, Review) {
        let confidentialityIndex = event.target.value,

            document = this.state[Review][actionIndex].documents[docIndex],

            { confidentialities } = this.state,

            updateData = [];
        if(Review === this.constructor.actions) {
            updateData = update(this.state[Review], {
                [actionIndex]: {
                    documents: {
                        [docIndex]: {
                            confidentiality: {
                                $set: confidentialities[confidentialityIndex]
                            },
                            $merge: {
                                init_confidentiality: document.init_confidentiality && document.confidentiality,

                                status: document.init_confidentiality && (confidentialities[confidentialityIndex].id == document.init_confidentiality.id) ? status.ACCEPTED.name : status.EDITING.name
                            }
                        }
                    }
                }
            });
            this.updateDocuments([{
                "document_id": document.id,
                "name": document.name,
                "path": document.path,
                "owner": document.owner,
                "category": document.category,
                "confidentiality": document.confidentiality
            }]);
        } else {
            updateData = update(this.state[Review], {
                [actionIndex]: {
                    documents: {
                        [docIndex]: {
                            current_confidentiality: {
                                $set: confidentialities[confidentialityIndex]
                            },
                            $merge: {
                                ['2nd_line_validation']: (confidentialities[confidentialityIndex].id == document.previous_confidentiality.id) ? status.ACCEPTED.name : status.EDITING.name
                            }
                        }
                    }
                }
            });
            this.challengeDocuments([{
                "document_id": document.id,
                "name": document.name,
                "path": document.path,
                "owner": document.owner,
                "comment": document.reviewer_comment ? document.reviewer_comment : " ",
                "category": document.current_category,
                "confidentiality": document.current_confidentiality
            }]);
        }

        this.setState({
            [Review]: updateData,
            shouldUpdate: true
        });
    },

    onChangeCommentBox(event, actionIndex, docIndex, Review) {
        this.setState({
            [Review]: update(this.state[Review], {
                [actionIndex]:
                {
                    documents:
                    {
                        [docIndex]:
                        {
                            $merge:
                            {
                                reviewer_comment: event.target.value,
                                ['2nd_line_validation']: status.EDITING.name
                            }
                        }
                    }
                }
            }),

            shouldUpdate: true
        });
    },

    handleCheckAll(actionIndex, Review, event) {
        this.setState({
            [Review]: update(this.state[Review], {
                [actionIndex]:
                {
                    documents:
                    {
                        $apply: (data) => {
                            data = cloneDeep(data);
                            for(let i = data.length - 1; i >= 0; i--) {
                                data[i].checked = event.target.checked
                            }

                            return data;
                        }
                    },

                    $merge: {
                        checkAll: event.target.checked
                    }
                }
            }),

            current: update(this.state.current, {
                $merge:
                {
                    review: Review,
                    actionIndex: actionIndex
                }
            }),

            shouldUpdate: true
        });
    },

    handleNextDocumentName(actionIndex, docIndex, Review) {
        if((docIndex + 1) < this.state[Review][actionIndex].documents.length) {
            this.setState({
                current: update(this.state.current, {
                    docIndex: {
                        $set: (docIndex + 1)
                    }
                }),

                shouldUpdate: true
            });
        }
    },

    handleUndo(actionIndex, Review) {
        let stack = this.state.stackChange[Review];
        if(stack[actionIndex].length > 0) {
            let stackAction = stack[actionIndex];
            let lastItem = stackAction[stackAction.length - 1];
            this.setState({
                [Review]: update(this.state[Review], {
                    [actionIndex]:
                    {
                        documents:
                        {
                            [lastItem.id]:
                            {
                                $set: lastItem.data
                            }
                        }
                    }
                }),

                stackChange: update(this.state.stackChange, {
                    [Review]:
                    {
                        [actionIndex]:
                        {
                            $splice: [[stackAction.length - 1, 1]]
                        }
                    }
                }),

                shouldUpdate: true
            });
        }
    },

    closePreview() {
        this.setState({ openPreview: false, shouldUpdate: true });
    },

    assignCategoryAndConfidentiality2nd() {
        return assignCategoryAndConfidentiality2nd({
            params: JSON.stringify(this.state.dataRequest),
            success: (res) => {
            }
        });
    },

    getActionsReview() {
        return makeRequest({
            path: "api/review/documents/",
            success: (data) => {
                this.setState({ actionsReview: data, shouldUpdate: true });
            }
        });

    },

    getChallengedDocs() {
        return makeRequest({
            path: "api/review/challenged_docs/",
            success: (data) => {
                this.setState({ challengedDocs: data, shouldUpdate: true });
            }
        });
    },

    getCategories() {
        return getCategories({
            success: (data) => { 
                data = orderBy(data, ['name'], ['asc']);
                this.setState({ categories: data, shouldUpdate: true });
            }
        });
    },

    getConfidentialities() {
        return getConfidentialities({
            success: (data) => {
                this.setState({ confidentialities: data, shouldUpdate: true });
            }
        });
    },

    render:template
});

module.exports = DocumentReview;
