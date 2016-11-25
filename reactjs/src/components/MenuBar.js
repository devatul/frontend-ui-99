'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { browserHistory } from 'react-router'
import Constant from '../App/Constant.js'
import Demo from '../Demo.js';
import template from './MenuBar.rt'
import { assignIn, isEqual, forEach, concat, find, findIndex, remove, cloneDeep } from 'lodash'
import { orderByIndex, getCategories, getConfidentialities, getLanguages, getDoctypes, getScan, orderLanguages } from '../utils/function'

var MenuBar = React.createClass
({
  getInitialParams() {
    return {
                categories: [],
                confidentialities: [],
                'doc_types': [],
                languages: []
            }
  },

	getInitialState() {
	    return {
            categories: [],
            confidentialities: [],
            'doc_types': [],
            languages: [],

            params: this.getInitialParams(),

            labels: [],

            value: {
                category: 'label',
                confidentiality: "label",
                language: "label",
                doctype: 'label'
            },

            shouldUpdate: false,

            selectOpened: false,

            scanResult: {}
	    };
	},

	propTypes: {
		title: React.PropTypes.string,
        help: React.PropTypes.string,
        dataScan: React.PropTypes.object,
	    handleFilter: React.PropTypes.func,
	    showFilter: React.PropTypes.bool,
	    showInfo: React.PropTypes.bool
	},

    componentDidMount() {
        if (this.props.showFilter) {
            this.getCategories();
            this.getConfidentialities();
            this.getDoctypes();
            this.getLanguages();
        }
        if (this.props.showInfo && !this.props.dataScan) {
            this.getScanResult();
        }
    },

    componentWillReceiveProps(nextProps) {
        if(!isEqual(this.props.title != nextProps.title)) {
            this.setState({ shouldUpdate: true });
        }

        if(this.props.dataScan && !isEqual(this.props.dataScan, nextProps.dataScan)) {
            this.setState({ scanResult: nextProps.dataScan, shouldUpdate: true });
        }
    },


    shouldComponentUpdate(nextProps, nextState) {
        var { filter, scanResult, listLabel, value } = this.state;
        var {title} = this.props;
        return nextState.shouldUpdate;
    },

    componentWillUpdate(nextProps, nextState) {

    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.shouldUpdate === true) {
            this.setState({ shouldUpdate: false });
        }
        if (!isEqual(this.state.params, prevState.params)) {
          this.changeFilters();
        }
    },

  changeFilters() {
    var { params } = this.state,
      {
        categories,
        languages,
        confidentialities
      } = this.state.params;

    this.props.handleFilter(params);
  },

    configListLabel: function(data) {
        for(let i = data.length - 1; i >= 0; i--) {
            data[i].checked = false;
        }
    },
  getCategories: function(async) {
    getCategories({
      success: (data) => {
        for (let i = 0, len = data.length; i < len; ++i) {
          data[i].id = parseInt(data[i].id);
        }
        this.configListLabel(data);
        this.setState({ categories: data, shouldUpdate: true });
      }
    });
    },
    getConfidentialities: function(async) {
        getConfidentialities({
          success: (data) => {
                this.configListLabel(data);
                //data = orderByIndex(data, [4,3,2,1,0]);
                this.setState({ confidentialities: data, shouldUpdate: true });
            }
        });
    },
    getDoctypes: function(async) {
        getDoctypes({
            success: (data) => {
                this.configListLabel(data);

                this.setState({ ['doc_types']: data, shouldUpdate: true });
            }
        });
    },
    getLanguages: function(async) {
        getLanguages({
          success: (data) => {
                this.configListLabel(data);
                this.setState({ languages: orderLanguages(data), shouldUpdate: true });
            }
        });
    },

    onclearFilter: function() {
        let { labels, params } = this.state;

        for (let i = labels.length - 1; i >= 0; i--) {
            let splitId = labels[i].id.split('_');
            let array = this.state[splitId.slice(0, splitId.length - 1).join("_")];
            let index = array.findIndex(function (a) { return a.id == splitId[splitId.length - 1]; });

            if (index !== -1)
              array[index].checked = false;
        }

        this.setState({ labels: [], params: this.getInitialParams(), shouldUpdate: true });
    },

    onClickLabel: function(label, indexLabel) {
        let { labels } = this.state,
            splitId = label.id.split('_');
        let property = splitId.slice(0, splitId.length - 1).join("_");
      let index = this.state[property].findIndex(function (a) {
        return a.id == splitId[splitId.length - 1];
      });

            let updateParam = update(this.state.params, {
                [property]: {
                    $apply: (arr) => {
                        let label = this.state.labels[indexLabel];
                        arr = cloneDeep(arr);

                        for (let i = arr.length - 1; i >= 0; i--) {
                            if ((property + "_" + arr[i].id) === label.id) {
                                arr.splice(i, 1);
                                break;
                            }
                        }
                        return arr;
                    }
                }
            });

            let updateList = update(this.state[property], {
                [index]: {
                    checked: { $set: false }
                }
            });

            labels.splice(indexLabel, 1);

        this.setState({ [property]: updateList, params: updateParam, shouldUpdate: true });
    },

    addLabel: function(label) {
        let { labels } = this.state;
        labels.push(label);
    },

    deleteLabel(index) {
        let { labels } = this.state;
        labels.splice(index, 1);
    },

    onOpenSelect(event) {
        let intervalID;
        intervalID = setInterval(function() {
            this.handleOpenSelect(event, intervalID);
        }.bind(this), 300);
    },

    handleOpenSelect(event, intervalID) {
        let selection = document.getElementsByClassName('select2-results__option'),
            property = "",
            array = [];

        switch(event.target.id) {
            case "selectConfidentiality":
                property = "confidentialities";
            break;
            case "selectCategory":
                property = "categories";
            break;
            case "selectLanguage":
                property = "languages";
            break;
            case "selectDoctype":
                property = "doc_types"
        }

        array = this.state[property];

        for(let i = selection.length - 1; i >= 0; i--) {

            let splitId = selection[i].id.split('-'),
                indexObject = parseInt(splitId[splitId.length - 1]);

            if( array['checkall'] || (indexObject >= 0 && array[indexObject].checked)) {
                selection[i].className = "select2-results__option select2-results__option--highlighted-a";
            } else {
                //
                selection[i].className = "select2-results__option";
            }
        }
        clearInterval(intervalID);
    },

    handleOnChangeConfidentiality(event) {

        let index = event.target.value,
            property = "",
            array = [],
            selection = document.getElementsByClassName('select2-results__option'),
            length = event.target.length;

        switch(event.target.id) {
            case "selectConfidentiality":
                property = "confidentialities";
            break;
            case "selectCategory":
                property = "categories";
            break;
            case "selectLanguage":
                property = "languages";
            break;
            case "selectDoctype":
                property = "doc_types"
        }

        array = this.state[property];
        switch(true) {
            case index === 'all': {
                //array['checkall'] = !array['checkall'];
                for (let i = selection.length - 1; i >= 0; i--) {
                    let a = selection[i].id.split('-'),
                        indexCategory = parseInt(a[a.length-1]);

                        if (indexCategory >= 0) {
                            array[indexCategory].checked = false;
                        }
                }
            }
            break;
            case parseInt(index) >= 0: {
                array[index].checked = !array[index].checked;

                for (let i = array.length - 1; i >= 0; i--) {
                    if (!array[i].checked) {
                        array['checkall'] = false;
                    }
                }
            }
        }

        this.updateLabels(property);

        //
        for(let i = selection.length - 1; i >= 0; i--) {

            let splitId = selection[i].id.split('-'),
                indexObject = parseInt(splitId[splitId.length - 1]);

            if( array['checkall'] || (indexObject >= 0 && array[indexObject].checked)) {
                selection[i].className = "select2-results__option select2-results__option--highlighted-a";
            } else {
                //
                selection[i].className = "select2-results__option";
            }
        }

        for(let i = length - 1; i >= 0; i--) {
            if(event.target[i].value === 'label') {
                event.target[i].selected = true;
            }
        }

        this.setState({ params: this.updateParams(property), shouldUpdate: true });

        event.stopImmediatePropagation();
        //
    },

    updateLabels(property) {
        let array = this.state[property],
            { labels } = this.state,
            indexLabel = 0;


        if(!array['checkall']) {

            for(let i = array.length - 1; i >= 0; i--) {
                indexLabel = findIndex(labels, { id: property + '_' + array[i].id });

                if(indexLabel === -1 && array[i].checked) {
                    labels.push({
                        id: property + '_' + array[i].id,
                        name: array[i].name
                    })
                }
                if(indexLabel > -1 && !array[i].checked) {
                    labels.splice(indexLabel, 1);
                }
            }
        }
    },

    updateParams(property) {
        let { params } = this.state;
        let array = this.state[property];

        if(!params[property]) {
            params[property] = [];
        }

        let updateParam = update(params, {
            [property]: {
                $apply: (data) => {
                    data = cloneDeep(data);
                    //let indexParam = -1;
                    //
                    for(let i = array.length - 1; i >= 0; i--) {

                        let indexParam = findIndex(data, { id: array[i].id });

                        if(array[i].checked && indexParam === -1) {
                            data.push({
                                id: array[i].id,
                                name: array[i].name
                            });
                        }
                        if(!array[i].checked && indexParam >= 0) {
                            data.splice(indexParam, 1);
                        }
                    }
                    //
                    return data;
                }
            }
        });
        //
        return updateParam;
    },

    handleOnSelect: function(event) {


        // let updateValue = update(this.state.value, {
        //     confidentiality: { $set: event.target.value }
        // });

        //

        //this.setState({ value: updateValue });

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
        //         property = 'doc_types';
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

        //         updateFilter = update(this.state, {
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
            updateFilter = update(this.state, {
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
            updateFilter = update(this.state, {
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

  // FIXME: Code duplicated with OverView.js
    getScanResult() {
        getScan({
            success: (data) => {
              // FIXME: Demo fix, to be removed
              if (Demo.MULTIPLIER != 1) {
                data.documents_analyzed = parseInt(data.documents_analyzed) * Demo.MULTIPLIER;
                data.documents_skipped *= Demo.MULTIPLIER;
                data.total_correctly_classified *= Demo.MULTIPLIER;
                data.total_documents_scanned *= Demo.MULTIPLIER;
                data.total_duplicates *= Demo.MULTIPLIER;
                data.total_twins *= Demo.MULTIPLIER;

                for (let i = 0, len = data.categories.length; i < len; ++i) {
                  data.categories[i].total_classified_docs *= Demo.MULTIPLIER;
                  data.categories[i].total_docs *= Demo.MULTIPLIER;
                  data.categories[i].total_owner_accuracy_docs *= Demo.MULTIPLIER;
                  data.categories[i].total_reviewed_docs *= Demo.MULTIPLIER;
                  data.categories[i].total_validated_docs *= Demo.MULTIPLIER;
                }

                for (let i = 0, len = data.confidentialities.length; i < len; ++i) {
                  data.confidentialities[i].total_classified_docs *= Demo.MULTIPLIER;
                  data.confidentialities[i].total_docs *= Demo.MULTIPLIER;
                  data.confidentialities[i].total_owner_accuracy_docs *= Demo.MULTIPLIER;
                  data.confidentialities[i].total_reviewed_docs *= Demo.MULTIPLIER;
                  data.confidentialities[i].total_validated_docs *= Demo.MULTIPLIER;
                }

                for (let i = 0, len = data.doctypes.length; i < len; ++i) {
                  data.doctypes[i].total_docs *= Demo.MULTIPLIER;
                }

                for (let i = 0, len = data.languages.length; i < len; ++i) {
                  data.languages[i].total_docs *= Demo.MULTIPLIER;
                }
              }

                let { scanResult } = this.state,
                    updateResult = update(scanResult, {
                        $set: data
                    });
                this.setState({ scanResult: updateResult, shouldUpdate: true });
            }
        });
    },
    render:template
});
module.exports = MenuBar;
