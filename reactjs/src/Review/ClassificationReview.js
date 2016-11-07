import React, { Component } from 'react'
import { render } from 'react-dom'
import template from './ClassificationReview.rt'
import update from 'react/lib/update'
import Constant, { fetching, status } from '../Constant'
import { cloneDeep, isEqual, find, findIndex, orderBy } from 'lodash'
import { makeRequest } from '../utils/http'
import { orderConfidentialities } from '../utils/function'

var ClassificationReview = React.createClass({

    getInitialState() {
        return {
            confidentialities: [],
            categories: [],
            dataReview: [],
            shouldUpdate: false,
            openPreview: false,
            current: {
                docIndex: 0,
                reviewIndex: 0
            },
            stackChange: [],
            dataRequest: []
        };
    },

    xhr: {
        getReview: null,
        getConfident: null,
        getCat: null
    },

    componentDidMount() {
        this.props.updateStore({
            xhr: update(this.props.xhr, {
                isFetching:
                {
                    $set: fetching.START
                }
            })
        });
        this.xhr.getReview = this.getClassificationReview();
        this.xhr.getCat = this.getCategories();
        this.xhr.getConfident = this.getConfidentialities();
    },


    shouldComponentUpdate(nextProps, nextState) {
        return nextState.shouldUpdate;
    },

    componentDidUpdate(prevProps, prevState) {
        let { dataReview, current } = this.state;

        if(this.state.shouldUpdate === true) {
            this.setState({ shouldUpdate: false });
        }
        if(prevState.dataReview[current.reviewIndex] && !isEqual(dataReview[current.reviewIndex].documents, prevState.dataReview[current.reviewIndex].documents)) {
            this.checkValidNumber(dataReview[current.reviewIndex].documents);
        }
        if(!isEqual(this.state.dataRequest, prevState.dataRequest)) {
            this.assignCategoryAndConfidentiality2nd();
        }
    },

    componentWillUnmount() {
        let {
            getCat,
            getConfident,
            getReview
        } = this.xhr;

        if(getReview && getReview.abort) {
            getReview.abort();
        }
        if(getCat && getCat.abort) {
            getCat.abort();
        }
        if(getConfident && getConfident.abort) {
            getConfident.abort();
        }
        this.props.updateStore({
            xhr: update(this.props.xhr, {
                isFetching:
                {
                    $set: fetching.SUCCESS
                }
            })
        });
    },

    checkValidNumber(documents) {
        let numCheck = 0, numValid = 0, updateData = {},
            { dataReview, current } = this.state,
            docLength = documents.length;

        for(let i = docLength - 1; i >= 0; i--) {
            if(documents[i].checked === true) {
                numCheck++;
            }
            if(documents[i].status === status.ACCEPTED.name || documents[i].status === status.EDITING.name) {
                numValid++;
            }
        }

        updateData = update(dataReview, {
            [current.reviewIndex]: {
                $merge: {
                    checkedNumber: numCheck,
                    validateNumber: numValid,
                    checkedAll: (numCheck === docLength)
                }
            }
        });

        this.setState({ dataReview: updateData, shouldUpdate: true });
    },

    handleClickApproveButton(reviewIndex) {

        let updateData = update(this.state.dataReview, {
            [reviewIndex]: {
                documents: {
                    $apply: (data) => {
                        data = cloneDeep(data);
                        for(let i = data.length - 1; i >= 0; i--) {
                            if(data[i].checked) {
                                data[i].status = status.ACCEPTED.name;
                                data[i].checked = false;
                            }
                        }

                        return data;
                    }
                }
            }
        });
        this.setState({
            dataReview: updateData,
            current: update(this.state.current, {
                docIndex: this.state.current.docIndex,
                reviewIndex: reviewIndex
            }),
            shouldUpdate: true
        });
    },

    handleTableRowOnClick(event, index) {
        let _index = index.split('_'),
            reviewIndex = parseInt(_index[0]),
            docIndex = parseInt(_index[1]),
            {
                dataReview
            } = this.state,
            {
                documents
            } = dataReview[reviewIndex],

            docLength = documents.length;

        this.setState({
            current: update(this.state.current, {
                $merge: {
                    docIndex: docIndex,
                    reviewIndex: reviewIndex,
                    hasNextDocument: !((docIndex + 1) >= docLength && (reviewIndex + 1) >= dataReview.length),
                    isNextCategory:  (docLength === (docIndex + 1) ? true : false)
                }
            })
        });

        switch(event.currentTarget.id) {
            case 'documentName': {
                this.onClickDocumentName(reviewIndex, docIndex);
            }
            break;
            case 'documentStatus': {
                this.onClickButtonStatus(reviewIndex, docIndex);
            }
        }
    },

    handleNextDocument() {
        let {
            current,
            dataReview
        } = this.state,
        {
            documents
        } = dataReview[current.reviewIndex],

        isNextCategory = !((current.docIndex + 1) < documents.length),

        hasNextDocument = !((current.docIndex + 2) >= documents.length && (current.reviewIndex + 2) >= dataReview.length);

        if(current.isNextCategory)
        {
            // if((current.reviewIndex + 1) < dataReview.length)
            // {
                this.setState({
                    current: update(current, {
                        reviewIndex: {
                            $set: ( current.reviewIndex + 1 ) < dataReview.length ? current.reviewIndex + 1 : current.reviewIndex
                        },
                        isNextCategory: {
                            $set: isNextCategory
                        },
                        hasNextDocument: {
                            $set: hasNextDocument
                        }
                    }),
                    shouldUpdate: true
                });
            //}
        } else {
            // if((current.docIndex + 1) <  documents.length)
            // {
                this.setState({
                    current: update(current, {
                        reviewIndex: {
                            $set: (current.docIndex + 1) <  documents.length ? current.docIndex + 1 : current.docIndex
                        },
                        isNextCategory: {
                            $set: isNextCategory
                        },
                        hasNextDocument: {
                            $set: hasNextDocument
                        }
                    }),
                    shouldUpdate: true
                });
            // }
        }
    },

    onClickDocumentName(reviewIndex, docIndex) {
        if(docIndex <= (this.state.dataReview[reviewIndex].documents.length - 1)) {
            this.setState({
                openPreview: true,
                shouldUpdate: true
            });
        }
    },

    onClickButtonStatus(reviewIndex, docIndex) {

        let document = this.state.dataReview[reviewIndex].documents[docIndex],
            { stackChange } = this.state;
        //if(document.status === 'reject') {
            let updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            $merge: {
                                status: status.ACCEPTED.name
                            }
                        }
                    }
                }
            }),

            updateStackChange = update(stackChange, {});

            if(updateStackChange[reviewIndex]) {
                updateStackChange[reviewIndex].push({
                    id: docIndex,
                    data: document
                });
            } else {
                updateStackChange[reviewIndex] = [{
                    id: docIndex,
                    data: document
                }]
            }

            this.assignCategoryAndConfidentiality2nd([{
                "name": document.name,
                "path": document.path,
                "owner": document.owner,
                "number_of_classification_challenge": 1,
                "initial_category": document.init_category ? document.init_category : document.category,
                "initial_confidentiality": document.init_confidentiality ? document.init_confidentiality : document.confidentiality,
                "validated_category": document.category,
                "validated_confidentiality": document.confidentiality
            }]);

            this.setState({
                dataReview: updateData,
                stackChange: updateStackChange,
                shouldUpdate: true
            });
        //}
    },

    addDocIntoRequest(document) {
        let documentRequest = {
                "name": document.name,
                "path": document.path,
                "owner": document.owner,
                "number_of_classification_challenge": 1,
                "initial_category": document.init_category ? document.init_category : document.category,
                "initial_confidentiality": document.init_confidentiality ? document.init_confidentiality : document.confidentiality,
                "validated_category": document.category,
                "validated_confidentiality": document.confidentiality
            },
            indexDocumentRequest = findIndex(this.state.dataRequest, {
                name: document.name,
                owner: document.owner,
                path: document.path
            });

        return update(this.state.dataRequest, indexDocumentRequest > -1 ?
            {
                $splice: [[indexDocumentRequest, 1, documentRequest]]
            } : {
                $push: [documentRequest]
        });
    },

    handleTableRowOnChange(event, index) {
        let { stackChange } = this.state,
            _index = index.split('_'),
            reviewIndex = parseInt(_index[0]),
            docIndex = parseInt(_index[1]),
            document = this.state.dataReview[reviewIndex].documents[docIndex];
            

        let updateStackChange = update(stackChange, {});

        if(!stackChange[reviewIndex]) {
            updateStackChange[reviewIndex] = [{
                id: docIndex,
                data: document
            }];
        } else {
            updateStackChange[reviewIndex].push({
                id: docIndex,
                data: document
            });
        }

        this.setState({
            stackChange: updateStackChange,
            current: update(this.state.current, {
                docIndex: {
                    $set: docIndex
                },
                reviewIndex: {
                    $set: reviewIndex
                }
            }) 
        });

        switch(event.target.id) {
            case 'checkbox': {
                this.onChangeCheckBox(event, reviewIndex, docIndex, document);
            }
            break;

            case 'selectCategory': {
                this.onChangeCategory(event, reviewIndex, docIndex, document);
            }
            break;

            case 'selectConfidentiality': {
                this.onChangeConfidentiality(event, reviewIndex, docIndex, document);
            }
        }
    },

    onChangeCheckBox(event, reviewIndex, docIndex, document) {
        let updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            $merge: {
                                checked: event.target.checked
                            }
                        }
                    }
                }
            });


        this.setState({
            dataReview: updateData,
            shouldUpdate: true
        });
    },

    onChangeCategory(event, reviewIndex, docIndex, document) {
        let categoryIndex = event.target.value,
            { categories } = this.state,
            updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            category: {
                                $set: categories[categoryIndex]
                            },
                            $merge: {
                                status: document.init_category && (categories[categoryIndex].id == document.init_category.id) ? status.ACCEPTED.name : status.EDITING.name,
                                init_category: document.init_category ? document.init_category : document.category
                            }
                        }
                    }
                }
            });
        this.assignCategoryAndConfidentiality2nd([{
            "name": document.name,
            "path": document.path,
            "owner": document.owner,
            "number_of_classification_challenge": 1,
            "initial_category": document.init_category ? document.init_category : document.category,
            "initial_confidentiality": document.init_confidentiality ? document.init_confidentiality : document.confidentiality,
            "validated_category": document.category,
            "validated_confidentiality": document.confidentiality
        }]);
        this.setState({
            dataReview: updateData,
            shouldUpdate: true
        });
    },

    onChangeConfidentiality(event, reviewIndex, docIndex, document) {
        let confidentialityIndex = event.target.value,

            { confidentialities } = this.state,

            updateData = update(this.state.dataReview, {
                [reviewIndex]: {
                    documents: {
                        [docIndex]: {
                            confidentiality: {
                                $set: confidentialities[confidentialityIndex]
                            },
                            $merge: {
                                init_confidentiality: document.init_confidentiality ? document.init_confidentiality : document.confidentiality,

                                status: document.init_confidentiality && (confidentialities[confidentialityIndex].id == document.init_confidentiality.id) ? status.ACCEPTED.name : status.EDITING.name
                            }
                        }
                    }
                }
            });
        this.assignCategoryAndConfidentiality2nd([{
            "name": document.name,
            "path": document.path,
            "owner": document.owner,
            "number_of_classification_challenge": 1,
            "initial_category": document.init_category ? document.init_category : document.category,
            "initial_confidentiality": document.init_confidentiality ? document.init_confidentiality : document.confidentiality,
            "validated_category": document.category,
            "validated_confidentiality": document.confidentiality
        }]);

        this.setState({
            dataReview: updateData,
            shouldUpdate: true
        });

    },

    handleCheckAll(index, event) {
        this.setState({
            dataReview: update(this.state.dataReview, {
                [index]: {
                    documents: {
                        $apply: (data) => {
                            data = cloneDeep(data);
                            for(let i = data.length - 1; i >= 0; i--) {
                                data[i].checked = event.target.checked
                            }
                            return data;
                        }
                    },

                    $merge: {
                        checkedAll: event.target.checked
                    }
                }
            }),
            current: update(this.state.current, {
                reviewIndex: {
                    $set: index
                }
            }),
            shouldUpdate: true
        });
    },

    handleUndo(reviewIndex) {
        if(this.state.stackChange[reviewIndex] && this.state.stackChange[reviewIndex].length > 0) {
            let { stackChange } = this.state,
                stackLength = stackChange[reviewIndex].length,
                item = stackChange[reviewIndex][stackLength - 1];

            this.setState({
                dataReview: update(this.state.dataReview, {
                    [reviewIndex]: {
                        documents: {
                            [item.id]: {
                                $set: item.data
                            }
                        }
                    }
                }),

                stackChange: update(stackChange, {
                    [reviewIndex]: {
                        $splice: [[stackLength - 1, 1]]
                    }
                }),

                current: update(this.state.current, {
                    docIndex: {
                        $set: item.id
                    },
                    review: {
                        $set: reviewIndex
                    }
                }),
                shouldUpdate: true
            });
        }
    },

    closePreview() {
        this.setState({ openPreview: false, shouldUpdate: true });
    },

    assignCategoryAndConfidentiality2nd(request) {
        return makeRequest({
            method: "POST",
            params: JSON.stringify(request),
            path: "api/classification_review/",
            success: (res) => {
                console.log("assign success", res);
            }
        });
    },

    getClassificationReview() {
        return makeRequest({
            path: "api/classification_review/",
            success: (data) => {
                this.props.updateStore({
                    xhr: update(this.props.xhr, {
                        isFetching:
                        {
                            $set: fetching.SUCCESS
                        }
                    })
                });
                this.setState({ dataReview: data, shouldUpdate: true });
            },
            error: (err) => {
                this.props.updateStore({
                    xhr: update(this.props.xhr, {
                        isFetching:
                        {
                            $set: fetching.ERROR
                        }
                    })
                });
            }
        });

    },

    getCategories() {
        let arr = [];
        return makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                data = orderBy(data, ['name'], ['asc']);
                this.setState({ categories: data, shouldUpdate: true });
            }
        });
    },

    getConfidentialities() {
        let arr = [];
        return makeRequest({
            path: 'api/label/confidentiality/',
            success: (data) => {
                data = orderConfidentialities(data)
                this.setState({ confidentialities: data, shouldUpdate: true });
            }
        });
    },

    render:template
});

module.exports = ClassificationReview;
