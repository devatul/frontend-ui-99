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
            checkall : this.props.checked
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

    handleOnChange: function(event, index) {
        var field = {
            id: this.props.data[index].id,
            name: this.props.data[index].name,
            selectId: this.props.id,
            index: index,
            checked: event.target.checked,
        }
        console.log('field',field)
        this.props.onChange(field, index);
    },

    handleSelectAll: function(event) {
        if(this.state.checkall == false) {
            this.setState({checkall : true})
        } else {
            this.setState({checkall : false})
        }
           
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
                children[index] =  <li className={obj.checked && 'active'} key = {'selectBox_' + index}>
                                    <a tabIndex={index}>
                                        <label className="checkbox">
                                        <input id={'checkbox_filter_' + index} type="checkbox"
                                            name="checkbox_filter"
                                            onChange={(event)=>this.handleOnChange(event, index)}
                                            value={index}
                                            checked={obj.checked}
                                            />
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
								onChange={this.handleSelectAll}
								type="checkbox" value="multiselect-all"
                                checked={this.state.checkall}
                                />
							Clear all
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