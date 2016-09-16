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
        };
    },
    propTypes: {
        id: PropTypes.string,
      	data: PropTypes.array,
      	title: PropTypes.string,
        checkDefault: PropTypes.bool,
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

    componentDidMount() {
        var dropdown = this.refs.dropdown
        var dropdownmenu = this.refs.dropdownmenu
        
        $(dropdown).on('show.bs.dropdown', function() {
            $('#dropdownFilter').css({
                display: 'block',
                height: $(dropdownmenu).height() + 80 + 'px'
            });
        }.bind(this));

        $(dropdown).on('hide.bs.dropdown', function() {
            $('#dropdownFilter').css({
                display: 'block',
                height: ''
            });
        }.bind(this));
    },

    handleOnClick: function() {
        //$('#dropdownFilter').css({ display: 'block', height: '271px' });
    },

    handleOnChange: function(event, index) {
        var { id, title, data, checkDefault } = this.props, { checked } = event.target,
            field = {
                id: id,
                title: title,
                data: data,
                checkDefault: checkDefault,
                contextChange: {
                    index: index,
                    checked: checked
                }
            };
        this.props.onChange(field);
    },

    handleSelectAll: function(event) {
        var { id, title, data, checkDefault } = this.props, { checked } = event.target,
            field = {
                id: id,
                title: title,
                data: data,
                checked: checked
            };
    	this.props.onSelectAll(field);
    },

    handleClear: function(event) {
        var { id, title, data, checkDefault } = this.props, { checked } = event.target,
            field = {
                id: id,
                title: title,
                data: data
            };
    	this.props.onClear(field);
    },
    render() {
            var children = [];
            _.forEach(this.props.data, function(obj, index) {
                children[index] =  <li className={obj.checked && 'active'}>
                                    <a tabIndex={index}>
                                        <label className="checkbox">
                                        <input id={'checkbox_filter_' + index} type="checkbox"
                                            name="checkbox_filter"
                                            onChange={(event)=>this.handleOnChange(event, index)}
                                            value={index}
                                            checked={obj.checked}
                                            key={'selectBox_' + index}/>
                                        {obj.name}
                                        </label>
                                    </a>
                                </li>;
            }.bind(this));
        return (
        	<div ref="dropdown" className="btn-group dropdown is-child">
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
				<ul ref="dropdownmenu" className="multiselect-container dropdown-menu">
					<li className={'multiselect-item multiselect-all'}>
						<a href="#" tabIndex="0" className="multiselect-all" onClick={this.handleClear}>
                            <label className="checkbox">
                                <strong>Clear all</strong>
                            </label>
						</a>
					</li>
					{children}
				</ul>
                <span className="dropdown-backdrop" style={{ display: 'none' }}></span>
			</div>
        );
    }
});
module.exports = multiselectBox;