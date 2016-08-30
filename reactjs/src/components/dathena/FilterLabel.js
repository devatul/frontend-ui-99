'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { forEach, isEqual } from 'lodash'

var FilterLabel = React.createClass({
	displayName: 'FilterLabel',

	propTypes: {
		data: React.PropTypes.array,
	    onClick: React.PropTypes.func,
		onClear: React.PropTypes.func
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return !isEqual(this.props.data != nextProps.data);
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
		var child = [], { data } = this.props;
			data &&
			forEach(data, (label, index) => {
				child[index] = <span
					                key={index}
					                className="filter-label label label-info">
					                <a className="filter-remove"
					                	onClick={()=>this.handleOnClick(label, index)}>
					                	<i className="fa fa-times"></i>
					                </a>
					                <span className="option-name">{label.name}</span>
					            </span>;
			});
		return (
			<div>
				{child}
				{ data.length > 0 && this.props.onClear &&
				<a onClick={this.clearFilter} className={'filter-label label label-info'} style={{backgroundColor: '#747474'}}>
					Clear <span style={{'textTransform' : 'lowercase'}}>all</span>
				</a>
				}
			</div>
		);
	}
});

module.exports = FilterLabel;