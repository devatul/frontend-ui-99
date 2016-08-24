'Use Strict';
import React, { Component,PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var HelpButton1 = React.createClass({
	
	propTypes :{
		content: PropTypes.string,
	},

	getInitialState: function() {
		return {
			open : '',
			backdrop:'',
			expanded: 'false',
		};
	},

	handleOnMouseOver(){
		this.setState({ open: 'open', expanded: 'true' });
		this.setState({ backdrop: 'dropdown-backdrop' });
	},
	handleOnMouseOut(){
		this.setState({ open: '', expanded: 'false' });
		this.setState({ backdrop: '' });
		
	},
	render(){
	
		return(

			<div className={'inline-block-item dropdown ' +  this.state.open } 
			onMouseOver={this.handleOnMouseOver} onMouseOut={this.handleOnMouseOut}>
			<a className={this.props.type}
			
			 aria-expanded={this.state.expanded}><i className="fa fa-question-circle" aria-hidden="true"></i></a>
			<div className="overview_timeframe help_timeframe dropdown-menu has-arrow dd-md full-mobile">
			<p>{this.props.content}</p>
			</div>
			
			</div>
			)
		}
	});

	module.exports = HelpButton1;

