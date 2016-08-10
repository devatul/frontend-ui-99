'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var FilterLabel = React.createClass({
	displayName: 'FilterLabel',

	propTypes: {
		id: React.PropTypes.string,
		data: React.PropTypes.array,
	    onClick: React.PropTypes.func,
		onClear: React.PropTypes.func
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		if(this.props.data != nextProps.data) {
			return true;
		}
		return false;
	},
	handleOnClick: function(label, index) {
		this.props.onClick && 
			this.props.onClick(label, index);
	},
	clearFilter: function() {
		this.props.onClear &&
			this.props.onClear();
	},
	render: function() {
		var child = [];
			this.props.data &&
			_.forEach(this.props.data, function(label, index) {
				child[index] = <span
					                key={this.props.id + '_' + 'label' + '_' + index}
					                className="filter-label label label-info">
					                <a className="filter-remove"
					                	onClick={()=>this.handleOnClick(label, index)}>
					                	<i className="fa fa-times"></i>
					                </a>
					                <span className="option-name">{label.name}</span>
					            </span>;
			}.bind(this));
		return (
			<div>
				{child}

				{ this.props.data.length > 0 && this.props.onClear &&
				<span className={'filter-label label label-info'}
					style={{backgroundColor: '#747474'}}>
					<a className={'filter-remove'} onClick={this.clearFilter}>
					<i className={'fa fa-times'}></i>
					</a>
					<span className={'option-name'}>Clear Filter</span>
				</span>
				}
			</div>
		);
	}
});

module.exports = FilterLabel;