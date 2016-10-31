import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './UserAssignment.rt'
import update from 'react/lib/update'
import javascript from '../script/javascript.js'
import Constant from '../Constant.js'
import { upperFirst, findIndex, assignIn, isEqual, cloneDeep, orderBy } from 'lodash'
import { makeRequest } from '../utils/http'

var UserAssignment = React.createClass({
    static: {
        selectId: {
            timeframe: 'timeframe',
            users: 'users',
            type: 'type'
        }
    },
    getInitialState() {
        return {
            category: {
                list: [],
                current: {},
                info: {},
                default: 0
            },
            reviewer: {
                list: [],
                current: {}
            },
            buttonSample: {
                category: 'success',
                fixedNumber: ''
            },
            datafilter: {
                params: {
                    id: 0,
                    timeframe: 6,
                    users: 10,
                    type: 'last_modifier'
                },
                request: {
                    id: 0,
                    name:"name category",
                    docs_sampled: 10,
                    reviewers:[]
                },
                usersNumber: [
                    {name: 'Number of Users', value: 0 },
                    {name: 'Top 30', value: 30 },
                    {name: 'Top 20', value: 20 },
                    {name: 'Top 15', value: 15 },
                    {name: 'Top 10', value: 10 },
                    {name: 'Top 5', value: 5 },
                    {name: 'Top 2', value: 2 }
                ],
                type: [
                    {name: 'Type of Reviewer', value: 0 },
                    {name: 'Document Last Modified', value: 'last_modifier'},
                    {name: 'Document Creator', value: 'creator'}
                ],
                timeFrame: [
                    {name: 'Timeframe', value: 0},
                    {name: '1 Year', value: 12},
                    {name: '6 Months', value: 6},
                    {name: '3 Months', value: 3},
                    {name: '1 Months', value: 1}
                ],
                setValue: {
                    timeframe: 0,
                    users: 0,
                    type: 0
                },
                filterLabel: []
            },
            summary: [],
            dataChart: {
                reviewerChart: {
                    config: {
                        name: 'Documents',
                        colors: [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'],
                        colorsHover: '#DFF2F8'
                    },
                    data: [],
                    categories: []
                },
                documentType: {
                    categories: [],
                    series: []
                },
                confidentiality: []
            },
            shouldUpdate: false,
            isConfirming: 0
        };
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.shouldUpdate;
    },
    
    componentDidMount() {
    	this.getCategories();
        this.getSummary();
    	console.log(this.state);
    	javascript();
    },

    componentWillUpdate(nextProps, nextState) {
        if(this.state.category.current != nextState.category.current) {
            var { reviewers } = this.state.datafilter.request;
            var { current } = this.state.category;
            if(reviewers.length > 0 && current.id !== "summary") {
                
                this.assignReviewersToCategory();
            }
        }
    },
    

    componentDidUpdate(prevProps, prevState) {
        var { category, datafilter, reviewer } = this.state;

        if(this.state.shouldUpdate) {
            this.setState({ shouldUpdate: false });
        }
    	
        if(category.current != prevState.category.current) {
            this.getSummary(false);

            if(category.current.id != 'summary') {
                this.getCategoryInfo();
            }
        }
        if(!isEqual(datafilter.params, prevState.datafilter.params)) {
            this.getReviewers();
        }
        
    },
    handleOnChangeSelectBox: function(data, event) {
        var { params, filterLabel } = this.state.datafilter,
            { selectId } = this.static,
            field = event.target,
            indexLabel = findIndex(filterLabel, {id: field.id }),
            label = assignIn({}, data);

            label.id = field.id;
        if(indexLabel == -1) {
            indexLabel = filterLabel.length;
        }
        switch(field.id) {
            case selectId.users: 
                params = update(params, {
                    users: {$set: data.value }
                });
                break;
            case selectId.timeframe:
                params = update(params, {
                    timeframe: {$set: data.value }
                });
                break;
            case selectId.type:
                params = update(params, {
                    type: {$set: data.value }
                });
            }
        var updateData = update(this.state.datafilter, {
                params: {
                    $set: params
                },
                
                setValue: {
                    [field.id]: {$set: field.value }
                },
                filterLabel: {
                    [indexLabel]: {$set: label}
                }
            });
        this.setState({ datafilter: updateData, shouldUpdate: true });
    },
    handleClickFilterLabel: function(label, index) {
        var { selectId } = this.static,
            { params, filterLabel } = this.state.datafilter,
            indexLabel = findIndex(filterLabel, {id: label.id });
            
        switch(label.id) {
            case selectId.users: 
                params = update(params, {
                    users: {$set: 10 }
                });
                break;
            case selectId.timeframe:
                params = update(params, {
                    timeframe: {$set: 6 }
                });
                break;
            case selectId.type:
                params = update(params, {
                    type: {$set: 'last_modifier' }
                });
            }
        var updateData = update(this.state.datafilter, {
                params: {
                    $set: params
                },

                setValue: {
                    [label.id]: {$set: 0 }
                },
                filterLabel: {$splice: [[indexLabel, 1]]}
            });

        this.setState({ datafilter: updateData, shouldUpdate: true });
    },
    handleOnClickValidationButton: function(id) {
        var set = (id == 'category') ? 'fixedNumber' : 'category',
            number_docs = (id == 'category') ? this.refs.fixedNumberDoc.value : this.refs.overallCategory.value;
        var updateButton = update(this.state.buttonSample, {
             [id]: {$set: 'success' },
             [set]: {$set: 'normal' }
        });

        var updateRequest = update(this.state.datafilter, {
            request: {
                docs_sampled: { $set: parseInt(number_docs) }
            }
        });

        this.setState({ buttonSample: updateButton, datafilter: updateRequest, shouldUpdate: true });
    },

    handleSelectFixedNumber: function(event) {
        let updateButton = update(this.state.buttonSample, {
            fixedNumber: { $set: 'normal' },
            category: { $set: 'success' }
        });
        var updateRequest = update(this.state.datafilter, {
            request: {
                docs_sampled: { $set: parseInt(event.target.value) }
            }
        });
        this.setState({ buttonSample: updateButton, datafilter: updateRequest, shouldUpdate: true })
    },

    handleSelectOverall: function(event) {
        let updateButton = update(this.state.buttonSample, {
            fixedNumber: { $set: 'success' },
            category: { $set: 'normal' }
        });
        var updateRequest = update(this.state.datafilter, {
            request: {
                docs_sampled: { $set: parseInt(event.target.value) }
            }
        });
        this.setState({ buttonSample: updateButton, datafilter: updateRequest, shouldUpdate: true })
    },

    assignReviewersToCategory() {
        return makeRequest({
            path: "api/assign/reviewer/",
            method: "POST",
            params: JSON.stringify(this.state.datafilter.request),
            success: (res) => {
                console.log('assign done');
            }
        });
    },

    handleValidateButton: function() {
        var { current, info, list } = this.state.category;
        var indexCurrent = findIndex(list, { id: current.id, name: current.name });
        var { request } = this.state.datafilter;
        if(request.reviewers.length > 0) {
            if(indexCurrent < list.length) {

                var nextCategory = list[indexCurrent + 1];

                var setCurrent = update(this.state.category, {
                    current: { $set: nextCategory }
                });
                var setReviewer = update(this.state.datafilter, {
                    request: {
                        id: { $set: nextCategory.id },
                        name: { $set: nextCategory.name },
                        reviewers: { $set: [] }
                    },
                    //filterLabel: { $set: [] },

                    // setValue: {
                    //     timeframe: { $set: 0 },
                    //     users: { $set: 0 },
                    //     type: { $set: 0 }
                    // },
                    params: {
                        id: {
                            $set: list[indexCurrent + 1].id,
                        }
                    }
                });
                this.setState({ category: setCurrent, datafilter: setReviewer, shouldUpdate: true });
            }

        }
    },
    handleClearLabel: function() {
        var { current, info, list } = this.state.category;
        var setReviewer = update(this.state.datafilter, {
                filterLabel: { $set: [] },

                setValue: {
                    timeframe: { $set: 0 },
                    users: { $set: 0 },
                    type: { $set: 0 }
                },
                params: {
                    $set: {
                        id: current.id,
                        timeframe: 6,
                        users: 10,
                        type: 'last_modifier'
                    }
                }
            });
        this.setState({ datafilter: setReviewer, shouldUpdate: true });
    },

    setCategoryCurrent: function(categoryIndex) {
        var category = this.state.category.list[categoryIndex];

        var setCategory = update(this.state.category, {
            current: { $set: category }
        });

        var datafilter = update(this.state.datafilter, {
            request: {
                id: {
                    $set: category.id
                },
                name: {
                    $set: category.name
                },
                reviewers: {
                    $set: []
                }
            },

            setValue: {
                timeframe: {
                    $set: 0
                },
                users: {
                    $set: 0
                },
                type: {
                    $set: 0
                }
            },
            params: {
                id: {
                    $set: category.id
                }
            }
        });
        this.setState({ category: setCategory, datafilter: datafilter, shouldUpdate: true });
    },

    reviewerChart(list) {
        let data = [], categories = [];
        for(var i = 0, total = list.length; i < total; i++) {
            categories[i] = list[i].first_name + '.' + list[i].last_name;
            data[i] = list[i].number_hits;
        }

        return update(this.state.dataChart, {
            reviewerChart: {
                categories: {
                    $set: categories
                },
                data: {
                    $set: data
                }
            }
        });
    },

    documentTypeChart(info) {
        var { documents_types } = info, 
            documentType = {
                categories: ['Word', 'Excel', 'PDF', 'Power Point', 'Other'],
                series: []
            };

        for(let i = 0, total = documents_types.length; i < total; i++) {

            documentType.series[i] = {
                name: documents_types[i].name,
                data: []
            };

            for( let j = documents_types[i].doctypes.length - 1; j >= 0; j-- ) {

                documentType.series[i].data[j] = documents_types[i].doctypes[j].number_docs;

            }

        }

        return documentType;
    },

    confidentialityChart(info) {
        var { confidentialities } = info, confidentiality = [];
        for(let i = 0, total = confidentialities.length; i < total; i++) {
            confidentiality[i] = {
                name: upperFirst( confidentialities[i].name ),
                y: confidentialities[i].number_docs
            };
        }
        
        return confidentiality;
    },
    
    handleOnChangeSelectButton: function(checked, index) {
        //add reviewer into request
        var { list } = this.state.reviewer, 
            { request } = this.state.datafilter,
            indexReviewer = findIndex(request.reviewers, list[index]),

            reviewer = update(list[index], {
                id: {
                    $set: parseInt(list[index].id)
                }
            }),
            
            updateRequest = update(this.state.datafilter, {
                request: {
                    reviewers: (checked === 'on' && indexReviewer == -1) ? {$push: [reviewer] } : {$splice: [[indexReviewer, 1]]}
                }
            }),

            updateReviewer = update(this.state.reviewer, {
                list: {
                    [index]: {
                        selected: {
                            $set: checked
                        }
                    }
                }
            });
        this.setState({ datafilter: updateRequest, reviewer: updateReviewer, shouldUpdate: true });
    },
    handleOnChangeSelectAll: function(checked) {
        var { list } = this.state.reviewer,
            newList = [];

        var updateRequest = update(this.state.datafilter, {
            request: {
                reviewers: {$set: (checked == 'on') ? list : [] }
            }
        });

        var updateListReviewer = update(this.state.reviewer, {
            list: {
                $apply: (list) => {
                    let newList = [];
                    for(let i = list.length - 1; i >= 0; i--) {
                        newList[i] = Object.assign({}, list[i], {
                            selected: checked
                        });
                    }
                    return newList;
                }
            }
        });
        this.setState({ datafilter: updateRequest, reviewer: updateListReviewer, shouldUpdate: true });
    },


    getReviewers() {
        var { datafilter, category }  = this.state;

        makeRequest({
            path: 'api/assign/reviewer/',
            params: datafilter.params,
            success: (data) => {
                let indexSummaryCatgory = findIndex(this.state.summary, { id: this.state.category.current.id + "" });
                if(indexSummaryCatgory > -1) {
                    let reviewers = this.state.summary[indexSummaryCatgory].reviewers,
                        { request } = this.state.datafilter;
                    for(let i = data.length - 1; i >= 0; i--) {
                        let indexReviewer = findIndex(reviewers, {
                            id: parseInt(data[i].id)
                        });

                        if(indexReviewer > -1) {
                            data[i].selected = 'on';
                            request.reviewers.push(data[i]);
                        }
                    }
                }

                let updateListReviewer = update(this.state.reviewer, {
                    list: {
                        $set: data
                    },
                    current: {
                        $set: data[0]
                    }
                });
                this.setState({ reviewer: updateListReviewer, shouldUpdate: true, dataChart: this.reviewerChart(data) });
            }
        });
    },
    getCategories() {

        makeRequest({
            path: 'api/label/category/',
            success: (data) => {

                data = orderBy(data, ['name'], ['asc']);

                data[data.length] = {
                    id: "summary",
                    name: "Summary"
                }

                var updateData = update(this.state.category, {
                        list: {$set: data},
                        current: {$set: data[this.state.category.default] }
                    }),
                    updateParam = update(this.state.datafilter, {
                    params: {
                        id: {
                            $set: data[this.state.category.default].id,
                        }
                    },
                    request: {
                        id: {
                            $set: data[this.state.category.default].id,
                        },
                        name: {
                            $set: data[this.state.category.default].name
                        }
                    }
                });

               	this.setState({ category: updateData, datafilter: updateParam, shouldUpdate: true });
            }
        });
    	
    },
    getCategoryInfo() {
        var {current} = this.state.category;

        return makeRequest({
            path: 'api/assign/category/',
            params: { "id": current.id },
            success: (res) => {
                res.percentage_doc = orderBy(res.percentage_doc, ['percentage'], ['asc']);

                let updateCategoryInfo = update(this.state.category, {
                    info: {
                        $set: res
                    }
                });

                let updateDataChart = update(this.state.dataChart, {
                    confidentiality: {
                        $set: this.confidentialityChart(res)
                    },
                    documentType: {
                        $set: this.documentTypeChart(res)
                    }
                });
                this.setState({ category: updateCategoryInfo, dataChart: updateDataChart, shouldUpdate: true });
            }
        });
    },
    getSummary(sync = true) {
        makeRequest({
            sync: sync,
            path: "api/assign/summary/",
            success: (res) => {
                res = orderBy(res, ['name'], ['asc']);

                this.setState({ summary: res, isConfirming: 0, shouldUpdate: true });
            }
        });
    },

    onHideModal() {
        this.setState({ isConfirming: 0, shouldUpdate: true });
    },

    confirmNotify() {
        if(this.state.isConfirming === 2) return;
         
        let { summary } = this.state,
            bodyRequest = [];
        
        for(let i = summary.length - 1; i >= 0; i--) {
            bodyRequest[i] = {
                id: summary[i].id,
                name: summary[i].name
            }
        }
        makeRequest({
            method: "POST",
            path: "api/assign/notify/",
            params: JSON.stringify(bodyRequest),
            success: (res) => {
            },
            error: (err) => {
                if(err.status === 201) {
                    this.setState({ isConfirming: 1, shouldUpdate: true });
                    let closeModal = 0;

                    closeModal = setTimeout(() => {
                        this.setState({ isConfirming: 2, shouldUpdate: true });
                        clearTimeout(closeModal);
                    }, 3000);
                }
            }
        });
    },

    render:template
});

module.exports = UserAssignment;