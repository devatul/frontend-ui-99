'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react/lib/update'
import { browserHistory } from 'react-router'
import Constant from '../Constant.js'
import template from './InsightMenuBar.rt'
import javascript from '../script/javascript.js'
import _, { isEqual } from 'lodash'
import $ from 'jquery'
import { getLanguages, getCategories, getConfidentialities, getDoctypes } from '../utils/function'

var MenuBar1 = React.createClass({
    static: {
        categoryId: 'categories',
        confidentialId: 'confidentialities',
        doctypeId: 'doc-types',
        languageId: 'languages',
        selectAll: 'select_all',
        numberId: 'number_users'
    },
    getInitialState() {
        return {
            checked: 0,
            list: {},
            scan_result: {},
            filter: {},
            dataSelectBox: {},
            filterLabel: [],
            eventContext: '',
            numberofUser: [{
                "id": 1,
                "name": 'Top 5'
            }, {
                "id": 2,
                "name": 'Top 15'
            }, {
                "id": 3,
                "name": 'Top 25'
            }, {
                "id": 4,
                "name": 'Top 50'
            }],
            numberUser: 5
        };
    },
    propTypes: {
        title: React.PropTypes.string,
        handleFilter: React.PropTypes.func,
        showFilter: React.PropTypes.bool,
        showInfo: React.PropTypes.bool
    },
    OnClick() {

        $("#dropdownFilter").show()
    },
    addCommas(nStr) {
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
    componentDidMount() {
        if (this.props.showFilter) {
            this.copyNumberOfUser(true);
        }
    },
    componentDidUpdate(prevProps, prevState) {
        if (this.state.filter != prevState.filter) {
            var filter = this.state.filter;
            if (filter == null) {
                this.props.handleFilter({ number_users: 'Top 5' });
            }
            this.props.handleFilter(this.state.filter);
        }
        if (this.state.dataSelectBox != prevState.dataSelectBox) {
            this.state.eventContext.length > 1 && this.updateFilterList(this.state.eventContext)
        }
    },
    copyToDataSelectBox: function(data, id) {
        var newData = _.assignIn({}, this.state.dataSelectBox);
        var arr = [];
        var newObject = {};
        _.forEach(data, function(object, index) {
            newObject = _.assignIn({}, object);
            newObject.checked = false;
            newObject.selectId = id;
            newObject.index = index;
            arr.push(newObject);
        }.bind(this));
        newData[id] = arr;
        this.setState({
            dataSelectBox: newData
        });
    },
    copyListNumberToSelecbox: function(data, id) {
        var newData = _.assignIn({}, this.state.dataSelectBox);
        var arr = [];
        var newObject = {};
        _.forEach(data, function(object, index) {
            newObject = _.assignIn({}, object);
            if (index == 0) {
                newObject.checked = true;
                newObject.selectId = id;
                newObject.index = index;
            } else {
                newObject.checked = false;
                newObject.selectId = id;
                newObject.index = index;
            }
            arr.push(newObject);
        }.bind(this));
        newData[id] = arr;
        this.setState({
            dataSelectBox: newData
        });
    },
    getCategory: function(async) {
        getCategories({
            success: function(data) {
                this.copyToDataSelectBox(data, this.static.categoryId);
                this.setState({
                    list: {
                        [this.static.categoryId]: data
                    }
                });
            }
        });
    },
    getConfidentiality: function(async) {
        getConfidentialities({
            success: function(data) {
                data.reverse();
                this.copyToDataSelectBox(data, this.static.confidentialId);
                this.setState({
                    list: {
                        [this.static.confidentialId]: data
                    }
                });
            }
        });
    },
    getDoctypes: function(async) {
        getDoctypes({
            success: function(data) {
                this.copyToDataSelectBox(data, this.static.doctypeId);
                this.setState({
                    list: {
                        [this.static.doctypeId]: data
                    }
                });
            }
        });
    },
    getLanguages: function(async) {
        getLanguages({
            success: function(data) {
                this.copyToDataSelectBox(data, this.static.languageId);
                this.setState({
                    list: {
                        [this.static.languageId]: data
                    }
                });
            },
            error: function(xhr, error) {
                if (xhr.status == 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }
        });
    },
    copyNumberOfUser(async) {
        this.copyListNumberToSelecbox(this.state.numberofUser, this.static.numberId);
        this.setState({
            list: {
                [this.static.numberId]: this.state.numberofUser
            }
        });
    },
    clearFilter: function() {

        var data = this.state.dataSelectBox;
        _.forEach(this.state.filterLabel, function(object, index) {
            var updateData = update(data, {
                [object.selectId]: {
                    [object.index]: {
                        $merge: {
                            checked: false
                        }
                    }
                }
            });
            data = updateData;
        }.bind(this));
        this.setState({
            dataSelectBox: data,
            filterLabel: [],
            filter: null
        });
        this.copyNumberOfUser()
    },
    onClickLabel: function(label, index) {
        var listLabel = _.concat(this.state.filterLabel);
        listLabel.splice(index, index + 1);
        var updateData = update(this.state.dataSelectBox, {
            [label.selectId]: {
                [label.index]: {
                    checked: {
                        $set: false
                    }
                }
            }
        });
        this.setState({
            dataSelectBox: updateData,
            filterLabel: listLabel
        });
    },


    updateFilterList: function(selectId) {

        var filter = _.assignIn({}, this.state.filter);
        var arr = [];
        var number = this.state.numberUser;
        filter['number_users'] = this.state.numberUser;
        if (selectId == 'number_users') {
            _.forEach(this.state.dataSelectBox[selectId], function(object, index) {
                if (object.checked) {
                    number = object.name, filter['number_users'] = object.name;
                }
            })
        } else {
            _.forEach(this.state.dataSelectBox[selectId], function(object, index) {
                if (object.checked) {
                    arr.push({
                        id: object.id,
                        name: object.name
                    });
                }
            })
            filter[selectId] = arr;
        }
        this.setState({
            numberUser: number
        })
        this.setState({
            filter: filter
        });
    },
    addLabel: function(field) {
        if (field.selectId == 'number_users') {
            var arr = _.concat(field, _.drop(this.state.filterLabel));
            this.setState({
                filterLabel: arr
            });
        } else {
            var arr = this.state.filterLabel;
            if (_.find(arr, {
                    id: field.id,
                    name: field.name
                }) == null) {

                arr.push(field);
            }
            this.setState({
                filterLabel: arr
            });
        }
    },

    deleteLabelByIdName: function(field, id, name) {
        var arr = _.concat(this.state.filterLabel);
        _.remove(arr, {
            id: id,
            name: name
        });
        this.setState({
            filterLabel: arr
        });
    },
    handleSelectBoxChange: function(field, index) {
        var updateData = update(this.state.dataSelectBox, {
            [field.selectId]: {
                [index]: {
                    checked: {
                        $set: field.checked
                    }
                }
            }
        });
        this.setState({
            dataSelectBox: updateData,
            eventContext: field.selectId
        });
        if (field.checked) {
            this.addLabel(field);
        } else {
            this.deleteLabelByIdName(field, field.id, field.name);
        }
    },
    handleSelectNumber(field, index) {
        var updateData_selected = _.assignIn({}, this.state.dataSelectBox)
        for (var i = 0; i < 4; i++) {
            if (i == index) {
                updateData_selected.number_users[i].checked = true;
                this.setState({
                    checked: index
                })
            } else {
                updateData_selected.number_users[i].checked = false
            }
        }
        var updateData = update(this.state.dataSelectBox, {
            [field.selectId]: {
                [index]: {
                    checked: {
                        $set: field.checked
                    }
                }
            }
        });
        this.setState({
                dataSelectBox: updateData,
                eventContext: field.selectId
            })
        if (field.checked) {
            this.addLabel(field);
        } else {
            this.deleteLabelByIdName(field, field.id, field.name);
        }
    },
    handleSelectAll: function(id) {
        let arr = []
        let filterLabel_clone = _.cloneDeep(this.state.filterLabel);
        let selectBox_clone = this.state.dataSelectBox;
        _.forEach(filterLabel_clone, function(object, index) {
            if (object.selectId == id) {
                arr.push(index);
                var updateData = update(selectBox_clone, {
                    [object.selectId]: {
                        [object.index]: {
                            $merge: {
                                checked: false
                            }
                        }
                    }
                });
                selectBox_clone = updateData
            }
        }.bind(this));

        _.pullAt(filterLabel_clone, arr)

        this.setState(update(this.state, {
                filterLabel: { $set: filterLabel_clone },
                dataSelectBox: { $set: selectBox_clone }
            }))
            /*this.setState({dataSelectBox : {$set : selectBox_clone }})*/
    },

    render: template
});
module.exports = MenuBar1;
