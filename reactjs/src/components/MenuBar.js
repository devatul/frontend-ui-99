'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { browserHistory } from 'react-router'
import Constant from '../Constant.js'
import template from './MenuBar.rt'
import { assignIn, isEqual, forEach, concat, find, remove, cloneDeep } from 'lodash'
import { makeRequest } from '../utils/http'

var MenuBar = React.createClass
({
	getInitialState() {
	    return {
            listLabel: {
                categories: [],
                confidentialities: [],
                'doc-types': [],
                languages: []
            },
            filter: {
                params: {
                    categories: [],
                    confidentialities: [],
                    'doc-types': [],
                    languages: []
                },
                labels: []
            },

            value: {
                category: 'label',
                confidentiality: "label"
            },

            shouldUpdate: false,

            scanResult: {},
	    };
	},
	propTypes: {
		title: React.PropTypes.string,
	    handleFilter: React.PropTypes.func,
	    showFilter: React.PropTypes.bool,
	    showInfo: React.PropTypes.bool
	},

    componentDidMount() {
        if(this.props.showFilter) {
            // let updateLabel = update(this.state.listLabel, {
            //     categories: { $set: this.getCategory() },
            //     confidentialities: { $set: this.getConfidentiality() },
            //     'doc-types': { $set: this.getDoctypes() },
            //     languages: { $set: this.getLanguages() }
            // });
            // this.setState({ listLabel: updateLabel });
            this.getCategories();
            this.getConfidentialities();
            this.getDoctypes();
            this.getLanguages();
        }
        if(this.props.showInfo) {
            this.getscanResult();
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        var { filter, scanResult, listLabel, value } = this.state;
        var {title} = this.props;
        return nextState.shouldUpdate;
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.state.shouldUpdate === true) {
            this.setState({ shouldUpdate: false });
        }
        if(!isEqual( this.state.filter.params, prevState.filter.params )) {
            var { params } = this.state.filter,
                {
                    categories,
                    languages,
                    confidentialities
                } = this.state.filter.params;

            if(categories && categories.length === 0) {
                delete params.categories;
            }

            if(confidentialities && confidentialities.length === 0) {
                delete params.confidentialities;
            }

            if(languages && languages.length === 0) {
                delete params.languages;
            }

            if(params["doc-types"] && params["doc-types"].length === 0) {
                delete params["doc-types"];
            }
            this.props.handleFilter(params);
        }
    },
    configListLabel: function(data) {
        for(let i = data.length - 1; i >= 0; i--) {
            data[i].checked = false;
        }
    },
	getCategories: function(async) {
        makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                this.configListLabel(data);

                let updateList = update(this.state.listLabel, {
                    categories: {
                        $set: data
                    }
                });

                this.setState({ listLabel: updateList, shouldUpdate: true });
            }
        });
    },
    getConfidentialities: function(async) {
        makeRequest({
            path: 'api/label/confidentiality/',
            success: (data) => {
                this.configListLabel(data);
                let updateList = update(this.state.listLabel, {
                    confidentialities: {
                        $set: data
                    }
                });
                
                this.setState({ listLabel: updateList, shouldUpdate: true });
            }
        });
    },
    getDoctypes: function(async) {
        makeRequest({
            path: 'api/label/doctypes/',
            success: (data) => {
                this.configListLabel(data);

                let updateList = update(this.state.listLabel, {
                    'doc-types': {
                        $set: data
                    }
                });

                this.setState({ listLabel: updateList, shouldUpdate: true });
            }
        });
    },
    getLanguages: function(async) {
        makeRequest({
            path: 'api/label/languages/',
            success: (data) => {
                this.configListLabel(data);

                let updateList = update(this.state.listLabel, {
                    'languages': {
                        $set: data
                    }
                });

                this.setState({ listLabel: updateList, shouldUpdate: true });
            }
        });
    },

    onclearFilter: function() {
        let { listLabel, filter } = this.state,
            { labels, params } = this.state.filter;

        for(let i = labels.length - 1; i >= 0; i--) {
            let propertyIndex = labels[i].id.split('_');

            listLabel = update(listLabel, {
                [propertyIndex[0]]: {
                    [propertyIndex[1]]: { checked: { $set: false } }
                }
            });
        }
        
        filter = update(filter, {
            params: { $set: {} },
            labels: { $set: [] }
        });

        this.setState({ listLabel: listLabel, filter: filter });
    },

    onClickLabel: function(label, index) {
        let { labels } = this.state.filter,
            { listLabel } = this.state,
            propertyIndex = label.id.split('_'),

            updateLabel = update(this.state.filter, {
                labels: { $splice: [[index, 1]] },
                params: {
                    [propertyIndex[0]]: {
                        $apply: (arr) => {
                            let label = listLabel[propertyIndex[0]][propertyIndex[1]];
                            arr = cloneDeep(arr);
                            
                            for(let i = arr.length - 1; i >= 0; i--) {
                                if(arr[i].id === label.id) {
                                    arr.splice(i, 1);
                                    break;
                                }
                            }
                            return arr;
                        }
                    }
                }
            }),
            updateList = update(listLabel, {
                [propertyIndex[0]]: {
                    [propertyIndex[1]]: { checked: { $set: false } }
                }
            });

        this.setState({ filter: updateLabel, listLabel: updateList });
    },

    updateFilterParams: function(property, contextChange) {
        let param,
            indexParam,
            { index, checked } = contextChange,
            params = this.state.filter.params,
            listLabel = this.state.listLabel[property];

        if(!checked) {
            var arr = params[property];
            for(let i = arr.length - 1; i >= 0; i--) {
                if(arr[i].id === listLabel[index].id) {
                    indexParam = i;
                }
            }
        }

        if(!params[property]) {
            params[property] = [];
        }

        param = {
            id: listLabel[index].id,
            name: listLabel[index].name
        };

        return update(params, {
            [property]: checked ? { $push: [param] } : { $splice: [[indexParam, 1]] }
        });
    },

    addLabel: function(label) {
        return update(this.state.filter.labels, { 
            $push: [label] 
        });
    },

    deleteLabel(id) {
        let indexLabel = 0, { labels } = this.state.filter;

        for( let i = labels.length - 1; i >= 0; i-- ) {
            if(labels[i].id === id) {
                indexLabel = i;
            }
        }

        return update(this.state.filter.labels, { $splice: [[indexLabel, 1]] });
    },

    handleOnUnSelect(field) {
        debugger
    },

    handleOnSelecting(event) {
        let updateValue = update(this.state.value, {
            confidentiality: { $set: event.target.value }
        });
        debugger
        this.setState({ value: updateValue, shouldUpdate: true });
    },

    handleOnSelect: function(event) {
        

        let updateValue = update(this.state.value, {
            confidentiality: { $set: 'label' }
        });

        debugger

        this.setState({ value: updateValue, shouldUpdate: true });
            
        // switch(field.id) {
        //     case "SelectConfidentiality": {
        //         property = 'confidentialities';
        //     }
        //     break;

        //     case "SelectCategory": {
        //         property = 'categories';
        //     }
        //     break;

        //     case "SelectDoctype": {
        //         property = 'doc-types';
        //     }
        //     break;

        //     case "SelectLanguage": {
        //         property = 'languages';
        //     }
        // }
            
        // if(property) {
        //     var updateList = update(this.state.listLabel, {
        //             [property]: {
        //                 [index]: {
        //                     checked: { $set: checked }
        //                 }
        //             }
        //         }),
                
        //         label = {
        //             id: field.id + '_' + index,
        //             name: listLabel[property][index].name
        //         },

        //         updateLabel = checked ? this.addLabel(label) : this.deleteLabel(label.id),

        //         updateParam = this.updateFilterParams( property, field.contextChange ),

        //         updateFilter = update(this.state.filter, {
        //             params: { $set: updateParam },
        //             labels: { $set: updateLabel }
        //         });
        //     this.setState({ filter: updateFilter, listLabel: updateList });
        // }
    },

    handleSelectAll: function(field) {
        var updateLabel = update(this.state.listLabel, {
                [field.id]: {
                    $apply: function(arr) {
                        arr = cloneDeep(arr);
                        for(let i = arr.length - 1; i >= 0; i--) {
                            arr[i].checked = field.checked;
                        }
                        return arr;
                    } 
                }
            }),
            updateFilter = update(this.state.filter, {
               params: {
                    [field.id]: field.checked ? {
                        $apply: () => {
                           let params = [], arr = updateLabel[field.id], i = arr.length - 1;
                           for(; i >= 0; i--) {
                               params[i] = {
                                   id: arr[i].id,
                                   name: arr[i].name
                               };
                           }
                           return params;
                       }
                    } : {
                        $set: []
                    }
                },

                labels: {
                    $apply: (arr) => {
                        if( field.checked === false ) {
                            arr = cloneDeep(arr);

                            for(let i = arr.length - 1; i >= 0; i--) {
                                let pattern = new RegExp('^' + field.id + '_.*', 'g');
                                if(pattern.test(arr[i].id)) {
                                    arr.splice(i, 1);
                                }
                            }
                        }
                        return arr;
                    }
                }
            });

        this.setState({ listLabel: updateLabel, filter: updateFilter });
    },

    handleClearAll: function(field) {
        var updateLabel = update(this.state.listLabel, {
                [field.id]: {
                    $apply: function(arr) {
                        arr = cloneDeep(arr);
                        for(let i = arr.length - 1; i >= 0; i--) {
                            arr[i].checked = false;
                        }
                        return arr;
                    } 
                }
            }),
            updateFilter = update(this.state.filter, {
               params: {
                    [field.id]: { $set: [] }
                    // [field.id]: field.checked ? {
                    //     $apply: () => {
                    //        let params = [], arr = updateLabel[field.id], i = arr.length - 1;
                    //        for(; i >= 0; i--) {
                    //            params[i] = {
                    //                id: arr[i].id,
                    //                name: arr[i].name
                    //            };
                    //        }
                    //        return params;
                    //    }
                    // } : {
                    //     $set: []
                    // }
                },

                labels: {
                    $apply: (arr) => {
                        //if( field.checked === true ) {
                            arr = cloneDeep(arr);

                            for(let i = arr.length - 1; i >= 0; i--) {
                                let pattern = new RegExp('^' + field.id + '_.*', 'g');
                                if(pattern.test(arr[i].id)) {
                                    arr.splice(i, 1);
                                }
                            }
                        //}
                        return arr;
                    }
                }
            });

        this.setState({ listLabel: updateLabel, filter: updateFilter });
    },
    
    getscanResult() {
        makeRequest({
            path: 'api/scan/',
            success: (data) => {
                let { scanResult } = this.state,
                    updateResult = update(scanResult, {
                        $set: data
                    });
                
                this.setState({ scanResult: updateResult });
            }
        });  
    },
	 render:template
});
module.exports = MenuBar;