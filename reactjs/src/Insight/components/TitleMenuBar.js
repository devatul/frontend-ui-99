'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import HelpButton from './HelpButton'

var Title = React.createClass({
	render(){
		return(
			<h2 className="panel-title">
			      {this.props.title} <span style={{'marginLeft':'3px'}}></span>
			      <HelpButton type="overview_question_a" content = {this.props.helpInfo} />
			</h2>
		)
	}
});

module.exports = Title
