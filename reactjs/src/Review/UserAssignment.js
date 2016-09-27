import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './UserAssignment.rt'
import update from 'react/lib/update'
import javascript from '../script/javascript.js'
import Constant from '../Constant.js'
import { upperFirst, findIndex, assignIn, isEqual } from 'lodash'
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
                category: '',
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
                    docs_sampled: 0,
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
            summary: {
                id: 'summary',
                data: []
            },
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
            }
        };
    },

    shouldComponentUpdate(nextProps, nextState) {
        var { category, datafilter, dataChart, buttonSample } = this.state;
        return !isEqual(category, nextState.category)
        || !isEqual( datafilter, nextState.datafilter )
        || !isEqual( dataChart, nextState.dataChart )
        || !isEqual( buttonSample, nextState.buttonSample );
    },
    
    componentDidMount() {
    	this.getCategoryList();
    	console.log(this.state);
    	javascript();
    },

    componentDidUpdate(prevProps, prevState) {
        var { category } = this.state;


    	
        if(category.current != prevState.category.current) {
            if(category.current.id === "summary") {
                this.getSummary();
            } else {
                this.getReviewers();

                setTimeout(this.getCategoryInfo, 10);
            }

            //this.getCategoryInfo();

            // var info = this.getCategoryInfo(),

            //     reviewers = this.getReviewers(),

            //     updateData = update(this.state.category, {
            //         info: { $set: info },
            //         reviewers: { $set: reviewers }
            //     }),
                
            //     updateChart = update(this.state.dataChart, {
            //         documentType: { $set: this.documentTypeChart(info) },
            //         confidentiality: { $set: this.categoryInfoChart(info) }
            //     });

            // this.setState({ category: updateData, dataChart: updateChart });

        }
        debugger
        if(this.state.reviewer.current != prevState.reviewer.current) {
            //this.getCategoryInfo();
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
        debugger
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
                params: {$set: params },
                
                setValue: {
                    [field.id]: {$set: field.value }
                },
                filterLabel: {
                    [indexLabel]: {$set: label}
                }
            }),
            
            updateReviewer = update(this.state.category, {
                reviewers: { $set: this.getReviewers( params ) }
            });
        this.setState({ datafilter: updateData, category: updateReviewer });
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
                params: {$set: params },

                setValue: {
                    [label.id]: {$set: 0 }
                },
                filterLabel: {$splice: [[indexLabel, 1]]}
            }),

            updateReviewer = update(this.state.category, {

                reviewers: { $set: this.getReviewers(params) }

            });
        this.setState({ datafilter: updateData, category: updateReviewer });
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

        this.setState({ buttonSample: updateButton, datafilter: updateRequest });
    },

    handleSelectFixedNumber: function() {
        let updateButton = update(this.state.buttonSample, {
            fixedNumber: { $set: 'normal' },
            category: { $set: 'success' }
        });
        this.setState({ buttonSample: updateButton })
    },

    handleSelectOverall: function() {
        let updateButton = update(this.state.buttonSample, {
            fixedNumber: { $set: 'success' },
            category: { $set: 'normal' }
        });
        this.setState({ buttonSample: updateButton })
    },

    handleValidateButton: function() {
        var { current, info, list } = this.state.category;
        var indexCurrent = findIndex(list, { id: current.id, name: current.name });
        var { request } = this.state.datafilter;

        if(request.reviewers.length > 0) {

            makeRequest({
                path: "/api/assign/reviewer/",
                method: "POST",
                params: request,
                success: (res) => {
                    console.log('assign done');
                }
            });

            if(indexCurrent < list.length) {

                var setCurrent = update(this.state.category, {
                    current: { $set: list[indexCurrent + 1] }
                });
                var setReviewer = update(this.state.datafilter, {
                    request: {
                        reviewers: { $set: [] }
                    },
                    //filterLabel: { $set: [] },

                    // setValue: {
                    //     timeframe: { $set: 0 },
                    //     users: { $set: 0 },
                    //     type: { $set: 0 }
                    // },
                    // params: {
                        
                    //     $set: {
                    //         id: current.id,
                    //         timeframe: 6,
                    //         users: 10,
                    //         type: 'last_modifier'
                    //     }
                    // }
                });
                this.setState({ category: setCurrent, datafilter: setReviewer });
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
            }),

            updateReviewer = update(this.state.category, {

                reviewers: { $set: this.getReviewers({
                        id: current.id,
                        timeframe: 6,
                        users: 10,
                        type: 'last_modifier'
                    }) }

            });
            debugger
        this.setState({ datafilter: setReviewer, category: updateReviewer });
    },

    setCategoryCurrent: function(categoryIndex) {
        var category = this.state.category.list[categoryIndex];
        var setCategory = update(this.state.category, {
            current: { $set: category }
        });
        var datafilter = update(this.state.datafilter, {
            request: {
                reviewers: { $set: [] }
            },
            filterLabel: { $set: [] },
            setValue: {
                timeframe: { $set: 0 },
                users: { $set: 0 },
                type: { $set: 0 }
            }
        });
        this.setState({ category: setCategory, datafilter: datafilter });
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
        var { list } = this.state.reviewer, 
            { request } = this.state.datafilter,
            indexReviewer = findIndex(request.reviewers, {id: list[index].id }),
            
            updateRequest = update(this.state.datafilter, {
                request: {
                    reviewers: (checked == 'on' && indexReviewer == -1) ? {$push: [list[index]] } : {$splice: [[indexReviewer, 1]]}
                }
            });
        this.setState({ datafilter: updateRequest });
    },
    handleOnChangeSelectAll: function(checked) {
        var { list } = this.state.reviewer;

        var updateRequest = update(this.state.datafilter, {
            request: {
                reviewers: {$set: (checked == 'on') ? list : [] }
            }
        });
        this.setState({ datafilter: updateRequest });
    },

    handleClickBackDrop: function(event) {
        if(event.target.id == 'backDropFilter') {
            event.target.style.height = "200px";
        }
        
        //debugger
    },

    selectBoxOnOpen: function(field) {
        //this.refs.backDropFilter.style.width = '560px';
        this.refs.backDropFilter.style.height = '300px';
        //debugger
    },



    getReviewers( params ) {
        var { datafilter, category }  = this.state;
            
            datafilter.params.id = category.current.id;

        var data = [
                {
                "number_hits": 20,
                "first_name": "chris",
                "last_name": "muffat",
                "type": "last_modifier",
                "id": 1
                },
                {
                "number_hits": 15,
                "first_name": "tony",
                "last_name": "gomez",
                "type": "last_modifier",
                "id": 2
                },
                {
                "number_hits": 10,
                "first_name": "chris",
                "last_name": "columbus",
                "type": "last_modifier",
                "id": 3
                }
            ];

        // makeRequest({
        //     path: 'api/assign/reviewer/',
        //     params: params ? params : datafilter.params,
        //     success: (data) => {
                let updateListReviewer = update(this.state.reviewer, {
                    list: {
                        $set: data
                    },
                    current: {
                        $set: data[0]
                    }
                });
                debugger
                this.setState({ reviewer: updateListReviewer, dataChart: this.reviewerChart(data) });
        //     }
        // });
    },
    getCategoryList() {

        makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                data[data.length] = {
                    id: "summary",
                    name: "Summary"
                }

                var updateData = update(this.state.category, {
                    list: {$set: data},
                    current: {$set: data[this.state.category.default] }
                });

               	this.setState({ category: updateData });
            }
        });
    	
    },
    getCategoryInfo() {
        var {current} = this.state.category;

        var data = {
                "percentage_doc": [
                    {
                    "percentage": 0.17,
                    "number_docs": 10
                    },
                    {
                    "percentage": 0.34,
                    "number_docs": 20
                    }
                ],
                "doc_percentage": [
                    {
                    "percentage": 0.17,
                    "number_docs": 10
                    },
                    {
                    "percentage": 0.34,
                    "number_docs": 20
                    }
                ],
                "number_docs": 168000,
                "confidentialities": [
                    {
                    "name": "Banking Secrecy",
                    "number_docs": 20,
                    "percentage": 10
                    },
                    {
                    "name": "Secret",
                    "number_docs": 20,
                    "percentage": 20
                    },
                    {
                    "name": "Confidential",
                    "number_docs": 20,
                    "percentage": 30
                    },
                    {
                    "name": "Internal",
                    "number_docs": 20,
                    "percentage": 20
                    },
                    {
                    "name": "Public",
                    "number_docs": 20,
                    "percentage": 20
                    }
                ],
                "documents_types": [
                    {
                    "name": "Banking Secrecy",
                    "doctypes": [
                        {
                        "name": "Word",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Excel",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "PDF",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Power Point",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Others",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        }
                    ]
                    },
                    {
                    "name": "Secret",
                    "doctypes": [
                        {
                        "name": "Word",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Excel",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "PDF",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Power Point",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Others",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        }
                    ]
                    },
                    {
                    "name": "Confidential",
                    "doctypes": [
                        {
                        "name": "Word",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Excel",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "PDF",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Power Point",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Others",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        }
                    ]
                    },
                    {
                    "name": "Internal",
                    "doctypes": [
                        {
                        "name": "Word",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Excel",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "PDF",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Power Point",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Others",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        }
                    ]
                    },
                    {
                    "name": "Public",
                    "doctypes": [
                        {
                        "name": "Word",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Excel",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "PDF",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Power Point",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        },
                        {
                        "name": "Others",
                        "number_docs": 20,
                        "percentage_of_all_docs_in_this_doc_type": 10
                        }
                    ]
                    }
                ]
            };

        // makeRequest({
        //     path: 'api/assign/category/',
        //     params: { "id": current.id },
        //     success: (res) => {
                let updateCategoryInfo = update(this.state.category, {
                    info: {
                        $set: data
                    }
                });

                let updateDataChart = update(this.state.dataChart, {
                    confidentiality: {
                        $set: this.confidentialityChart(data)
                    },
                    documentType: {
                        $set: this.documentTypeChart(data)
                    }
                });

                this.setState({ category: updateCategoryInfo, dataChart: updateDataChart });
        //     }
        // });
    },
    getSummary() {
        makeRequest({
            path: "api/assign/summary/",
            success: (res) => {
                debugger
                this.setState({ summary: res });
            }
        });
        // $.ajax({
        //     method: 'GET',
        //     url: Constant.SERVER_API + "api/assign/summary/",
        //     dataType: 'json',
        //     beforeSend: function(xhr) {
        //         xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
        //     },
        //     success: function(data) {
        //         // var updateState = update(this.state, {
        //         //     summary: {$set: data},
        //         // });
        //         // this.setState(updateState);
        //         console.log("summary ok: ", data);
        //     }.bind(this),
        //     error: function(xhr,error) {
        //         if(xhr.status === 401)
        //         {
        //             browserHistory.push('/Account/SignIn');
        //         }
        //     }.bind(this)
        // });
    },
    render:template
});

module.exports = UserAssignment;