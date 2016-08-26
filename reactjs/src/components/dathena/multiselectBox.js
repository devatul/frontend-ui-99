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
        debugger
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
            debugger
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
        	<div ref="dropdown" className="btn-group dropdown">
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
					{children}
				</ul>
			</div>
        );
    }
});
module.exports = multiselectBox;