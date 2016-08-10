import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './UserAssignment.rt'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import update from 'react-addons-update'
import javascript from '../script/javascript.js';
import Constant from '../Constant.js'
import userAssignment from '../script/chart-user-assignment.js'
import chartFilterAssignment from '../script/chart-filter-assignment.js'
import javascriptAssignement from '../script/javascript.assignement.js'
import 'jquery'
import _ from 'lodash';

var UserAssignment = React.createClass({
    mixins: [PureRenderMixin],
    static: {
        selectId: {
            timeframe: 'timeframe',
            numberuser: 'numberuser',
            reviewertype: 'reviewertype'
        }
    },
    getInitialState() {
        return {
            category: {
                list: [],
                reviewers: [],
                current: {},
                info: {},
                default: 0
            },
            buttonStatus: {
                category: '',
                fixedNumber: ''
            },
            datafilter: {
                params: {
                    id: 0,
                    timeframe: 6,
                    numberuser: 10,
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
                reviewerType: [
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
                    numberuser: 0,
                    reviewertype: 0
                },
                filterLabel: []
            },
            summary: []
        };
    },
    componentDidMount() {
    	this.getCategoryList();
    	console.log(this.state);
    	javascript();
    	//javascriptAssignement();
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
    componentDidUpdate(prevProps, prevState) {
        var { category } = this.state;
    	if(category.info != prevState.category.info) {
        	this.chartAssignment(this.state.category.info);
        }
        if(category.current != prevState.category.current) {
            this.getCategoryInfo();
            this.getReviewers();
        }
        if(category.reviewers != prevState.category.reviewers) {
            this.chartUserFilter(category.reviewers);
        }
        if(this.state.datafilter.params != prevState.datafilter.params) {
            this.getReviewers();
      	}
    },
    handleOnChangeSelectBox: function(data, field) {
        var { params, filterLabel } = this.state.datafilter;
        var { selectId } = this.static;
        var indexLabel = _.findIndex(filterLabel, {id: field.id });
        var label = _.assignIn({}, data);
            label.id = field.id;
        if(indexLabel == -1) {
            indexLabel = filterLabel.length;
        }
        switch(field.id) {
            case selectId.numberuser: 
                params = update(params, {
                    numberuser: {$set: data.value }
                });
                break;
            case selectId.timeframe:
                params = update(params, {
                    timeframe: {$set: data.value }
                });
                break;
            case selectId.reviewertype:
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
        });
        this.setState({ datafilter: updateData });
    },
    handleClickFilterLabel: function(label, index) {
        var { selectId } = this.static;
        var { params, filterLabel } = this.state.datafilter;
        var indexLabel = _.findIndex(filterLabel, {id: label.id });
        switch(label.id) {
            case selectId.numberuser: 
                params = update(params, {
                    numberuser: {$set: 10 }
                });
                break;
            case selectId.timeframe:
                params = update(params, {
                    timeframe: {$set: 6 }
                });
                break;
            case selectId.reviewertype:
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
        });
        this.setState({ datafilter: updateData });
    },
    handleOnClickValidationButton: function(id) {
        var updateButton = update(this.state.buttonStatus, {
            [id]: {$set: 'success' }
        });
        this.setState({ buttonStatus: updateButton });
    },
    handleValidateButton: function() {
        var { current, info, list } = this.state.category;
        var indexCategory = _.findIndex(list, { id: current.id, name: current.name });
        var { request } = this.state.datafilter;
            request.id = current.id;
            request.name = current.name;
            request.docs_sampled = info.number_docs;
        if(request.reviewers.length > 0) {
            $.ajax({
                method: 'POST',
                url: Constant.SERVER_API + "api/assign/reviewer/",
                dataType: "json",
                data: JSON.stringify(request),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
                },
                success: function(data) {
                    console.log("assign user", data);
                }.bind(this),
                error: function(xhr,error) {
                    if(xhr.status === 401)
                    {
                        browserHistory.push('/Account/SignIn');
                    }
                }.bind(this)
            });

            var setCurrent = update(this.state.category, {
                current: { $set: list[indexCategory + 1] }
            });
            var setReviewer = update(this.state.datafilter, {
                request: {
                    reviewers: { $set: [] }
                }
            });
            this.setState({ category: setCurrent, datafilter: setReviewer });

        }
    },
    setCategoryCurrent: function(categoryIndex) {
        var category = this.state.category.list[categoryIndex];
        var setCategory = update(this.state.category, {
            current: { $set: category }
        });
        this.setState({ category: setCategory });
    },
    chartAssignment(categoryInfo) {
    	userAssignment(categoryInfo);
    },
    chartUserFilter(reviewers) {    	
    	 chartFilterAssignment(reviewers);
    },
    
    handleOnChangeSelectButton: function(checked, index) {
        var { reviewers } = this.state.category;
        var { request } = this.state.datafilter;
        var indexReviewer = _.findIndex(request.reviewers, {id: reviewers[index].id });
        var updateRequest = update(this.state.datafilter, {
            request: {
                reviewers: (checked == 'on' && indexReviewer == -1) ? {$push: [reviewers[index]] } : {$splice: [[indexReviewer, 1]]}
            }
        });
        this.setState({ datafilter: updateRequest });
    },
    handleOnChangeSelectAll: function(checked) {
        var { reviewers } = this.state.category;

        var updateRequest = update(this.state.datafilter, {
            request: {
                reviewers: {$set: (checked == 'on') ? reviewers : [] }
            }
        });
        this.setState({ datafilter: updateRequest });
    },
    getReviewers() {
        var { datafilter, category }  = this.state;
        datafilter.params.id = category.current.id;
        var heightChart = 0;
        if(datafilter.params.numberuser <= 15){
            heightChart = datafilter.params.numberuser * 39;
        }else{
            heightChart = datafilter.params.numberuser * 37.5;
        }
        $('#userReviewChart').css({ 'height': heightChart });
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/reviewer/",
            dataType: 'json',
            data: datafilter.params,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state.category, {
                    reviewers: {$set: data}
                });
                this.setState({ category: updateState });
                console.log("reviewers ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCategoryList() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/category/",
            dataType: 'json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
               	var updateData = update(this.state.category, {
                    list: {$set: data},
                    current: {$set: data[this.state.category.default] }
                });
               	this.setState({ category: updateData });
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCategoryInfo() {
        var {current} = this.state.category;
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/assign/category/",
            dataType: 'json',
            async: false,
            data: { "id": current.id},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                debugger
                var updateData = update(this.state.category, {
                    info: {$set: data},
                });
                this.setState({ category: updateData });
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
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
                // var updateState = update(this.state, {
                //     summary: {$set: data},
                // });
                // this.setState(updateState);
                console.log("summary ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
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