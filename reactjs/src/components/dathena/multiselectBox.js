'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var multiselectBox = React.createClass({
    displayName: 'multiselectBox',

    getInitialState: function() {
        return {
            checkList: [],
            field: {
                id: 'id',
                name: 'name',
                selectId: 'id box',
                index: 'index object',
                checked: 'check box',
                value: 'value'
            }
        };
    },
    propTypes: {
        key: PropTypes.string,
      	data: PropTypes.array,
      	title: PropTypes.string,
        checked: PropTypes.bool,
      	onChange: PropTypes.func,
      	onClick: PropTypes.func,
        onSelectAll: PropTypes.func,
        onClear: PropTypes.func
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.data != nextProps.data) {
            return true;
        }
        return false;
    },
    handleOnClick: function() {

    },
    handleClear: function(event) {
        var field = {
            name: event.target.name,
            selectId: this.props.id,
            checked: event.target.checked,
            value: event.target.value
        }
        this.props.onClear(field);
    },
    handleOnChange: function(event,index) {
        var field = {
            id: this.props.data[index].id,
            name: this.props.data[index].name,
            selectId: this.props.id,
            index: index,
            checked: event.target.checked,
            value: event.target.value
        }
        this.props.onChange(field, index);
    },
    handleSelectAll: function(event) {
        var field = {
            name: event.target.name,
            selectId: this.props.id,
            checked: event.target.checked,
            value: event.target.value
        }
    	this.props.onSelectAll(field);
    },
    render() {
            var children = [];
            _.forEach(this.props.data, function(obj, index) {
                children[index] =  <li className={obj.checked && 'active'}>
                                    <a tabIndex={index}>
                                        <label className="checkbox">
                                        <input id={'checkbox_filter_' + index} type="checkbox"
                                            name="checkbox_filter"
                                            onChange={(event)=>this.handleOnChange(event,index)}
                                            value={index}
                                            checked={obj.checked}
                                            key={'selectBox_' + index}/>
                                        {obj.name}
                                        </label>
                                    </a>
                                </li>;
            }.bind(this));
        return (
        	<div className="btn-group">
				<button type="button"
					key={this.props.key + '_'}
					onClick={this.handleOnClick}
					className="multiselect dropdown-toggle btn btn-default"
					data-toggle="dropdown"
					title={this.props.title}
					aria-expanded="false">
					<span className="multiselect-selected-text">{this.props.title}</span>
					<b className="caret"></b>
				</button>
				<ul className="multiselect-container dropdown-menu">
					<li className={'multiselect-item multiselect-all'}>
						<a tabIndex="0" className="multiselect-all">
						<label className="checkbox">
							<input ref="checkall"
                                name={'select_all'}
                                key={this.props.id + '_select_all'}
                                checked={this.state.checkall}
								onChange={this.handleSelectAll}
								type="checkbox" value="multiselect-all"/>
							Select all
						</label>
						</a>
					</li>
                    <li className={'multiselect-item multiselect-all'}>
                        <a tabIndex="0" className="multiselect-all">
                        <label className="checkbox">
                            <input ref="clearFilter"
                                name={'Clear_Checkbox'}
                                key={this.props.id + 'Clear_Filter'}
                                checked={this.state.clearChecked}
                                onChange={this.handleClear}
                                type="checkbox" value="Clear_Filter"/>
                            Clear Filter
                        </label>
                        </a>
                    </li>
					{children}
				</ul>
			</div>
        );
    }
});
module.exports = multiselectBox;