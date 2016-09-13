'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import Dropdown from '../bootstrap/Dropdown'
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
            <Dropdown.custom className="btn-group dropdown" onShow={this.props.onShow} onClose={this.props.onClose}>
                <Dropdown.toggle className="multiselect dropdown-toggle btn btn-default">
                    <span className="multiselect-selected-text">{this.props.title}</span>
                </Dropdown.toggle>
                <Dropdown.menu elementType="ul" className="multiselect-container dropdown-menu">
                    <li className={'multiselect-item multiselect-all'}>
						<a href="#" tabIndex="0" className="multiselect-all" onClick={this.handleClear}>
                            <label className="checkbox">
                                <strong>Clear all</strong>
                            </label>
						</a>
					</li>
					{children}
                </Dropdown.menu>
            </Dropdown.custom>
            
        );
    }
});
module.exports = multiselectBox;