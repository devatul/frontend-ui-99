'Use Strict';
import React, { Component,PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var HelpButton = React.createClass({

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

			<div className={this.props.className+' '+this.state.open}
				onMouseOver={this.handleOnMouseOver} onMouseOut={this.handleOnMouseOut}
			>
		       <a className="review_question_a help_question_a" aria-expanded="false"><i className="fa fa-question-circle" aria-hidden="true"></i></a>
		       <div className={this.props.type}>
		        <p style = {{'fontWeight' : 'normal' }}>{this.props.content}</p>
		      </div>
		       </div>
			)
		}
	});

	module.exports = HelpButton;