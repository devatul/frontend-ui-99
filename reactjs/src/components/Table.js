import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import _ from 'lodash'

export class Table extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Table';
    }
    render() {
        return <table
                    className="review_table table table-bordered table-striped mb-none no-footer table-my-actions"
                    id="table-my-actions"
                    role="grid"
                    aria-describedby="datatable-default_info">
                    {this.props.children}
                </table>;
    }
}

export class TableHead extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TableHead';
        this.props = {
        	column: [
                {name: 'Document name', desc: "desc"},
                {name: 'Document name1', desc: "desc1"}
            ]
        }
    }
    myMap(arr, callback) {
        if(arr instanceof Array ) {
            for(var i = 0; i < arr.length; i++) {
                (function(i) {
                    return callback(i, arr[i]);
                 })(i);
            }
        } else {
            return 'No Array';
        }
    }

    render() {
    	var child = [];
		this.myMap(this.props.column, function(index, obj) {
			child[index] =  <th className="review_note" key={ index }>{obj.name}
                                <div className="r dropdown dropdown-file-info-holder inline-block-item">
                                    <a data-toggle="dropdown" className="review_question_a help_question_a">
                                    <i className="fa fa-question-circle" aria-hidden="true"></i></a>
                                    <div className="note_chart_content dropdown-menu has-arrow dd-md full-mobile">
                                    <p>{obj.desc}</p>
                                    </div>
                                </div>
                            </th>;
		}.bind(this));
        return <thead>
            <tr>
        	{child}
            </tr>
        </thead>;
    }
}

export class TableBody extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TableRow';
        this.props = {
            dataTable: React.PropTypes.object
        }
    }
    myMap(arr, callback) {
        if(arr instanceof Array ) {
            for(var i = 0; i < arr.length; i++) {
                (function(i) {
                    return callback(i, arr[i]);
                 })(i);
            }
        } else {
            return 'No Array';
        }
    }
    render() {
        var child = [];
        debugger
            this.myMap(this.props.dataTable.body, function(index, obj) {
                child[index] = <TableRow key={index} contents={obj} index={index}/>
            }.bind(this));
        return <tbody>
            {child}
        </tbody>;
    }
}

export class selectBox extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'selectBox';
        this.props = {
            dataOption: [],
            onChange: React.PropTypes.func,
            defaultValue: React.PropTypes.string
        }

        this.handleOnChange = this.handleOnChange.bind(this);
        this.myMap = this.myMap.bind(this);
    }
    handleOnChange(event) {
        var value = event.target.value;
        var filed = {
            name: this.displayName,
            value: value,
            props: this.props
        };
        this.props.onChange(filed);
    }
    myMap(arr, callback) {
        if(arr instanceof Array ) {
            for(var i = 0; i < arr.length; i++) {
                (function(i) {
                    return callback(i, arr[i]);
                 })(i);
            }
        } else {
            return 'No Array';
        }
    }
    render() {
        var child = [];
            debugger
            this.myMap([{id: 1, name: 'select 1'}, {id: 2, name: 'select'}], function(index, obj) {
                debugger
                child[index] = <option
                                    key={index}
                                    value={index}>
                                    {obj.name}
                                </option>;
            }.bind(this));
        return  <select
                    onChange={this.handleOnChange} {...this.props}>
                    {child}
                </select>;
    }
}

export class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TableRow';
        this.state = {
            data: []
        }
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    handleOnChange() {

    }
    handleOnClick() {

    }
    myMap(arr, callback) {
        if(arr instanceof Array ) {
            for(var i = 0; i < arr.length; i++) {
                (function(i) {
                    return callback(i, arr[i]);
                 })(i);
            }
        } else {
            return 'No Array';
        }
    }
    render() {
        return <tr>
                    <td>
                        <div className="checkbox-custom checkbox-default">
                            <input
                              type="checkbox"
                              className="checkbox-item-1"/>
                            <label></label>
                        </div>
                    </td>
                    <td className="text-left">
                        <span
                          className="text-italic file-name doc-path-2"
                          data-toggle="modal"
                          data-target="#previewModal"
                          data-file-url="sample.image_url">
                            <span
                              className="file-name-1"
                              data-toggle="tooltip"
                              data-original-title="sample.name">
                              sample.name
                            </span>
                        </span>
                        <div className="dropdown dropdown-file-info-holder inline-block-item">
                            <span className="btn-file-info fa fa-info-circle" data-toggle="dropdown"></span>
                            <div className="dropdown-menu has-arrow dropdown-file-info append-to-body">
                                <ul>
                                    <li>Name: sample.name</li>
                                    <li>Creation Date: sample.creation_date</li>
                                    <li>Modifitcation Date: sample.modification_date</li>
                                    <li>Required Legal Retention until: sample.legal_retention_until</li>
                                    <li>Confidentiality Label: sample.confidentiality_label</li>
                                    <li>Number of Classification Challenge: sample.number_of_classification_challenge</li>
                                </ul>
                            </div>
                        </div>
                    </td>
                <td className="text-left">
                    <span className="text-italic doc-path">sample.path</span>
                </td>
                <td className="text-left">
                    <span className="text-italic">sample.owner</span>
                </td>
                <td rt-scope="sample.current as current">
                    <div className="select-group">
                        <div className="selected-info">
                            <div className="progress progress-striped light">
                              <div
                                className="progress-bar progressbar-warning"
                                role="progressbar"
                                aria-valuenow="60"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={ {width: 60 + '%'} }>
                              </div>
                              <span className="progress-percentage" style={ {color: '#000'} }>
                                (60%)
                              </span>
                            </div>
                        </div>
                        <select
                          style={ { textTransform: 'capitalize'} }
                          className="form-control"
                          onChange=""
                          value="current.category">
                          <option
                            rt-repeat="category in sample.categories"
                            key="ategoryIndex"
                            value="categoryIndex">
                            category.name
                          </option>
                        </select>
                    </div>
                </td>
                <td rt-scope="sample.current as current">
                    <div className="select-group">
                        <div className="selected-info">
                            <div className="progress progress-striped light">
                              <div
                                className="progress-bar progressbar"
                                role="progressbar"
                                aria-valuenow=""
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={ {width: 23 + '%'} }>
                              </div>
                              <span className="progress-percentage" style={ {color: '#000'} }>(23%)</span>
                            </div>
                        </div>
                        <selectBox defaultValue="1" style={ {textTransform: 'capitalize'} } className="form-control" dataOption={[{id: 1, name: 'select 1'}, {id: 2, name: 'select 2'}]}/>
                    </div>
                </td>
                <td>
                    <a style={ {cursor: 'pointer'} }
                     className="doc-check validated" onClick="">
                      <i className="fa fa-clock-o" aria-hidden="true"></i>
                      <i className="fa fa-check" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>;
    }
}