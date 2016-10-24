'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react/lib/update'
import { browserHistory } from 'react-router'
import Constant from '../Constant.js'
import template from './InsightMenuBar.rt'
import javascript from '../script/javascript.js'
import _, { isEqual } from 'lodash'
import 'jquery'

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
            filterLabel: [
                /*{
                                    checked: true,
                                    id: 1,
                                    index: 1,
                                    name: 'Top 5',
                                    selectId: "number_users",
                                    value: '1'
                                }
                */
            ],
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
            /*  this.getConfidentiality(true);
              this.getCategory(true);
              this.getDoctypes(true);
              this.getLanguages(true);*/
            this.copyNumberOfUser(true);
        }
    },
    componentDidUpdate(prevProps, prevState) {
        if (this.state.filter != prevState.filter) {

            var filter = this.state.filter;
            /*if (filter.languages != null) {
                filter.languages.length === 0 && delete this.state.filter.languages;
            }
            if (filter["doc-types"] != null) {
                filter["doc-types"].length === 0 && delete this.state.filter["doc-types"];
            }
            if (filter.confidentialities != null) {
                filter.confidentialities.length === 0 && delete this.state.filter.confidentialities;
            }
            if (filter.categories != null) {
                filter.categories.length === 0 && delete this.state.filter.categories;
            }*/
            if (filter == null) {
                this.props.handleFilter({ number_users: 'Top 5' });
            }
            this.props.handleFilter(this.state.filter);



        }
        if (this.state.dataSelectBox != prevState.dataSelectBox) {

            this.state.eventContext.length > 1 && this.updateFilterList(this.state.eventContext)
                /*  this.updateNumberUser(this.state.eventContext)*/
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
            /*console.log('object', newObject)*/
            arr.push(newObject);
        }.bind(this));
        newData[id] = arr;
        this.setState({
            dataSelectBox: newData
        });
        /*  console.log('dataSelectBox', newData)*/
    },
    getCategory: function(async) {
        $.ajax({
            url: Constant.SERVER_API + 'api/label/category/',
            dataType: 'json',
            method: 'GET',
            async: async,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                this.copyToDataSelectBox(data, this.static.categoryId);
                this.setState({
                    list: {
                        [this.static.categoryId]: data
                    }
                });
            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status == 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getConfidentiality: function(async) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/confidentiality/",
            dataType: 'json',
            async: async,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                data.reverse();
                this.copyToDataSelectBox(data, this.static.confidentialId);
                this.setState({
                    list: {
                        [this.static.confidentialId]: data
                    }
                });
            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status == 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getDoctypes: function(async) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/doctypes/",
            dataType: 'json',
            async: async,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                this.copyToDataSelectBox(data, this.static.doctypeId);
                this.setState({
                    list: {
                        [this.static.doctypeId]: data
                    }
                });
            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status == 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getLanguages: function(async) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/languages/",
            dataType: 'json',
            async: async,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                this.copyToDataSelectBox(data, this.static.languageId);
                this.setState({
                    list: {
                        [this.static.languageId]: data
                    }
                });
            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status == 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
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
                    /* console.log('fitter', filter['number_users'])  */
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
                console.log("arr", arr)
            }
            this.setState({
                filterLabel: arr
            });
            console.log('filterLabel', this.state.filterLabel)
                /* console.log('filterLabel', this.state.filterLabel)*/
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
        console.log('field_then', field)
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
        /* console.log('dataSelectBox_notNumber', this.state.dataSelectBox)*/
        if (field.checked) {
            this.addLabel(field);
        } else {
            this.deleteLabelByIdName(field, field.id, field.name);
        }
    },
    handleSelectNumber(field, index) {
        var updateData_selected = _.assignIn({}, this.state.dataSelectBox)
            /*  console.log('updateData_selected', this.state.dataSelectBox)*/
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
        /* console.log('dataselected', updateData)*/
        this.setState({
                dataSelectBox: updateData,
                eventContext: field.selectId
            })
            /* console.log('dataSelectBox', this.state.dataSelectBox['number_users'])*/
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
            console.log(object.selectId)
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
        console.log("selectBox_after:", this.state.dataSelectBox)
        console.log("filterLabel_after:", this.state.filterLabel)

    },
    getScanResult() {
        $.ajax({
            url: Constant.SERVER_API + 'api/scan/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                var update_scan_result = update(this.state, {
                    scan_result: {
                        $set: data
                    }
                });
                this.setState(update_scan_result);
            }.bind(this),
            error: function(xhr, status, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    render: template
});
module.exports = MenuBar1;
